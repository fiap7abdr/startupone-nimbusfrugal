"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { upgradeToPro } from "@/lib/billing-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Crown, Building2, BarChart3, Shield } from "lucide-react";

export function UpgradeForm({ daysLeft }: { daysLeft: number }) {
  const t = useTranslations("upgrade");
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-6">
      {/* Current plan info */}
      {daysLeft > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {t("trial_remaining")} <strong>{daysLeft} {t("trial_days")}</strong>{" "}
          {t("trial_suffix")}
        </div>
      )}

      {/* Pro plan card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316]">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>{t("pro_plan")}</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-foreground">10%</span>{" "}
                {t("pro_price")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Benefits */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              {t("benefits_title")}
            </p>
            <ul className="space-y-2.5">
              <Benefit icon={Building2} text={t("benefit1")} />
              <Benefit icon={BarChart3} text={t("benefit2")} />
              <Benefit icon={Shield} text={t("benefit3")} />
              <Benefit icon={Check} text={t("benefit4")} />
              <Benefit icon={Check} text={t("benefit5")} />
            </ul>
          </div>

          {/* Billing model explanation */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-semibold">{t("billing_title")}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("billing_desc1")}{" "}
              <strong>{t("billing_estimated")}</strong>{" "}
              {t("billing_desc2")}{" "}
              <strong>{t("billing_percent")}</strong>.{" "}
              {t("billing_desc3")}
            </p>
          </div>

          {/* Consent */}
          <label className="flex items-start gap-3 cursor-pointer rounded-lg border p-4 transition hover:bg-muted/30">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary accent-primary"
            />
            <span className="text-sm leading-relaxed">
              {t("consent")}
            </span>
          </label>

          {/* Action */}
          <form action={upgradeToPro}>
            <SubmitButton
              disabled={!agreed}
              className="w-full bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white hover:opacity-90 disabled:opacity-50"
              size="lg"
              pendingText={t("processing")}
            >
              <Crown className="mr-2 h-4 w-4" />
              {t("confirm_upgrade")}
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Benefit({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
      {text}
    </li>
  );
}
