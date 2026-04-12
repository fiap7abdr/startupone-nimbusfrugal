import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate, connectorLabel } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function AdminIntegrationsPage() {
  const integrations = await prisma.integration.findMany({
    orderBy: { createdAt: "desc" },
    include: { tenant: true },
  });

  const t = await getTranslations("admin");
  const tc = await getTranslations("common");

  return (
    <div>
      <PageHeader
        title={t("integrations_title")}
        description={t("integrations_desc")}
      />
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">{t("col_tenant")}</th>
                <th className="px-4 py-3 text-left">{t("col_connector")}</th>
                <th className="px-4 py-3 text-left">{t("col_mode")}</th>
                <th className="px-4 py-3 text-left">{tc("status")}</th>
                <th className="px-4 py-3 text-left">{t("col_health")}</th>
                <th className="px-4 py-3 text-left">{t("col_last_collection")}</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{i.tenant.name}</td>
                  <td className="px-4 py-3">{connectorLabel(i.connectorType)}</td>
                  <td className="px-4 py-3">{i.integrationMode}</td>
                  <td className="px-4 py-3">
                    <Badge variant={i.status === "active" ? "positive" : "muted"}>
                      {i.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{i.healthStatus}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(i.lastSuccessfulCollection)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {integrations.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              {t("integrations_empty")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
