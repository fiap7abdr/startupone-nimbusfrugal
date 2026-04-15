import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/invitations/${token}?flow=accept`)}`);
  }

  const invitation = await prisma.tenantInvitation.findUnique({
    where: { token },
    include: { tenant: true },
  });
  if (!invitation || invitation.status !== "pending" || invitation.expiresAt < new Date()) {
    redirect("/app");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect("/login");

  const existingMembership = await prisma.tenantMember.findUnique({
    where: { tenantId_userId: { tenantId: invitation.tenantId, userId: user.id } },
  });

  if (!existingMembership) {
    await prisma.tenantMember.create({
      data: {
        tenantId: invitation.tenantId,
        userId: user.id,
        targetGroup: invitation.targetGroup,
        membershipStatus: "active",
      },
    });
  }

  await prisma.tenantInvitation.update({
    where: { id: invitation.id },
    data: { status: "accepted", acceptedAt: new Date() },
  });

  await createAuditLog({
    tenantId: invitation.tenantId,
    entityType: "tenant_invitation",
    entityId: invitation.id,
    action: "invitation.accepted",
    actor: user.id,
    actorEmail: user.email,
    module: "invitations",
    summary: `Aceitou convite para ${invitation.tenant.name}`,
    after: { email: user.email, targetGroup: invitation.targetGroup },
  });

  const cookieStore = await cookies();
  cookieStore.set("active-tenant-id", invitation.tenantId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/app/dashboard");
}
