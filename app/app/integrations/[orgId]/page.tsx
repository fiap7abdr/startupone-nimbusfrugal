import { PageHeader } from "@/components/app/page-header";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { notFound } from "next/navigation";
import { OrgDetailClient } from "./org-detail-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function OrgDetailPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const { tenant } = await requireTenant();

  const org = await prisma.awsOrganization.findFirst({
    where: { id: orgId, tenantId: tenant.id },
    include: {
      integrations: {
        orderBy: { createdAt: "asc" },
        include: { testResults: { orderBy: { executedAt: "desc" }, take: 1 } },
      },
    },
  });

  if (!org) notFound();

  const config = await prisma.platformConfiguration.findFirst();
  const platformAccountId =
    config?.platformAwsAccountId ??
    process.env.NIMBUS_PLATFORM_AWS_ACCOUNT_ID ??
    "123456789012";

  const orgData = {
    id: org.id,
    organizationName: org.organizationName,
    organizationId: org.organizationId,
    managementAccountId: org.managementAccountId,
    organizationStatus: org.organizationStatus,
    integrations: org.integrations.map((i) => ({
      id: i.id,
      connectorType: i.connectorType,
      status: i.status,
      healthStatus: i.healthStatus,
      roleArn: i.roleArn,
      externalId: i.externalId,
      trustPrincipalAccountId: i.trustPrincipalAccountId,
      lastError: i.lastError,
      lastSuccessfulCollection: i.lastSuccessfulCollection?.toISOString() ?? null,
    })),
  };

  return (
    <div>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/app/integrations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para organizacoes
          </Link>
        </Button>
      </div>

      <PageHeader
        title={org.organizationName}
        description={`Configuracao da organizacao ${org.organizationId} e seus conectores AWS.`}
      />

      <OrgDetailClient org={orgData} platformAccountId={platformAccountId} />
    </div>
  );
}
