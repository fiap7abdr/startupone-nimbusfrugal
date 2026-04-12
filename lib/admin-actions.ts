"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/tenant";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  const { admin } = await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { ownedTenants: true, memberships: { include: { tenant: true } } },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.email === admin.email) {
    throw new Error("You cannot delete yourself.");
  }

  const tenantNames = user.ownedTenants.map((t) => t.name);

  for (const tenant of user.ownedTenants) {
    await prisma.tenant.delete({ where: { id: tenant.id } });
  }

  await prisma.user.delete({ where: { id: userId } });

  await createAuditLog({
    entityType: "user",
    entityId: userId,
    action: "user.deleted",
    actor: admin.email,
    actorType: "admin",
    module: "admin",
    summary: `Excluiu usuário ${user.name ?? user.email}${tenantNames.length > 0 ? ` (tenants removidos: ${tenantNames.join(", ")})` : ""}`,
    before: { name: user.name, email: user.email, ownedTenants: tenantNames },
  });

  revalidatePath("/admin/users");
}
