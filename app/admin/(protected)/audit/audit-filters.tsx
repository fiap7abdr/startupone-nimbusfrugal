"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface AuditFiltersProps {
  modules: string[];
  tenants: { id: string; name: string }[];
  currentFilters: {
    module: string;
    action: string;
    actor: string;
    actorType: string;
    tenantId: string;
    from: string;
    to: string;
  };
}

export function AuditFilters({ modules, tenants, currentFilters }: AuditFiltersProps) {
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
    router.push(`/admin/audit${qs ? `?${qs}` : ""}`);
  }

  function handleClear() {
    router.push("/admin/audit");
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
            <Label htmlFor="actorType">{t("filter_actor_type")}</Label>
            <select
              id="actorType"
              name="actorType"
              defaultValue={currentFilters.actorType}
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm"
            >
              <option value="">{t("filter_all")}</option>
              <option value="user">user</option>
              <option value="admin">admin</option>
              <option value="system">system</option>
            </select>
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
            <Label htmlFor="tenantId">{t("filter_tenant")}</Label>
            <select
              id="tenantId"
              name="tenantId"
              defaultValue={currentFilters.tenantId}
              className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm"
            >
              <option value="">{t("filter_all")}</option>
              {tenants.map((ten) => (
                <option key={ten.id} value={ten.id}>{ten.name}</option>
              ))}
            </select>
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
