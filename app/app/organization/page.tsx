import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import {
  Building2,
  FolderTree,
  Server,
  Crown,
} from "lucide-react";

interface OUNode {
  id: string;
  ouId: string;
  name: string;
  parentOuId: string | null;
  children: OUNode[];
  accounts: AccountNode[];
}

interface AccountNode {
  id: string;
  awsAccountId: string;
  accountName: string;
  accountType: string;
  status: string;
}

function buildTree(
  ous: { id: string; ouId: string; name: string; parentOuId: string | null }[],
  accounts: { id: string; awsAccountId: string; accountName: string; ouId: string | null; accountType: string; status: string }[],
): { roots: OUNode[]; unassignedAccounts: AccountNode[] } {
  const nodeMap = new Map<string, OUNode>();

  for (const ou of ous) {
    nodeMap.set(ou.ouId, {
      ...ou,
      children: [],
      accounts: [],
    });
  }

  // Assign accounts to their OUs
  const unassignedAccounts: AccountNode[] = [];
  for (const acc of accounts) {
    const node: AccountNode = {
      id: acc.id,
      awsAccountId: acc.awsAccountId,
      accountName: acc.accountName,
      accountType: acc.accountType,
      status: acc.status,
    };
    if (acc.ouId && nodeMap.has(acc.ouId)) {
      nodeMap.get(acc.ouId)!.accounts.push(node);
    } else {
      unassignedAccounts.push(node);
    }
  }

  // Build parent-child relationships
  const roots: OUNode[] = [];
  for (const node of nodeMap.values()) {
    if (node.parentOuId && nodeMap.has(node.parentOuId)) {
      nodeMap.get(node.parentOuId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return { roots, unassignedAccounts };
}

export default async function OrganizationPage() {
  const { tenant } = await requireTenant();

  const organizations = await prisma.awsOrganization.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "asc" },
    include: {
      ous: { orderBy: { name: "asc" } },
      accounts: { orderBy: { accountName: "asc" } },
    },
  });

  return (
    <div>
      <PageHeader
        title="AWS Organizations"
        description="Estrutura de contas descoberta via AWS Organizations. Atualizada a cada batch diario."
      />

      {organizations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Nenhuma organizacao registrada.{" "}
            <a href="/app/integrations" className="font-medium text-primary hover:underline">
              Adicione uma AWS Organization
            </a>{" "}
            para comecar.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {organizations.map((org) => {
            const { roots, unassignedAccounts } = buildTree(org.ous, org.accounts);
            const totalAccounts = org.accounts.length;

            return (
              <Card key={org.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle>{org.organizationName}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-mono">{org.organizationId}</span>
                          {" · "}Management: <span className="font-mono">{org.managementAccountId}</span>
                          {" · "}{totalAccounts} conta{totalAccounts !== 1 && "s"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={org.organizationStatus === "active" ? "positive" : "muted"}>
                      {org.organizationStatus}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  {roots.length === 0 && unassignedAccounts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Estrutura ainda nao descoberta. Execute o health check do conector AWS Organizations na{" "}
                      <a href={`/app/integrations/${org.id}`} className="font-medium text-primary hover:underline">
                        pagina de integracoes
                      </a>.
                    </p>
                  ) : (
                    <div className="text-sm">
                      {roots.map((root) => (
                        <OUTreeNode key={root.id} node={root} depth={0} />
                      ))}
                      {unassignedAccounts.length > 0 && (
                        <div className="mt-2">
                          {unassignedAccounts.map((acc) => (
                            <AccountRow key={acc.id} account={acc} depth={0} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OUTreeNode({ node, depth }: { node: OUNode; depth: number }) {
  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
        style={{ paddingLeft: `${depth * 24 + 8}px` }}
      >
        <FolderTree className="h-4 w-4 shrink-0 text-amber-500" />
        <span className="font-medium">{node.name}</span>
        <span className="font-mono text-xs text-muted-foreground">{node.ouId}</span>
      </div>
      {node.accounts.map((acc) => (
        <AccountRow key={acc.id} account={acc} depth={depth + 1} />
      ))}
      {node.children.map((child) => (
        <OUTreeNode key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function AccountRow({ account, depth }: { account: AccountNode; depth: number }) {
  const isManagement = account.accountType === "management";

  return (
    <div
      className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
      style={{ paddingLeft: `${depth * 24 + 8}px` }}
    >
      {isManagement ? (
        <Crown className="h-4 w-4 shrink-0 text-amber-500" />
      ) : (
        <Server className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <span className={isManagement ? "font-medium" : ""}>{account.accountName}</span>
      <span className="font-mono text-xs text-muted-foreground">{account.awsAccountId}</span>
      {isManagement && (
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">management</Badge>
      )}
      <Badge
        variant={account.status === "active" ? "positive" : "muted"}
        className="ml-auto text-[10px] px-1.5 py-0"
      >
        {account.status}
      </Badge>
    </div>
  );
}
