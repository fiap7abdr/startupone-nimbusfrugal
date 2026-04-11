import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminIntegrationsPage() {
  const integrations = await prisma.integration.findMany({
    orderBy: { createdAt: "desc" },
    include: { tenant: true },
  });
  return (
    <div>
      <PageHeader
        title="Integrações"
        description="Visão global de integrações AWS por tenant."
      />
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Tenant</th>
                <th className="px-4 py-3 text-left">Conector</th>
                <th className="px-4 py-3 text-left">Modo</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Health</th>
                <th className="px-4 py-3 text-left">Última coleta</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{i.tenant.name}</td>
                  <td className="px-4 py-3">{i.connectorType}</td>
                  <td className="px-4 py-3">{i.integrationMode}</td>
                  <td className="px-4 py-3">
                    <Badge variant={i.status === "active" ? "positive" : "muted"}>
                      {i.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{i.healthStatus}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(i.lastSuccessfulCollection)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {integrations.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Nenhuma integração registrada.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
