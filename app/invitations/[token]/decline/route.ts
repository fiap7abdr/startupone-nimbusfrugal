import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const invitation = await prisma.tenantInvitation.findUnique({
    where: { token },
    include: { tenant: true },
  });
  if (!invitation || invitation.status !== "pending") {
    redirect("/");
  }

  const session = await auth();
  const userEmail = session?.user?.email ?? null;

  await prisma.tenantInvitation.update({
    where: { id: invitation.id },
    data: { status: "declined" },
  });

  await createAuditLog({
    tenantId: invitation.tenantId,
    entityType: "tenant_invitation",
    entityId: invitation.id,
    action: "invitation.declined",
    actor: userEmail ?? invitation.email,
    actorEmail: userEmail ?? invitation.email,
    module: "invitations",
    summary: `Convite para ${invitation.tenant.name} recusado por ${userEmail ?? invitation.email}`,
    before: { email: invitation.email, targetGroup: invitation.targetGroup },
  });

  redirect(session ? "/app" : "/");
}
