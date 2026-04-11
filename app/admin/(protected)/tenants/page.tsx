import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminTenantsPage() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: true,
      billing: true,
      _count: { select: { members: true, integrations: true } },
    },
  });

  return (
    <div>
      <PageHeader
        title="Tenants"
        description="Todos os clientes da plataforma."
      />
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Tenant</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Plano</th>
                <th className="px-4 py-3 text-right">Membros</th>
                <th className="px-4 py-3 text-right">Integrações</th>
                <th className="px-4 py-3 text-left">Criado</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium">{t.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{t.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{t.owner.email}</td>
                  <td className="px-4 py-3">
                    <Badge>{t.billing?.plan ?? t.plan}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">{t._count.members}</td>
                  <td className="px-4 py-3 text-right">{t._count.integrations}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tenants.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Nenhum tenant ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
