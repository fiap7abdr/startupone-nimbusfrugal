"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface TenantAuditFiltersProps {
  modules: string[];
  currentFilters: {
    module: string;
    action: string;
    actor: string;
    from: string;
    to: string;
  };
}

export function TenantAuditFilters({ modules, currentFilters }: TenantAuditFiltersProps) {
  const t = useTranslations("audit");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const sp = new URLSearchParams();
    for (const [key, value] of fd.entries()) {
      if (value) sp.set(key, String(value));
    }
    const qs = sp.toString();
    router.push(`/app/audit${qs ? `?${qs}` : ""}`);
  }

  function handleClear() {
    router.push("/app/audit");
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="module">{t("filter_module")}</Label>
            <select
              id="module"
              name="module"
              defaultValue={currentFilters.module}
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm"
            >
              <option value="">{t("filter_all")}</option>
              {modules.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="actor">{t("filter_actor")}</Label>
            <Input
              id="actor"
              name="actor"
              placeholder={t("filter_actor_placeholder")}
              defaultValue={currentFilters.actor}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="action">{t("filter_action")}</Label>
            <Input
              id="action"
              name="action"
              placeholder={t("filter_action_placeholder")}
              defaultValue={currentFilters.action}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="from">{t("filter_from")}</Label>
            <Input
              id="from"
              name="from"
              type="date"
              defaultValue={currentFilters.from}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="to">{t("filter_to")}</Label>
            <Input
              id="to"
              name="to"
              type="date"
              defaultValue={currentFilters.to}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button type="submit" size="sm">{t("filter_apply")}</Button>
            <Button type="button" variant="outline" size="sm" onClick={handleClear}>
              {t("filter_clear")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
