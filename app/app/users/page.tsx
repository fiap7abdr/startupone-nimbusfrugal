import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { formatDate } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { inviteUserSchema } from "@/lib/validations";
import { getTranslations } from "next-intl/server";
import { Resend } from "resend";
import { createAuditLog } from "@/lib/audit";
import { MembersTable } from "./members-table";
import { InvitationsTable } from "./invitations-table";
import { InviteSubmitButton } from "./invite-submit-button";

async function inviteUser(formData: FormData) {
  "use server";
  const { tenant, user } = await requireTenant();
  const parsed = inviteUserSchema.safeParse({
    email: formData.get("email"),
    group: formData.get("group") ?? "read",
  });
  if (!parsed.success) return;
  const { email, group: targetGroup } = parsed.data;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invitation = await prisma.tenantInvitation.create({
    data: {
      tenantId: tenant.id,
      email,
      invitedByUserId: user.id,
      targetGroup,
      expiresAt,
    },
  });

  const baseUrl = process.env.NODE_ENV === "production" ? "https://nimbusfrugal.cloud" : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3100");
  const inviteUrl = `${baseUrl}/invitations/${invitation.token}`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Nimbus Frugal <no-reply@nimbusfrugal.cloud>",
    to: email,
    subject: `Convite para ${tenant.name} — Nimbus Frugal`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 0;">
        <h2 style="color: #1E3A8A;">Nimbus Frugal</h2>
        <p>Olá,</p>
        <p><strong>${user.name ?? user.email}</strong> convidou você para o tenant <strong>${tenant.name}</strong> como <strong>${targetGroup}</strong>.</p>
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

  await createAuditLog({
    tenantId: tenant.id,
    entityType: "tenant_invitation",
    entityId: invitation.id,
    action: "invitation.created",
    actor: user.id,
    actorEmail: user.email,
    module: "invitations",
    summary: `Convidou ${email} como ${targetGroup}`,
    after: { email, targetGroup },
  });
  revalidatePath("/app/users");
}

export default async function UsersPage() {
  const { user, tenant } = await requireTenant();
  const isOwner = tenant.ownerUserId === user.id;
  const [t, tc] = await Promise.all([
    getTranslations("users"),
    getTranslations("common"),
  ]);
  const [members, invitations] = await Promise.all([
    prisma.tenantMember.findMany({
      where: { tenantId: tenant.id },
      include: { user: true },
      orderBy: { joinedAt: "asc" },
    }),
    prisma.tenantInvitation.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const memberEmails = new Set(members.map((m) => m.user.email));

  const serializedMembers = members.map((m) => ({
    id: m.id,
    userId: m.userId,
    targetGroup: m.targetGroup,
    membershipStatus: m.membershipStatus,
    joinedAt: m.joinedAt.toISOString(),
    userName: m.user.name,
    userEmail: m.user.email,
  }));

  const serializedInvitations = invitations.map((inv) => ({
    id: inv.id,
    email: inv.email,
    token: inv.token,
    targetGroup: inv.targetGroup,
    status: inv.status,
    expiresAt: inv.expiresAt.toISOString(),
    lastSentAt: (inv.lastSentAt ?? inv.createdAt).toISOString(),
    isRegistered: memberEmails.has(inv.email),
  }));

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("members")} ({members.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MembersTable
              members={serializedMembers}
              currentUserId={user.id}
              isOwner={isOwner}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("invite_title")}</CardTitle>
            <CardDescription>
              {t("invite_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={inviteUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{tc("email")}</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">{t("col_group")}</Label>
                <select
                  id="group"
                  name="group"
                  className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm"
                  defaultValue="read"
                >
                  <option value="owner">Owner</option>
                  <option value="read">Read</option>
                </select>
              </div>
              <InviteSubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>

      {invitations.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{tc("recent_invites")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <InvitationsTable invitations={serializedInvitations} isOwner={isOwner} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
