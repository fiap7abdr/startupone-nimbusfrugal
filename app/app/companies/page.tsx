import { requireTenant } from "@/lib/tenant";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { CompaniesClient } from "./companies-client";
import { getTranslations } from "next-intl/server";

export default async function CompaniesPage() {
  const { user, tenant, memberships } = await requireTenant();

  if (tenant.billing?.plan !== "PRO") {
    redirect("/app/upgrade");
  }

  const t = await getTranslations("companies");

  const companies = await Promise.all(
    memberships.map(async (m) => {
      const memberCount = await prisma.tenantMember.count({
        where: { tenantId: m.tenantId, membershipStatus: "active" },
      });
      return {
        id: m.tenant.id,
        name: m.tenant.name,
        slug: m.tenant.slug,
        plan: m.tenant.billing?.plan ?? m.tenant.plan,
        role: m.targetGroup,
        memberCount,
        isOwner: m.tenant.ownerUserId === user.id,
        createdAt: m.tenant.createdAt.toISOString(),
      };
    }),
  );

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
      />
      <CompaniesClient
        companies={companies}
        activeTenantId={tenant.id}
      />
    </div>
  );
}
