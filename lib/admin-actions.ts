"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/tenant";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  const { admin } = await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { ownedTenants: true },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  // Prevent deleting yourself
  if (user.email === admin.email) {
    throw new Error("You cannot delete yourself.");
  }

  // Delete tenants owned by this user (cascade will clean up members, integrations, etc.)
  for (const tenant of user.ownedTenants) {
    await prisma.tenant.delete({ where: { id: tenant.id } });
  }

  // Delete the user (cascade cleans up accounts, sessions, memberships)
  await prisma.user.delete({ where: { id: userId } });

  await prisma.auditLog.create({
    data: {
      entityType: "user",
      entityId: userId,
      action: "user.deleted",
      actor: admin.email,
      actorType: "admin",
    },
  });

  revalidatePath("/admin/users");
}
