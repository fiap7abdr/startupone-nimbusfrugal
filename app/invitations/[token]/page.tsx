import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Users } from "lucide-react";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const invitation = await prisma.tenantInvitation.findUnique({
    where: { token },
    include: { tenant: true },
  });

  if (!invitation) notFound();

  const expired = invitation.expiresAt < new Date();
  const alreadyAccepted = invitation.status !== "pending";

  const session = await auth();
  const sessionEmail = session?.user?.email ?? null;
  const emailMatches =
    sessionEmail?.toLowerCase() === invitation.email.toLowerCase();

  // Se está logado com conta diferente da convidada, força logout.
  if (sessionEmail && !emailMatches && !expired && !alreadyAccepted) {
    redirect(`/invitations/${token}/logout`);
  }

  // Verifica se o email convidado já existe como usuário da plataforma.
  const existingUser = await prisma.user.findUnique({
    where: { email: invitation.email },
    select: { id: true },
  });

  const t = await getTranslations("auth");

  async function loginAndAccept() {
    "use server";
    await signIn("google", { redirectTo: `/invitations/${token}/accept` });
  }

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
              ) : emailMatches ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t("invite_already_member_prompt")}
                  </p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1" size="lg">
                      <Link href={`/invitations/${token}/decline`}>
                        {t("invite_decline")}
                      </Link>
                    </Button>
                    <Button asChild className="flex-1" size="lg">
                      <Link href={`/invitations/${token}/accept`}>
                        {t("accept_invite")}
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : existingUser ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t("invite_existing_user_prompt")}
                  </p>
                  <form action={loginAndAccept}>
                    <SubmitButton variant="outline" className="w-full" size="lg" pendingText={t("accept_invite")}>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      {t("accept_invite")}
                    </SubmitButton>
                  </form>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t("invite_login_prompt")}
                  </p>
                  <form action={loginAndAccept}>
                    <SubmitButton variant="outline" className="w-full" size="lg" pendingText={t("accept_invite")}>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      {t("accept_invite")}
                    </SubmitButton>
                  </form>
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
