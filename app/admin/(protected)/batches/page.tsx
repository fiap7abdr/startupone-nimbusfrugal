import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function AdminBatchesPage() {
  const batches = await prisma.collectionBatch.findMany({
    orderBy: { scheduledAt: "desc" },
    take: 50,
    include: { tenant: true },
  });

  const t = await getTranslations("admin");
  const tc = await getTranslations("common");

  return (
    <div>
      <PageHeader
        title={t("batches_title")}
        description={t("batches_desc")}
      />
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">{t("col_tenant")}</th>
                <th className="px-4 py-3 text-left">{t("col_type")}</th>
                <th className="px-4 py-3 text-left">{tc("status")}</th>
                <th className="px-4 py-3 text-right">{t("col_collected")}</th>
                <th className="px-4 py-3 text-right">{t("col_failures")}</th>
                <th className="px-4 py-3 text-left">{t("col_scheduled")}</th>
                <th className="px-4 py-3 text-left">{t("col_finished")}</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{b.tenant.name}</td>
                  <td className="px-4 py-3">{b.batchType}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        b.status === "success"
                          ? "positive"
                          : b.status === "failed"
                            ? "negative"
                            : "muted"
                      }
                    >
                      {b.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">{b.recordsCollected}</td>
                  <td className="px-4 py-3 text-right">{b.recordsFailed}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(b.scheduledAt)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(b.finishedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {batches.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              {t("batches_empty")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
