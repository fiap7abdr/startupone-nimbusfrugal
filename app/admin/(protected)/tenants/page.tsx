import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function AdminTenantsPage() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: true,
      billing: true,
      _count: { select: { members: true, integrations: true } },
    },
  });

  const t = await getTranslations("admin");
  const tc = await getTranslations("common");

  return (
    <div>
      <PageHeader
        title={t("tenants_title")}
        description={t("tenants_desc")}
      />
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Tenant</th>
                <th className="px-4 py-3 text-left">{t("col_owner")}</th>
                <th className="px-4 py-3 text-left">{tc("plan")}</th>
                <th className="px-4 py-3 text-right">{t("col_members")}</th>
                <th className="px-4 py-3 text-right">{t("col_integrations")}</th>
                <th className="px-4 py-3 text-left">{tc("created")}</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((ten) => (
                <tr key={ten.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{ten.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{ten.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{ten.owner.email}</td>
                  <td className="px-4 py-3">
                    <Badge>{ten.billing?.plan ?? ten.plan}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">{ten._count.members}</td>
                  <td className="px-4 py-3 text-right">{ten._count.integrations}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(ten.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tenants.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              {t("tenants_empty")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
