import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/auth";
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

async function acceptInvitation(formData: FormData) {
  "use server";

  const token = String(formData.get("token") ?? "");
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/login?callbackUrl=/invitations/${token}`);
  }

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

  await prisma.auditLog.create({
    data: {
      tenantId: invitation.tenantId,
      entityType: "tenant_invitation",
      entityId: invitation.id,
      action: "invitation.accepted",
      actor: user.email,
      actorType: "user",
    },
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
  const isLoggedIn = !!session?.user?.email;

  if (!isLoggedIn) {
    redirect(`/login?callbackUrl=/invitations/${token}`);
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
              <CardTitle className="mt-4">Convite para tenant</CardTitle>
              <CardDescription>
                Voce foi convidado para{" "}
                <strong>{invitation.tenant.name}</strong> como{" "}
                <strong>{invitation.targetGroup}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {expired ? (
                <p className="text-sm text-negative">
                  Este convite expirou. Solicite um novo convite ao
                  administrador do tenant.
                </p>
              ) : alreadyAccepted ? (
                <p className="text-sm text-muted-foreground">
                  Este convite ja foi aceito.
                </p>
              ) : (
                <form action={acceptInvitation}>
                  <input type="hidden" name="token" value={token} />
                  <Button type="submit" className="w-full" size="lg">
                    Aceitar convite
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
