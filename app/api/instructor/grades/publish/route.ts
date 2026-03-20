import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { createAuditLog } from "@/lib/server/services/audit";
import { notifySectionStudents } from "@/lib/server/services/notifications";

export async function POST(request: NextRequest) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const { sectionId } = await request.json();
  if (!sectionId) {
    return NextResponse.json({ error: "sectionId required" }, { status: 400 });
  }

  const section = await prisma.section.findUnique({ where: { id: sectionId } });
  if (!section || section.instructorId !== ip.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const result = await prisma.gradeAttempt.updateMany({
    where: { sectionId, isPublished: false, gradedById: ip.id },
    data: { isPublished: true, publishedAt: new Date() },
  });

  await createAuditLog({
    actorId: session!.user.id,
    entityType: "GradeAttempt",
    entityId: sectionId,
    action: "BULK_PUBLISH",
    newValues: { count: result.count },
  });

  await notifySectionStudents({
    sectionIds: [sectionId],
    type: "GRADE_RELEASE",
    title: "Grades Released",
    body: "New grades have been published. Check your grades page.",
    entityType: "Section",
    entityId: sectionId,
  });

  return NextResponse.json({ published: result.count });
}
