import { PageHeader } from "@/components/app/page-header";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { IntegrationsClient } from "./integrations-client";
import { getTranslations } from "next-intl/server";

export default async function IntegrationsPage() {
  const { tenant } = await requireTenant();
  const t = await getTranslations("integrations");

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

  const orgs = organizations.map((org) => ({
    id: org.id,
    organizationName: org.organizationName,
    organizationId: org.organizationId,
    managementAccountId: org.managementAccountId,
    organizationStatus: org.organizationStatus,
    integrations: org.integrations.map((i) => ({ status: i.status })),
  }));

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
      />
      <IntegrationsClient orgs={orgs} />
    </div>
  );
}
