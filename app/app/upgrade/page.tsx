import { requireTenant } from "@/lib/tenant";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { UpgradeForm } from "./upgrade-form";
import { daysLeftInTrial } from "@/lib/subscription";
import { getTranslations } from "next-intl/server";

export default async function UpgradePage() {
  const { tenant } = await requireTenant();

  if (tenant.billing?.plan === "PRO") {
    redirect("/app/settings");
  }

  const t = await getTranslations("upgrade");
  const daysLeft = daysLeftInTrial(tenant.billing);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={t("title")}
        description={t("description")}
      />
      <UpgradeForm daysLeft={daysLeft} />
    </div>
  );
}
