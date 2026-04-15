import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { getTranslations } from "next-intl/server";
import { DemoBadge } from "@/components/app/demo-badge";
import { generateRecommendations } from "@/lib/demo/generators";
import { RecommendationsTable } from "./recommendations-table";

export default async function RecommendationsPage() {
  const { tenant } = await requireTenant();
  const t = await getTranslations("recommendations");
  const rawRecs = tenant.demoMode
    ? generateRecommendations()
    : await prisma.recommendation.findMany({
        where: { tenantId: tenant.id },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: 100,
      });

  const recs = rawRecs.map((r) => ({
    id: r.id,
    recommendationType: r.recommendationType,
    source: r.source,
    awsAccountId: r.awsAccountId ?? null,
    priority: r.priority,
    estimatedSavings:
      r.estimatedSavings != null ? Number(r.estimatedSavings) : null,
    status: r.status,
  }));

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        action={tenant.demoMode ? <DemoBadge /> : undefined}
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
            <RecommendationsTable recs={recs} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
