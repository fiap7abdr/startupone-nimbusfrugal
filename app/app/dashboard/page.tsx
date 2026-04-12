import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireTenant } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { formatDate, connectorLabel } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const { tenant } = await requireTenant();
  const t = await getTranslations("dashboard");
  const tc = await getTranslations("common");

  const [
    integrations,
    activeIntegrations,
    accounts,
    lastBatch,
    recCount,
    freshness,
  ] = await Promise.all([
    prisma.integration.count({ where: { tenantId: tenant.id } }),
    prisma.integration.count({
      where: { tenantId: tenant.id, status: "active" },
    }),
    prisma.awsAccount.count({ where: { tenantId: tenant.id } }),
    prisma.collectionBatch.findFirst({
      where: { tenantId: tenant.id },
      orderBy: { scheduledAt: "desc" },
    }),
    prisma.recommendation.count({
      where: { tenantId: tenant.id, status: "open" },
    }),
    prisma.dataFreshnessStatus.findMany({
      where: { tenantId: tenant.id },
      orderBy: { connectorType: "asc" },
    }),
  ]);

  const needsOnboarding = integrations === 0;

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
      />

      {needsOnboarding && (
        <Card className="mb-8 border-primary/30 bg-accent/60">
          <CardContent className="flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-base font-semibold text-accent-foreground">
                {t("onboarding_title")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("onboarding_desc")}
              </p>
            </div>
            <Button asChild>
              <Link href="/app/integrations">{t("onboarding_cta")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label={t("metric_integrations")} value={integrations.toString()} sub={`${activeIntegrations} ativas`} />
        <Metric label={t("metric_accounts")} value={accounts.toString()} sub={t("metric_accounts_desc")} />
        <Metric label={t("metric_recommendations")} value={recCount.toString()} sub={t("metric_recommendations_desc")} />
        <Metric
          label={t("metric_last_batch")}
          value={lastBatch ? lastBatch.status : "—"}
          sub={lastBatch ? formatDate(lastBatch.scheduledAt) : t("metric_no_batch")}
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("freshness_title")}</CardTitle>
            <CardDescription>
              {t("freshness_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {freshness.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("freshness_empty")}
              </p>
            ) : (
              <ul className="space-y-3">
                {freshness.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-medium">{connectorLabel(f.connectorType)}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        {formatDate(f.lastCollectedAt)}
                      </span>
                      <FreshnessBadge status={f.freshnessStatus} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("billing_title")}</CardTitle>
            <CardDescription>{t("billing_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>{t("billing_current")}</span>
              <Badge>{tenant.plan}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>{tc("model")}</span>
              <span className="text-muted-foreground">
                {t("billing_model")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status</span>
              <span className="text-muted-foreground">{tenant.status}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function FreshnessBadge({ status }: { status: string }) {
  const map: Record<string, "positive" | "muted" | "negative" | "secondary"> = {
    fresh: "positive",
    stale: "muted",
    delayed: "negative",
    unknown: "secondary",
  };
  return <Badge variant={map[status] ?? "secondary"}>{status}</Badge>;
}
