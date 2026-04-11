import { PageHeader } from "@/components/app/page-header";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { IntegrationsClient } from "./integrations-client";

export default async function IntegrationsPage() {
  const { tenant } = await requireTenant();

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
        title="Integracoes AWS"
        description="Gerencie suas AWS Organizations e conectores. Cada conector usa uma IAM Role separada com permissoes least-privilege."
      />
      <IntegrationsClient orgs={orgs} />
    </div>
  );
}
