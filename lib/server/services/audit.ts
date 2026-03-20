import { prisma } from "@/lib/server/db";

export async function createAuditLog(params: {
  actorId?: string;
  entityType: string;
  entityId: string;
  action: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      actorId: params.actorId,
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      oldValues: params.oldValues ? (params.oldValues as never) : undefined,
      newValues: params.newValues ? (params.newValues as never) : undefined,
    },
  });
}
