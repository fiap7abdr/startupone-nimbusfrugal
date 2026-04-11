import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { randomExternalId, connectorLabel } from "@/lib/utils";
import {
  buildNimbusCloudFormationTemplate,
  connectorRoleName,
  CONNECTOR_TYPES,
} from "@/lib/aws-cloudformation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { registerOrgSchema } from "@/lib/validations";

async function registerOrganization(formData: FormData) {
  "use server";
  const { tenant } = await requireTenant();
  const parsed = registerOrgSchema.safeParse({
    organizationName: formData.get("organizationName"),
    organizationId: formData.get("organizationId"),
    managementAccountId: formData.get("managementAccountId"),
  });
  if (!parsed.success) return;
  const { organizationName, organizationId, managementAccountId } = parsed.data;

  const platformAccountId =
    process.env.NIMBUS_PLATFORM_AWS_ACCOUNT_ID ?? "123456789012";

  const org = await prisma.awsOrganization.create({
    data: {
      tenantId: tenant.id,
      organizationName,
      organizationId,
      managementAccountId,
      organizationStatus: "pending",
    },
  });

  await prisma.integration.createMany({
    data: CONNECTOR_TYPES.map((connectorType) => ({
      tenantId: tenant.id,
      connectorType,
      integrationMode: "read",
      externalId: randomExternalId(),
      trustPrincipalAccountId: platformAccountId,
      status: "pending",
      healthStatus: "unknown",
    })),
  });

  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      entityType: "aws_organization",
      entityId: org.id,
      action: "organization.registered",
      actor: tenant.ownerUserId,
      actorType: "user",
    },
  });

  revalidatePath("/app/onboarding");
  redirect("/app/onboarding");
}

export default async function OnboardingPage() {
  const { tenant } = await requireTenant();

  const [org, integrations, config] = await Promise.all([
    prisma.awsOrganization.findFirst({ where: { tenantId: tenant.id } }),
    prisma.integration.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.platformConfiguration.findFirst(),
  ]);

  const platformAccountId =
    config?.platformAwsAccountId ??
    process.env.NIMBUS_PLATFORM_AWS_ACCOUNT_ID ??
    "123456789012";

  const cfTemplate =
    integrations.length > 0
      ? buildNimbusCloudFormationTemplate({
          platformAccountId,
          connectors: integrations.map((i) => ({
            connectorType: i.connectorType,
            externalId: i.externalId,
          })),
        })
      : null;

  const doneCount = integrations.filter((i) => i.status === "active").length;
  const totalCount = integrations.length;

  return (
    <div>
      <PageHeader
        title="Onboarding AWS Organization"
        description="Conecte a conta management da sua AWS Organization. Cada conector usa uma IAM Role separada com permissoes least-privilege."
      />

      {/* Progress */}
      {integrations.length > 0 && (
        <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            Progresso: <strong className="text-foreground">{doneCount}/{totalCount}</strong> conectores ativos
          </span>
          {doneCount === totalCount && (
            <Badge variant="positive">Onboarding completo</Badge>
          )}
        </div>
      )}

      <div className="space-y-6">
        {/* Step: Register Organization */}
        <Card className={org ? "border-positive/30 bg-positive/5" : ""}>
          <CardHeader>
            <div className="flex items-center gap-3">
              {org ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-positive" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <div>
                <CardTitle>Registrar AWS Organization</CardTitle>
                <CardDescription>
                  Informe a organização e a conta management.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          {!org && (
            <CardContent>
              <form action={registerOrganization} className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Nome da organização</Label>
                  <Input id="organizationName" name="organizationName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organizationId">Organization ID</Label>
                  <Input id="organizationId" name="organizationId" placeholder="o-xxxxxxxxxx" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managementAccountId">Management Account ID</Label>
                  <Input
                    id="managementAccountId"
                    name="managementAccountId"
                    placeholder="123456789012"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <Button type="submit">Registrar organização</Button>
                </div>
              </form>
            </CardContent>
          )}
          {org && (
            <CardContent>
              <div className="grid gap-3 text-sm md:grid-cols-3">
                <InfoRow label="Organização" value={org.organizationName} />
                <InfoRow label="Organization ID" value={org.organizationId} mono />
                <InfoRow label="Management Account" value={org.managementAccountId} mono />
              </div>
            </CardContent>
          )}
        </Card>

        {/* CloudFormation template */}
        {cfTemplate && (
          <Card>
            <CardHeader>
              <CardTitle>Template CloudFormation</CardTitle>
              <CardDescription>
                Execute na conta management. Cria 7 IAM Roles (uma por conector),
                cada uma com policy least-privilege e External ID único.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow label="Nimbus AWS Account ID (trust principal)" value={platformAccountId} mono />
              <pre className="overflow-x-auto rounded-md border border-border bg-[#0f172a] p-4 text-xs text-white">
                {cfTemplate}
              </pre>
              <p className="text-sm text-muted-foreground">
                Após aplicar o template, configure o Role ARN de cada conector abaixo ou na página de{" "}
                <a href="/app/integrations" className="font-medium text-primary hover:underline">
                  Integrações
                </a>.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Individual connector cards */}
        {integrations.map((integration) => {
          const isActive = integration.status === "active";
          const isError = integration.status === "error";
          const roleName = connectorRoleName(integration.connectorType);

          return (
            <Card
              key={integration.id}
              className={
                isActive
                  ? "border-positive/30 bg-positive/5"
                  : isError
                    ? "border-negative/30 bg-negative/5"
                    : ""
              }
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  {isActive ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-positive" />
                  ) : isError ? (
                    <AlertCircle className="h-5 w-5 shrink-0 text-negative" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle>{connectorLabel(integration.connectorType)}</CardTitle>
                      <StatusBadge status={integration.status} />
                    </div>
                    <CardDescription>
                      Role esperada: <span className="font-mono">{roleName}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <InfoRow label="External ID" value={integration.externalId} mono />
                  <InfoRow label="Role ARN" value={integration.roleArn ?? "Não configurado"} mono />
                </div>
                {integration.lastError && (
                  <p className="text-xs text-negative">Erro: {integration.lastError}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={mono ? "font-mono text-sm break-all" : "text-sm"}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "active"
      ? "positive"
      : status === "error"
        ? "negative"
        : "muted";
  return <Badge variant={variant}>{status}</Badge>;
}
