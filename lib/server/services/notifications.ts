import { prisma } from "@/lib/server/db";
import { NotificationType } from "@prisma/client";

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  entityType?: string;
  entityId?: string;
}) {
  return prisma.notification.create({ data: params });
}

/**
 * Notify all enrolled students in given section IDs.
 */
export async function notifySectionStudents(params: {
  sectionIds: string[];
  type: NotificationType;
  title: string;
  body?: string;
  entityType?: string;
  entityId?: string;
}) {
  const enrollments = await prisma.sectionEnrollment.findMany({
    where: {
      sectionId: { in: params.sectionIds },
      status: "ENROLLED",
    },
    include: { student: { select: { userId: true } } },
  });

  const userIds = Array.from(new Set(enrollments.map((e) => e.student.userId)));

  if (userIds.length === 0) return;

  await prisma.notification.createMany({
    data: userIds.map((userId) => ({
      userId,
      type: params.type,
      title: params.title,
      body: params.body,
      entityType: params.entityType,
      entityId: params.entityId,
    })),
  });
}
