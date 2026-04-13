import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
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
import { createAuditLog } from "@/lib/audit";

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

  await createAuditLog({
    tenantId: tenant.id,
    entityType: "tenant",
    entityId: tenant.id,
    action: "tenant.created",
    actor: user.id,
    actorEmail: user.email,
    module: "tenants",
    summary: `Criou tenant ${tenantName}`,
    after: { name: tenantName, slug, plan: "TRIAL" },
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
  const t = await getTranslations("auth");

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
          <CardTitle className="mt-4">{t("new_tenant_title")}</CardTitle>
          <CardDescription>
            {t("new_tenant_desc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sp.error && (
            <div className="mb-4 rounded-md border border-negative/20 bg-negative/10 p-3 text-sm text-negative">
              {t("fill_tenant")}
            </div>
          )}
          <form action={createTenant} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("tenant_name")}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t("tenant_placeholder")}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              {t("create_tenant")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
