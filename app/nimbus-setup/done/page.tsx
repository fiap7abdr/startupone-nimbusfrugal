import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function SetupDonePage() {
  const t = await getTranslations("admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1b3f] p-6">
      <Card className="w-full max-w-xl border-border">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-positive/20 text-positive">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4">{t("setup_done_title")}</CardTitle>
          <CardDescription>{t("setup_done_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-sm text-muted-foreground">
            {t("setup_done_next")}
          </p>
          <Button asChild className="w-full" size="lg">
            <Link href="/admin/login">{t("setup_done_cta")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
