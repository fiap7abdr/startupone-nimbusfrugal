import { PageHeader } from "@/components/app/page-header";
import { DemoBadge } from "@/components/app/demo-badge";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { IntegrationsClient } from "./integrations-client";
import { getTranslations } from "next-intl/server";
import { generateOrganizationSummaries } from "@/lib/demo/generators";

export default async function IntegrationsPage() {
  const { tenant } = await requireTenant();
  const t = await getTranslations("integrations");

  let orgs;

  if (tenant.demoMode) {
    orgs = generateOrganizationSummaries();
  } else {
    const organizations = await prisma.awsOrganization.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "asc" },
      include: {
        integrations: {
          orderBy: { createdAt: "asc" },
          select: { status: true },
        },
      },
    });

    orgs = organizations.map((org) => ({
      id: org.id,
      organizationName: org.organizationName,
      organizationId: org.organizationId,
      managementAccountId: org.managementAccountId,
      organizationStatus: org.organizationStatus,
      integrations: org.integrations.map((i) => ({ status: i.status })),
    }));
  }

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        action={tenant.demoMode ? <DemoBadge /> : undefined}
      />
      <IntegrationsClient orgs={orgs} />
    </div>
  );
}
