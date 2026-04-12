"use server";

import { prisma } from "@/lib/prisma";
import { requireTenant, requireUser } from "@/lib/tenant";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createTenantSchema } from "@/lib/validations";
import { generateTenantSlug } from "@/lib/utils";
import { createAuditLog } from "@/lib/audit";

export async function upgradeToPro() {
  const { tenant, user } = await requireTenant();

  const billing = await prisma.billingSubscription.findUnique({
    where: { tenantId: tenant.id },
  });

  if (!billing || billing.plan === "PRO") {
    redirect("/app/settings");
  }

  await prisma.$transaction([
    prisma.billingSubscription.update({
      where: { tenantId: tenant.id },
      data: {
        plan: "PRO",
        pricingModel: "usage_percent",
        billingStatus: "active",
      },
    }),
    prisma.tenant.update({
      where: { id: tenant.id },
      data: { plan: "PRO" },
    }),
  ]);

  await createAuditLog({
    tenantId: tenant.id,
    entityType: "billing_subscription",
    entityId: tenant.id,
    action: "billing.upgraded",
    actor: user.email,
    module: "billing",
    summary: `Upgrade para PRO`,
    before: { plan: billing.plan },
    after: { plan: "PRO" },
  });

  redirect("/app/settings");
}

export async function createAdditionalTenant(formData: FormData) {
  const { tenant } = await requireTenant();

  if (tenant.billing?.plan !== "PRO") {
    redirect("/app/upgrade");
  }

  const user = await requireUser();

  const parsed = createTenantSchema.safeParse({
    name: formData.get("name"),
  });
  if (!parsed.success) {
    redirect("/app/new-tenant?error=missing");
  }

  const { name: tenantName } = parsed.data;
  const slug = generateTenantSlug(tenantName);

  const newTenant = await prisma.tenant.create({
    data: {
      name: tenantName,
      slug,
      plan: "PRO",
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
          plan: "PRO",
          pricingModel: "usage_percent",
          billingStatus: "active",
        },
      },
    },
  });

  await createAuditLog({
    tenantId: newTenant.id,
    entityType: "tenant",
    entityId: newTenant.id,
    action: "tenant.created",
    actor: user.email,
    module: "tenants",
    summary: `Criou tenant adicional ${tenantName}`,
    after: { name: tenantName, slug, plan: "PRO" },
  });

  const cookieStore = await cookies();
  cookieStore.set("active-tenant-id", newTenant.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/app/integrations");
}

export async function deleteTenant(tenantId: string) {
  const { user, memberships } = await requireTenant();

  if (memberships.length <= 1) {
    redirect("/app/tenants");
  }

  const target = memberships.find((m) => m.tenantId === tenantId);
  if (!target || target.tenant.ownerUserId !== user.id) {
    redirect("/app/tenants");
  }

  await createAuditLog({
    tenantId,
    entityType: "tenant",
    entityId: tenantId,
    action: "tenant.deleted",
    actor: user.email,
    module: "tenants",
    summary: `Excluiu tenant ${target.tenant.name}`,
    before: { name: target.tenant.name, slug: target.tenant.slug },
  });

  await prisma.tenant.delete({ where: { id: tenantId } });

  const remaining = memberships.filter((m) => m.tenantId !== tenantId);
  if (remaining.length > 0) {
    const cookieStore = await cookies();
    cookieStore.set("active-tenant-id", remaining[0].tenantId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  redirect("/app/tenants");
}
