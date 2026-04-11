import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminBatchesPage() {
  const batches = await prisma.collectionBatch.findMany({
    orderBy: { scheduledAt: "desc" },
    take: 50,
    include: { tenant: true },
  });
  return (
    <div>
      <PageHeader
        title="Batches"
        description="Execuções diárias de coleta e consolidação por tenant."
      />
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Tenant</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Coletados</th>
                <th className="px-4 py-3 text-right">Falhas</th>
                <th className="px-4 py-3 text-left">Agendado</th>
                <th className="px-4 py-3 text-left">Finalizado</th>
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
              Nenhum batch executado ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
