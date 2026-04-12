import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/tenant";
import { getTranslations } from "next-intl/server";
import { UsersTable } from "./users-table";

export default async function AdminUsersPage() {
  const { admin } = await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      memberships: {
        include: { tenant: true },
        where: { membershipStatus: "active" },
      },
      ownedTenants: { select: { id: true } },
    },
  });

  const t = await getTranslations("admin");

  const serializedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt.toISOString(),
    memberships: user.memberships.map((m) => ({
      id: m.id,
      tenantName: m.tenant.name,
      targetGroup: m.targetGroup,
    })),
    isOwnerOfTenants: user.ownedTenants.length > 0,
    isSelf: user.email === admin.email,
  }));

  return (
    <div>
      <PageHeader
        title={t("users_title")}
        description={t("users_desc")}
      />
      <Card>
        <CardContent className="p-0">
          <UsersTable users={serializedUsers} />
          {users.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              {t("users_empty")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
