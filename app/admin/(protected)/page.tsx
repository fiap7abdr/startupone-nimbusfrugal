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
import { getTranslations } from "next-intl/server";

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

  const t = await getTranslations("admin");
  const tc = await getTranslations("common");

  return (
    <div>
      <PageHeader
        title={t("overview_title")}
        description={t("overview_desc")}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label={t("overview_tenants")} value={tenantsCount} />
        <Metric label={t("col_integrations")} value={integrationsCount} />
        <Metric label={t("overview_batches")} value={batchesCount} />
        <Metric label={t("overview_admins")} value={adminsCount} />
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("recent_tenants")}</CardTitle>
          <CardDescription>{t("recent_tenants_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left">{tc("name")}</th>
                <th className="px-4 py-2 text-left">Slug</th>
                <th className="px-4 py-2 text-left">{tc("plan")}</th>
                <th className="px-4 py-2 text-left">{tc("status")}</th>
                <th className="px-4 py-2 text-left">{tc("created")}</th>
              </tr>
            </thead>
            <tbody>
              {recentTenants.map((ten) => (
                <tr key={ten.id} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{ten.name}</td>
                  <td className="px-4 py-2 font-mono text-xs">{ten.slug}</td>
                  <td className="px-4 py-2">
                    <Badge>{ten.billing?.plan ?? ten.plan}</Badge>
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant="muted">{ten.status}</Badge>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {formatDate(ten.createdAt)}
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
