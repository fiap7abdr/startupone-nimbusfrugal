"use server";

import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export async function removeMember(memberId: string) {
  const { user, tenant } = await requireTenant();

  if (tenant.ownerUserId !== user.id) {
    throw new Error("Only the tenant owner can remove members.");
  }

  const member = await prisma.tenantMember.findUnique({
    where: { id: memberId },
  });

  if (!member || member.tenantId !== tenant.id) {
    throw new Error("Member not found.");
  }

  if (member.userId === user.id) {
    throw new Error("You cannot remove yourself.");
  }

  await prisma.tenantMember.delete({ where: { id: memberId } });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      entityType: "tenant_member",
      entityId: memberId,
      action: "member.removed",
      actor: user.email,
      actorType: "user",
    },
  });

  revalidatePath("/app/users");
}

export async function changeMemberRole(memberId: string, newRole: string) {
  const { user, tenant } = await requireTenant();

  if (tenant.ownerUserId !== user.id) {
    throw new Error("Only the tenant owner can change roles.");
  }

  if (newRole !== "owner" && newRole !== "read") {
    throw new Error("Invalid role.");
  }

  const member = await prisma.tenantMember.findUnique({
    where: { id: memberId },
  });

  if (!member || member.tenantId !== tenant.id) {
    throw new Error("Member not found.");
  }

  if (member.userId === user.id) {
    throw new Error("You cannot change your own role.");
  }

  await prisma.tenantMember.update({
    where: { id: memberId },
    data: { targetGroup: newRole },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      entityType: "tenant_member",
      entityId: memberId,
      action: "member.role_changed",
      actor: user.email,
      actorType: "user",
      metadataJson: { newRole },
    },
  });

  revalidatePath("/app/users");
}

export async function resendInvite(invitationId: string) {
  const { user, tenant } = await requireTenant();

  const invitation = await prisma.tenantInvitation.findUnique({
    where: { id: invitationId },
    include: { tenant: true },
  });

  if (!invitation || invitation.tenantId !== tenant.id) {
    throw new Error("Invitation not found.");
  }

  if (invitation.status !== "pending") {
    throw new Error("Invitation is not pending.");
  }

  // Reset expiration
  const newExpiry = new Date();
  newExpiry.setDate(newExpiry.getDate() + 7);

  await prisma.tenantInvitation.update({
    where: { id: invitationId },
    data: { expiresAt: newExpiry, lastSentAt: new Date() },
  });

  const baseUrl = process.env.NODE_ENV === "production" ? "https://nimbusfrugal.cloud" : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3100");
  const inviteUrl = `${baseUrl}/invitations/${invitation.token}`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Nimbus Frugal <no-reply@nimbusfrugal.cloud>",
    to: invitation.email,
    subject: `Convite para ${tenant.name} — Nimbus Frugal`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 0;">
        <h2 style="color: #1E3A8A;">Nimbus Frugal</h2>
        <p>Olá,</p>
        <p><strong>${user.name ?? user.email}</strong> convidou você para o tenant <strong>${tenant.name}</strong> como <strong>${invitation.targetGroup}</strong>.</p>
        <p>Clique no botão abaixo para aceitar o convite:</p>
        <a href="${inviteUrl}" style="display: inline-block; background: #1E3A8A; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Aceitar convite
        </a>
        <p style="margin-top: 24px; font-size: 13px; color: #6B7280;">
          Este convite expira em 7 dias. Se você não solicitou este convite, ignore este email.
        </p>
        <p style="font-size: 13px; color: #6B7280;">
          Link direto: <a href="${inviteUrl}">${inviteUrl}</a>
        </p>
      </div>
    `,
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      entityType: "tenant_invitation",
      entityId: invitationId,
      action: "invitation.resent",
      actor: user.email,
      actorType: "user",
    },
  });

  revalidatePath("/app/users");
}

export async function revokeInvite(invitationId: string) {
  const { user, tenant } = await requireTenant();

  const invitation = await prisma.tenantInvitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation || invitation.tenantId !== tenant.id) {
    throw new Error("Invitation not found.");
  }

  if (invitation.status !== "pending") {
    throw new Error("Invitation is not pending.");
  }

  await prisma.tenantInvitation.update({
    where: { id: invitationId },
    data: { status: "revoked" },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      entityType: "tenant_invitation",
      entityId: invitationId,
      action: "invitation.revoked",
      actor: user.email,
      actorType: "user",
    },
  });

  revalidatePath("/app/users");
}
