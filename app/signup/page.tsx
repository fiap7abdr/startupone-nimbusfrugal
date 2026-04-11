import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { signIn } from "@/auth";
import { signupSchema } from "@/lib/validations";

async function createAccount(formData: FormData) {
  "use server";

  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    tenant: formData.get("tenant"),
  });
  if (!parsed.success) {
    redirect("/signup?error=missing");
  }
  const { name, email, tenant: tenantName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  let user = existing;
  if (!user) {
    user = await prisma.user.create({
      data: { name, email },
    });
  }

  let slug = slugify(tenantName);
  let suffix = 0;
  while (await prisma.tenant.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${slugify(tenantName)}-${suffix}`;
  }

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 90);

  const tenant = await prisma.tenant.create({
    data: {
      name: tenantName,
      slug,
      ownerUserId: user.id,
      members: {
        create: {
          userId: user.id,
          targetGroup: "owner",
          membershipStatus: "active",
        },
      },
      billing: {
        create: {
          plan: "TRIAL",
          pricingModel: "usage_percent",
          billingStatus: "trial",
          trialEndsAt,
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      entityType: "tenant",
      entityId: tenant.id,
      action: "tenant.created",
      actor: user.email,
      actorType: "user",
    },
  });

  await signIn("resend", {
    email,
    redirectTo: "/app/onboarding",
  });
}

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-lg px-6 py-20">
          <Card>
            <CardHeader>
              <CardTitle>Criar conta Nimbus Frugal</CardTitle>
              <CardDescription>
                Comece o trial de 90 dias. Seu primeiro login virá por e-mail.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorNotice searchParams={searchParams} />
              <form action={createAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Seu nome</Label>
                  <Input id="name" name="name" placeholder="Ana Souza" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail corporativo</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ana@empresa.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenant">Nome do tenant</Label>
                  <Input
                    id="tenant"
                    name="tenant"
                    placeholder="Acme FinOps"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Criar conta e enviar magic link
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Já tem conta?{" "}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    Fazer login
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

async function ErrorNotice({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  if (!sp.error) return null;
  return (
    <div className="mb-4 rounded-md border border-negative/20 bg-negative/10 p-3 text-sm text-negative">
      Preencha todos os campos para continuar.
    </div>
  );
}
