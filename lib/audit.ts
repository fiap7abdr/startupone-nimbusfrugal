import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

interface AuditLogInput {
  tenantId?: string;
  entityType: string;
  entityId: string;
  action: string;
  actor: string;
  actorEmail?: string;
  actorType?: "user" | "admin" | "system";
  module: string;
  summary?: string;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
  metadata?: Prisma.InputJsonValue;
}

export async function createAuditLog(input: AuditLogInput) {
  await prisma.auditLog.create({
    data: {
      ...(input.tenantId ? { tenant: { connect: { id: input.tenantId } } } : {}),
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      actor: input.actor,
      actorEmail: input.actorEmail,
      actorType: input.actorType ?? "user",
      module: input.module,
      summary: input.summary,
      beforeJson: input.before,
      afterJson: input.after,
      metadataJson: input.metadata,
    },
  });
}
