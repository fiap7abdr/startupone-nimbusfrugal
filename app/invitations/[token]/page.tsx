import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Users } from "lucide-react";
import Link from "next/link";
import { createAuditLog } from "@/lib/audit";

async function acceptInvitation(token: string, userEmail: string) {
  const invitation = await prisma.tenantInvitation.findUnique({
    where: { token },
    include: { tenant: true },
  });
  if (!invitation || invitation.status !== "pending") {
    redirect("/app");
  }
  if (invitation.expiresAt < new Date()) {
    redirect("/app");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
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
    actor: user.email,
    module: "invitations",
    summary: `Aceitou convite para ${invitation.tenant.name}`,
    after: { email: userEmail, targetGroup: invitation.targetGroup },
  });

  const cookieStore = await cookies();
  cookieStore.set("active-tenant-id", invitation.tenantId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ flow?: string }>;
}) {
  const { token } = await params;
  const { flow } = await searchParams;

  const invitation = await prisma.tenantInvitation.findUnique({
    where: { token },
    include: { tenant: true },
  });

  if (!invitation) notFound();

  const expired = invitation.expiresAt < new Date();
  const alreadyAccepted = invitation.status !== "pending";

  const session = await auth();
  const isLoggedIn = !!session?.user?.email;

  // Logged in + flow=accept → user just came back from signup/login, auto-accept
  if (isLoggedIn && flow === "accept" && !expired && !alreadyAccepted) {
    await acceptInvitation(token, session.user!.email!);
    redirect("/app/dashboard");
  }

  // Logged in without flow=accept → sign out and redirect back (force signup flow)
  if (isLoggedIn && !expired && !alreadyAccepted) {
    await signOut({ redirect: false });
    redirect(`/invitations/${token}`);
  }

  const t = await getTranslations("auth");
  const callbackUrl = `/invitations/${token}?flow=accept`;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-md px-6 py-20">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle className="mt-4">{t("invite_title")}</CardTitle>
              <CardDescription>
                {t("invite_text")}{" "}
                <strong>{invitation.tenant.name}</strong> {t("invite_as")}{" "}
                <strong>{invitation.targetGroup}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {expired ? (
                <p className="text-sm text-negative">
                  {t("invite_expired")}
                </p>
              ) : alreadyAccepted ? (
                <p className="text-sm text-muted-foreground">
                  {t("invite_used")}
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t("invite_login_prompt")}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button asChild className="w-full" size="lg">
                      <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                        {t("invite_signup")}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                        {t("invite_login")}
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
