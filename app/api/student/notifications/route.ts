import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";
import { DEV_STUDENT_NOTIFICATIONS } from "@/lib/server/dev-student-data";

export async function GET() {
  const { session, error } = await requireStudent();
  if (error) return error;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session!.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      notifications: notifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
      unreadCount: notifications.filter(n => !n.isRead).length,
    });
  } catch {
    return NextResponse.json(DEV_STUDENT_NOTIFICATIONS);
  }
}
