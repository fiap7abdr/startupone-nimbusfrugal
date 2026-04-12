import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";

export default async function OrganizationPage() {
  const { tenant } = await requireTenant();
  const org = await prisma.awsOrganization.findFirst({
    where: { tenantId: tenant.id },
  });
  const accounts = org
    ? await prisma.awsAccount.findMany({
        where: { organizationId: org.id },
        orderBy: { accountName: "asc" },
      })
    : [];
  const ous = org
    ? await prisma.organizationalUnit.findMany({
        where: { organizationId: org.id },
      })
    : [];

  return (
    <div>
      <PageHeader
        title="AWS Organization"
        description="Estrutura descoberta via AWS Organizations. Atualizada a cada batch diário."
      />
      {!org ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Nenhuma organização registrada. Comece pelo onboarding.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{org.organizationName}</CardTitle>
                  <CardDescription className="font-mono">{org.organizationId}</CardDescription>
                </div>
                <Badge variant={org.organizationStatus === "active" ? "positive" : "muted"}>
                  {org.organizationStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Management account:{" "}
                <span className="font-mono">{org.managementAccountId}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organizational Units ({ous.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {ous.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma OU descoberta ainda.
                </p>
              ) : (
                <ul className="space-y-2">
                  {ous.map((ou) => (
                    <li key={ou.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{ou.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {ou.ouId}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contas ({accounts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {accounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma conta descoberta ainda.
                </p>
              ) : (
                <div className="overflow-hidden rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 text-left">Nome</th>
                        <th className="px-4 py-2 text-left">Account ID</th>
                        <th className="px-4 py-2 text-left">Tipo</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((a) => (
                        <tr key={a.id} className="border-t border-border">
                          <td className="px-4 py-2 font-medium">{a.accountName}</td>
                          <td className="px-4 py-2 font-mono text-xs">{a.awsAccountId}</td>
                          <td className="px-4 py-2">{a.accountType}</td>
                          <td className="px-4 py-2">
                            <Badge variant={a.status === "active" ? "positive" : "muted"}>
                              {a.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
