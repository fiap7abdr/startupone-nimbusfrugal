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
import { getTranslations } from "next-intl/server";

export default async function RecommendationsPage() {
  const { tenant } = await requireTenant();
  const [t, tc] = await Promise.all([
    getTranslations("recommendations"),
    getTranslations("common"),
  ]);
  const recs = await prisma.recommendation.findMany({
    where: { tenantId: tenant.id },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
      />
      {recs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("empty_title")}</CardTitle>
            <CardDescription>
              {t("empty_desc")}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">{t("col_type")}</th>
                  <th className="px-4 py-3 text-left">{t("col_source")}</th>
                  <th className="px-4 py-3 text-left">{t("col_account")}</th>
                  <th className="px-4 py-3 text-left">{t("col_priority")}</th>
                  <th className="px-4 py-3 text-right">{t("col_savings")}</th>
                  <th className="px-4 py-3 text-left">{tc("status")}</th>
                </tr>
              </thead>
              <tbody>
                {recs.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{r.recommendationType}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.source}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {r.awsAccountId ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={r.priority === "high" ? "negative" : "muted"}>
                        {r.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {r.estimatedSavings
                        ? `US$ ${Number(r.estimatedSavings).toFixed(2)}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
