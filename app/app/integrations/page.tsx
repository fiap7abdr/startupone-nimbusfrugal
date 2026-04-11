import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { formatDate } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function saveRoleArn(formData: FormData) {
  "use server";
  const { tenant } = await requireTenant();
  const integrationId = String(formData.get("integrationId") ?? "");
  const roleArn = String(formData.get("roleArn") ?? "").trim();
  if (!integrationId || !roleArn) return;
  if (!/^arn:aws:iam::\d{12}:role\/.+$/.test(roleArn)) return;
  const integration = await prisma.integration.findFirst({
    where: { id: integrationId, tenantId: tenant.id },
  });
  if (!integration) return;
  await prisma.integration.update({
    where: { id: integration.id },
    data: { roleArn },
  });
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      entityType: "integration",
      entityId: integrationId,
      action: "integration.role_arn_set",
      actor: tenant.ownerUserId,
      actorType: "user",
    },
  });
  revalidatePath("/app/integrations");
}

async function runHealthCheck(formData: FormData) {
  "use server";
  const { tenant } = await requireTenant();
  const integrationId = String(formData.get("integrationId") ?? "");
  const integration = await prisma.integration.findFirst({
    where: { id: integrationId, tenantId: tenant.id },
  });
  if (!integration) return;

  const ok = !!integration.roleArn;
  await prisma.integrationTestResult.create({
    data: {
      integrationId,
      status: ok ? "ok" : "error",
      serviceChecked: "sts:AssumeRole (simulated)",
      errorDetails: ok ? null : "Role ARN não configurado",
    },
  });
  await prisma.integration.update({
    where: { id: integrationId },
    data: {
      status: ok ? "active" : "error",
      healthStatus: ok ? "healthy" : "error",
      lastSuccessfulCollection: ok ? new Date() : integration.lastSuccessfulCollection,
      lastError: ok ? null : "Role ARN ausente",
    },
  });

  if (ok) {
    // Simulate org discovery: create a placeholder org/ou/account if none exists yet
    const existingOrg = await prisma.awsOrganization.findFirst({
      where: { tenantId: tenant.id },
    });
    if (existingOrg && existingOrg.organizationStatus === "pending") {
      await prisma.awsOrganization.update({
        where: { id: existingOrg.id },
        data: { organizationStatus: "active", discoveredAt: new Date() },
      });
      await prisma.organizationalUnit.create({
        data: {
          tenantId: tenant.id,
          organizationId: existingOrg.id,
          ouId: "ou-root-sim",
          name: "Root",
        },
      });
      await prisma.awsAccount.createMany({
        data: [
          {
            tenantId: tenant.id,
            organizationId: existingOrg.id,
            awsAccountId: existingOrg.managementAccountId,
            accountName: "Management",
            accountType: "management",
            status: "active",
          },
          {
            tenantId: tenant.id,
            organizationId: existingOrg.id,
            awsAccountId: "111111111111",
            accountName: "Production",
            accountType: "member",
            status: "active",
          },
          {
            tenantId: tenant.id,
            organizationId: existingOrg.id,
            awsAccountId: "222222222222",
            accountName: "Staging",
            accountType: "member",
            status: "active",
          },
        ],
      });
    }
    await prisma.dataFreshnessStatus.upsert({
      where: {
        tenantId_connectorType: {
          tenantId: tenant.id,
          connectorType: integration.connectorType,
        },
      },
      create: {
        tenantId: tenant.id,
        connectorType: integration.connectorType,
        lastCollectedAt: new Date(),
        lastConsolidatedAt: new Date(),
        freshnessStatus: "fresh",
      },
      update: {
        lastCollectedAt: new Date(),
        lastConsolidatedAt: new Date(),
        freshnessStatus: "fresh",
      },
    });
  }

  revalidatePath("/app/integrations");
  redirect("/app/integrations");
}

export default async function IntegrationsPage() {
  const { tenant } = await requireTenant();
  const integrations = await prisma.integration.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "asc" },
    include: { testResults: { orderBy: { executedAt: "desc" }, take: 1 } },
  });

  return (
    <div>
      <PageHeader
        title="Integrações"
        description="Gerencie conectores AWS, role ARN e health checks. Modo read-only por padrão."
      />

      {integrations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Nenhuma integração criada. Comece pelo{" "}
            <a href="/app/onboarding" className="font-medium text-primary hover:underline">
              onboarding
            </a>
            .
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {integrations.map((i) => (
            <Card key={i.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{i.connectorType}</CardTitle>
                    <CardDescription>
                      Modo {i.integrationMode} · última coleta {formatDate(i.lastSuccessfulCollection)}
                    </CardDescription>
                  </div>
                  <StatusBadge status={i.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Info label="External ID" value={i.externalId} mono />
                  <Info label="Trust principal (Nimbus)" value={i.trustPrincipalAccountId} mono />
                </div>
                <form action={saveRoleArn} className="flex flex-col gap-3 md:flex-row md:items-end">
                  <input type="hidden" name="integrationId" value={i.id} />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`role-${i.id}`}>Role ARN</Label>
                    <Input
                      id={`role-${i.id}`}
                      name="roleArn"
                      defaultValue={i.roleArn ?? ""}
                      placeholder="arn:aws:iam::123456789012:role/NimbusFrugalReadRole"
                    />
                  </div>
                  <Button type="submit" variant="outline">
                    Salvar Role ARN
                  </Button>
                </form>
                <form action={runHealthCheck}>
                  <input type="hidden" name="integrationId" value={i.id} />
                  <Button type="submit">Executar health check</Button>
                </form>
                {i.lastError && (
                  <p className="text-xs text-negative">Último erro: {i.lastError}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={mono ? "font-mono text-sm" : "text-sm"}>{value}</p>
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
