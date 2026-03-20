import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { notifySectionStudents } from "@/lib/server/services/notifications";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const announcement = await prisma.announcement.findUnique({ where: { id: params.id } });
  if (!announcement || announcement.createdById !== ip.id || announcement.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.announcement.update({
    where: { id: params.id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  // Notify students if section-scoped
  if (announcement.sectionId) {
    await notifySectionStudents({
      sectionIds: [announcement.sectionId],
      type: "ANNOUNCEMENT_RELEASE",
      title: announcement.title,
      body: announcement.body,
      entityType: "Announcement",
      entityId: announcement.id,
    });
  }

  return NextResponse.json({ success: true });
}
