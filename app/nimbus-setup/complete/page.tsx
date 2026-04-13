import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export default async function NimbusSetupCompletePage() {
  const state = await prisma.platformSetupState.findFirst();
  if (state?.setupCompleted) {
    redirect("/admin/login");
  }

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/nimbus-setup");
  }

  const email = session.user.email;
  const name = session.user.name ?? email;

  const [admin] = await prisma.$transaction([
    prisma.adminUser.upsert({
      where: { email },
      update: { name, role: "super_admin", status: "active" },
      create: { email, name, role: "super_admin", status: "active" },
    }),
    prisma.user.upsert({
      where: { email },
      update: { name },
      create: { email, name },
    }),
  ]);

  await prisma.platformSetupState.upsert({
    where: { id: state?.id ?? "bootstrap" },
    update: {
      setupCompleted: true,
      initialAdminUserId: admin.id,
      completedAt: new Date(),
    },
    create: {
      id: "bootstrap",
      setupCompleted: true,
      setupPath: "/nimbus-setup",
      initialAdminUserId: admin.id,
      completedAt: new Date(),
    },
  });

  await prisma.platformConfiguration.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      platformAwsAccountId:
        process.env.NIMBUS_PLATFORM_AWS_ACCOUNT_ID ?? "123456789012",
      externalIdStrategy: "per-integration",
      defaultRegion: "us-east-1",
      onboardingMode: "self-service",
      batchIntervalHours: 24,
    },
  });

  await createAuditLog({
    entityType: "admin_user",
    entityId: admin.id,
    action: "platform.bootstrap",
    actor: admin.id,
    actorEmail: admin.email,
    actorType: "admin",
    module: "platform",
    summary: `Bootstrap da plataforma por ${admin.email}`,
  });

  redirect("/nimbus-setup/done");
}
