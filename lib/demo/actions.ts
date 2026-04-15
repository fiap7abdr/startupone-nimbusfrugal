"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { createAuditLog } from "@/lib/audit";

export async function toggleDemoMode(nextValue: boolean) {
  const { tenant, user } = await requireTenant();

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { demoMode: nextValue },
  });

  await createAuditLog({
    tenantId: tenant.id,
    entityType: "tenant",
    entityId: tenant.id,
    action: nextValue ? "demo.enabled" : "demo.disabled",
    actor: user.id,
    actorEmail: user.email,
    module: "tenants",
    summary: nextValue
      ? `Ativou modo demo em ${tenant.name}`
      : `Desativou modo demo em ${tenant.name}`,
    before: { demoMode: tenant.demoMode },
    after: { demoMode: nextValue },
  });

  revalidatePath("/app", "layout");
}
