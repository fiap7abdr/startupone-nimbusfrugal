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
import { formatDate } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const [tenantsCount, integrationsCount, batchesCount, adminsCount, recentTenants] =
    await Promise.all([
      prisma.tenant.count(),
      prisma.integration.count(),
      prisma.collectionBatch.count(),
      prisma.adminUser.count(),
      prisma.tenant.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { billing: true },
      }),
    ]);

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Painel global da plataforma Nimbus Frugal. Gerencie tenants, integrações, batches e admins."
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Tenants" value={tenantsCount} />
        <Metric label="Integrações" value={integrationsCount} />
        <Metric label="Batches" value={batchesCount} />
        <Metric label="Admins Gerais" value={adminsCount} />
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tenants recentes</CardTitle>
          <CardDescription>
            Últimos 5 tenants criados na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">Slug</th>
                <th className="px-4 py-2 text-left">Plano</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Criado</th>
              </tr>
            </thead>
            <tbody>
              {recentTenants.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{t.name}</td>
                  <td className="px-4 py-2 font-mono text-xs">{t.slug}</td>
                  <td className="px-4 py-2">
                    <Badge>{t.billing?.plan ?? t.plan}</Badge>
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant="muted">{t.status}</Badge>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {formatDate(t.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
