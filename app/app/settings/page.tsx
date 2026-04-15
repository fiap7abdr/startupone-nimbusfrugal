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
import { getTranslations } from "next-intl/server";
import { DemoToggle } from "./demo-toggle";
import { WelcomeDialog } from "./welcome-dialog";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { tenant } = await requireTenant();
  const sp = await searchParams;
  const showWelcome = sp.welcome === "1" && !tenant.demoMode;
  const [t, tc] = await Promise.all([
    getTranslations("settings"),
    getTranslations("common"),
  ]);
  const billing = await prisma.billingSubscription.findUnique({
    where: { tenantId: tenant.id },
  });

  return (
    <div>
      <WelcomeDialog
        initialOpen={showWelcome}
        labels={{
          title: t("welcome_title"),
          description: t("welcome_desc"),
          enable: t("welcome_enable"),
          skip: t("welcome_skip"),
          enabling: t("demo_updating"),
        }}
      />
      <PageHeader
        title={t("title")}
        description={t("description")}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("tenant_title")}</CardTitle>
            <CardDescription>{t("tenant_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label={tc("name")} value={tenant.name} />
            <Row label={t("slug")} value={<span className="font-mono">{tenant.slug}</span>} />
            <Row label={tc("status")} value={tenant.status} />
            <Row label={t("created_at")} value={formatDate(tenant.createdAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("billing_title")}</CardTitle>
            <CardDescription>{t("billing_desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row
              label={tc("plan")}
              value={<Badge>{billing?.plan ?? tenant.plan}</Badge>}
            />
            <Row
              label={tc("model")}
              value={
                billing?.plan === "PRO"
                  ? t("billing_model")
                  : t("trial_free")
              }
            />
            <Row label={tc("status")} value={billing?.billingStatus ?? "—"} />
            <Row label={t("trial_expires")} value={formatDate(billing?.trialEndsAt)} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("demo_title")}</CardTitle>
            <CardDescription>{t("demo_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <DemoToggle
              enabled={tenant.demoMode}
              labels={{
                on: t("demo_on"),
                off: t("demo_off"),
                enable: t("demo_enable"),
                disable: t("demo_disable"),
                updating: t("demo_updating"),
              }}
            />
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
