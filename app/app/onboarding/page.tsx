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
import { randomExternalId } from "@/lib/utils";
import { buildNimbusCloudFormationTemplate } from "@/lib/aws-cloudformation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";

async function registerOrganization(formData: FormData) {
  "use server";
  const { tenant } = await requireTenant();
  const organizationName = String(formData.get("organizationName") ?? "").trim();
  const organizationId = String(formData.get("organizationId") ?? "").trim();
  const managementAccountId = String(
    formData.get("managementAccountId") ?? "",
  ).trim();
  if (!organizationName || !organizationId || !managementAccountId) return;

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

  await prisma.integration.create({
    data: {
      tenantId: tenant.id,
      connectorType: "aws_organizations",
      integrationMode: "read",
      externalId: randomExternalId(),
      trustPrincipalAccountId: platformAccountId,
      status: "pending",
      healthStatus: "unknown",
    },
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

  const [org, integration, config] = await Promise.all([
    prisma.awsOrganization.findFirst({ where: { tenantId: tenant.id } }),
    prisma.integration.findFirst({
      where: { tenantId: tenant.id, connectorType: "aws_organizations" },
    }),
    prisma.platformConfiguration.findFirst(),
  ]);

  const platformAccountId =
    config?.platformAwsAccountId ??
    process.env.NIMBUS_PLATFORM_AWS_ACCOUNT_ID ??
    "123456789012";

  const externalId = integration?.externalId ?? "—";
  const cfTemplate = integration
    ? buildNimbusCloudFormationTemplate({
        platformAccountId,
        externalId,
      })
    : null;

  const steps = [
    { key: "org", label: "Registrar organização AWS", done: !!org },
    { key: "cf", label: "Aplicar CloudFormation e criar IAM Role", done: !!integration?.roleArn },
    { key: "health", label: "Health check + descoberta de OUs/contas", done: integration?.status === "active" },
  ];

  return (
    <div>
      <PageHeader
        title="Onboarding AWS Organization"
        description="Conecte a conta management da sua AWS Organization. A Nimbus Frugal assume uma role cross-account com External ID — nenhuma credencial é armazenada."
      />

      <div className="mb-8 flex flex-col gap-3">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-3">
            {s.done ? (
              <CheckCircle2 className="h-5 w-5 text-positive" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
            <span
              className={
                s.done ? "text-sm text-muted-foreground line-through" : "text-sm font-medium"
              }
            >
              {i + 1}. {s.label}
            </span>
          </div>
        ))}
      </div>

      {!org && (
        <Card>
          <CardHeader>
            <CardTitle>Passo 1 · Registrar sua AWS Organization</CardTitle>
            <CardDescription>
              Informe a organização e a conta management para que a Nimbus
              descubra OUs e contas via AWS Organizations.
            </CardDescription>
          </CardHeader>
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
        </Card>
      )}

      {org && integration && (
        <Card>
          <CardHeader>
            <CardTitle>Passo 2 · Aplicar CloudFormation</CardTitle>
            <CardDescription>
              Execute o template abaixo na conta management. Ele cria uma IAM
              Role cuja trust policy aponta para a conta AWS da Nimbus Frugal
              com o External ID único do tenant.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <InfoRow label="Nimbus AWS Account ID (trust principal)" value={platformAccountId} mono />
              <InfoRow label="External ID" value={externalId} mono />
              <InfoRow label="Organização" value={org.organizationName} />
              <InfoRow label="Status" value={<Badge variant="muted">{integration.status}</Badge>} />
            </div>
            {cfTemplate && (
              <pre className="overflow-x-auto rounded-md border border-border bg-[#0f172a] p-4 text-xs text-white">
                {cfTemplate}
              </pre>
            )}
            <p className="text-sm text-muted-foreground">
              Depois de aplicar o template, volte para{" "}
              <a href="/app/integrations" className="font-medium text-primary hover:underline">
                Integrações
              </a>{" "}
              e informe o Role ARN gerado para rodar o health check.
            </p>
          </CardContent>
        </Card>
      )}
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
      <p className={mono ? "font-mono text-sm" : "text-sm"}>{value}</p>
    </div>
  );
}
