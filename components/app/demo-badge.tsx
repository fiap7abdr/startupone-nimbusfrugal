import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function DemoBadge() {
  const t = await getTranslations("settings");
  return (
    <Badge variant="outline" className="gap-1.5">
      <FlaskConical className="h-3.5 w-3.5" />
      {t("demo_badge")}
    </Badge>
  );
}
