import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { AuditFilters } from "./audit-filters";

const PAGE_SIZE = 25;

interface AuditSearchParams {
  page?: string;
  module?: string;
  action?: string;
  actor?: string;
  actorType?: string;
  tenantId?: string;
  from?: string;
  to?: string;
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<AuditSearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const t = await getTranslations("audit");
  const tc = await getTranslations("common");

  const where: Record<string, unknown> = {};

  if (sp.module) where.module = sp.module;
  if (sp.action) where.action = { contains: sp.action };
  if (sp.actor) where.actorEmail = { contains: sp.actor };
  if (sp.actorType) where.actorType = sp.actorType;
  if (sp.tenantId) where.tenantId = sp.tenantId;
  if (sp.from || sp.to) {
    where.timestamp = {
      ...(sp.from ? { gte: new Date(sp.from) } : {}),
      ...(sp.to ? { lte: new Date(`${sp.to}T23:59:59`) } : {}),
    };
  }

  const [logs, total, modules, tenants] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { tenant: { select: { name: true } } },
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      select: { module: true },
      distinct: ["module"],
      orderBy: { module: "asc" },
    }),
    prisma.tenant.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const moduleList = modules.map((m) => m.module);

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />

      <AuditFilters
        modules={moduleList}
        tenants={tenants}
        currentFilters={{
          module: sp.module ?? "",
          action: sp.action ?? "",
          actor: sp.actor ?? "",
          actorType: sp.actorType ?? "",
          tenantId: sp.tenantId ?? "",
          from: sp.from ?? "",
          to: sp.to ?? "",
        }}
      />

      <Card className="mt-4">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">{t("col_timestamp")}</th>
                <th className="px-4 py-3 text-left">{t("col_actor")}</th>
                <th className="px-4 py-3 text-left">{t("col_action")}</th>
                <th className="px-4 py-3 text-left">{t("col_module")}</th>
                <th className="px-4 py-3 text-left">{t("col_tenant")}</th>
                <th className="px-4 py-3 text-left">{t("col_summary")}</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-border">
                  <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-mono text-xs">{log.actorEmail ?? log.actor}</div>
                    <Badge variant="muted" className="mt-0.5 text-[10px]">
                      {log.actorType}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-2">
                    <Badge>{log.module}</Badge>
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">
                    {log.tenant?.name ?? "—"}
                  </td>
                  <td className="px-4 py-2 max-w-xs truncate text-muted-foreground">
                    {log.summary ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              {t("empty")}
            </p>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {t("showing")} {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} {t("of")} {total}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={buildPageUrl(sp, page - 1)}
                className="rounded-md border border-border px-3 py-1 hover:bg-muted"
              >
                {t("prev")}
              </a>
            )}
            {page < totalPages && (
              <a
                href={buildPageUrl(sp, page + 1)}
                className="rounded-md border border-border px-3 py-1 hover:bg-muted"
              >
                {t("next")}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function buildPageUrl(params: AuditSearchParams, page: number): string {
  const sp = new URLSearchParams();
  if (page > 1) sp.set("page", String(page));
  if (params.module) sp.set("module", params.module);
  if (params.action) sp.set("action", params.action);
  if (params.actor) sp.set("actor", params.actor);
  if (params.actorType) sp.set("actorType", params.actorType);
  if (params.tenantId) sp.set("tenantId", params.tenantId);
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);
  const qs = sp.toString();
  return `/admin/audit${qs ? `?${qs}` : ""}`;
}
