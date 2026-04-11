import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { generateTenantSlug } from "@/lib/utils";
import { createTenantSchema } from "@/lib/validations";

async function createTenant(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect("/login");

  const parsed = createTenantSchema.safeParse({
    name: formData.get("name"),
  });
  if (!parsed.success) {
    redirect("/new-tenant?error=missing");
  }
  const { name: tenantName } = parsed.data;

  const slug = generateTenantSlug(tenantName);

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

  const cookieStore = await cookies();
  cookieStore.set("active-tenant-id", tenant.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/app/integrations");
}

export default async function NewTenantPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const sp = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <Image
            src="/logo-128.png"
            alt="Nimbus Frugal"
            width={80}
            height={80}
            className="mb-2"
          />
          <CardTitle className="mt-4">Criar seu tenant</CardTitle>
          <CardDescription>
            Um tenant representa sua organizacao na Nimbus Frugal. Voce tera 90
            dias de trial gratuito.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sp.error && (
            <div className="mb-4 rounded-md border border-negative/20 bg-negative/10 p-3 text-sm text-negative">
              Preencha o nome do tenant para continuar.
            </div>
          )}
          <form action={createTenant} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do tenant</Label>
              <Input
                id="name"
                name="name"
                placeholder="Acme FinOps"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Criar tenant e comecar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
