import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireStudent();
  if (error) return error;

  await prisma.notification.updateMany({
    where: { id: params.id, userId: session!.user.id },
    data: { isRead: true, readAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
