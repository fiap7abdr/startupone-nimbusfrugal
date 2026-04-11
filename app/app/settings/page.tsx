import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { formatDate } from "@/lib/utils";

export default async function SettingsPage() {
  const { tenant } = await requireTenant();
  const billing = await prisma.billingSubscription.findUnique({
    where: { tenantId: tenant.id },
  });

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configurações do tenant e billing."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tenant</CardTitle>
            <CardDescription>Identificação e status do tenant.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Nome" value={tenant.name} />
            <Row label="Slug" value={<span className="font-mono">{tenant.slug}</span>} />
            <Row label="Status" value={tenant.status} />
            <Row label="Criado em" value={formatDate(tenant.createdAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Plano e modelo de cobrança.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row
              label="Plano"
              value={<Badge>{billing?.plan ?? tenant.plan}</Badge>}
            />
            <Row label="Modelo" value="0,5% do gasto consolidado" />
            <Row label="Status" value={billing?.billingStatus ?? "—"} />
            <Row label="Trial expira em" value={formatDate(billing?.trialEndsAt)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
