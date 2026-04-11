import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/tenant";
import { formatDate } from "@/lib/utils";
import { revalidatePath } from "next/cache";

async function inviteAdmin(formData: FormData) {
  "use server";
  const { admin } = await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await prisma.adminInvitation.create({
    data: { email, invitedByAdminUserId: admin.id, expiresAt },
  });
  await prisma.auditLog.create({
    data: {
      entityType: "admin_invitation",
      entityId: email,
      action: "admin_invitation.created",
      actor: admin.email,
      actorType: "admin",
    },
  });
  revalidatePath("/admin/admin-users");
}

export default async function AdminUsersPage() {
  const [admins, invitations] = await Promise.all([
    prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.adminInvitation.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <div>
      <PageHeader
        title="Administradores Gerais"
        description="Apenas administradores gerais podem convidar outros administradores. Toda ação é auditada."
      />
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Administradores ({admins.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">E-mail</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Criado</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="px-4 py-2">{a.name ?? "—"}</td>
                    <td className="px-4 py-2 font-mono text-xs">{a.email}</td>
                    <td className="px-4 py-2">
                      <Badge>{a.role}</Badge>
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant={a.status === "active" ? "positive" : "muted"}>
                        {a.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {formatDate(a.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Convidar administrador</CardTitle>
            <CardDescription>Convite expira em 7 dias.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={inviteAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" required />
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
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Expira</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv.id} className="border-t border-border">
                    <td className="px-4 py-2">{inv.email}</td>
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
