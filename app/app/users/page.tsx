import { PageHeader } from "@/components/app/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { formatDate } from "@/lib/utils";
import { revalidatePath } from "next/cache";

async function inviteUser(formData: FormData) {
  "use server";
  const { tenant, user } = await requireTenant();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const targetGroup = String(formData.get("group") ?? "read");
  if (!email) return;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.tenantInvitation.create({
    data: {
      tenantId: tenant.id,
      email,
      invitedByUserId: user.id,
      targetGroup,
      expiresAt,
    },
  });
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id,
      entityType: "tenant_invitation",
      entityId: email,
      action: "invitation.created",
      actor: user.email,
      actorType: "user",
    },
  });
  revalidatePath("/app/users");
}

export default async function UsersPage() {
  const { tenant } = await requireTenant();
  const [members, invitations] = await Promise.all([
    prisma.tenantMember.findMany({
      where: { tenantId: tenant.id },
      include: { user: true },
      orderBy: { joinedAt: "asc" },
    }),
    prisma.tenantInvitation.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Gerencie membros do tenant e convites. Grupos padrão: owner e read."
      />

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Membros ({members.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">Usuário</th>
                  <th className="px-4 py-2 text-left">Grupo</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Entrou em</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-t border-border">
                    <td className="px-4 py-2">
                      <p className="font-medium">{m.user.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{m.user.email}</p>
                    </td>
                    <td className="px-4 py-2">
                      <Badge>{m.targetGroup}</Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {m.membershipStatus}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {formatDate(m.joinedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Convidar usuário</CardTitle>
            <CardDescription>
              O convite expira em 7 dias. Owners têm acesso total; Read apenas
              visualização.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={inviteUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Grupo</Label>
                <select
                  id="group"
                  name="group"
                  className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm"
                  defaultValue="read"
                >
                  <option value="owner">Owner</option>
                  <option value="read">Read</option>
                </select>
              </div>
              <Button type="submit" className="w-full">
                Enviar convite
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {invitations.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Convites recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">E-mail</th>
                  <th className="px-4 py-2 text-left">Grupo</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Expira</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv.id} className="border-t border-border">
                    <td className="px-4 py-2">{inv.email}</td>
                    <td className="px-4 py-2">
                      <Badge>{inv.targetGroup}</Badge>
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant="muted">{inv.status}</Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {formatDate(inv.expiresAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
