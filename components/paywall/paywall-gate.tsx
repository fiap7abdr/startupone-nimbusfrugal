"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

interface PaywallGateProps {
  hasAccess: boolean;
  children: React.ReactNode;
  featureName?: string;
}

export function PaywallGate({
  hasAccess,
  children,
  featureName = "esta funcionalidade",
}: PaywallGateProps) {
  const t = useTranslations("paywall");

  if (hasAccess) return <>{children}</>;

  return (
    <Card className="mx-auto max-w-md border-border">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <ShieldCheck className="h-6 w-6 text-accent-foreground" />
        </div>
        <CardTitle className="mt-4">{t("title")}</CardTitle>
        <CardDescription>
          {t("expired_message")}{" "}
          {featureName}.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button asChild className="w-full">
          <Link href="/app/settings">{t("upgrade_cta")}</Link>
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          {t("pro_price")}
        </p>
      </CardContent>
    </Card>
  );
}
