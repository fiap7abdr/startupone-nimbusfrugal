"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { createAuditLog } from "@/lib/audit";

export async function renameTenant(nextName: string) {
  const { user, tenant } = await requireTenant();

  if (tenant.ownerUserId !== user.id) {
    throw new Error("Only the tenant owner can rename the tenant.");
  }

  const trimmed = nextName.trim();
  if (trimmed.length < 2 || trimmed.length > 80) {
    throw new Error("Tenant name must be between 2 and 80 characters.");
  }

  if (trimmed === tenant.name) return;

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { name: trimmed },
  });

  await createAuditLog({
    tenantId: tenant.id,
    entityType: "tenant",
    entityId: tenant.id,
    action: "tenant.renamed",
    actor: user.id,
    actorEmail: user.email,
    module: "tenants",
    summary: `Renomeou tenant de "${tenant.name}" para "${trimmed}"`,
    before: { name: tenant.name },
    after: { name: trimmed },
  });

  revalidatePath("/app", "layout");
}
