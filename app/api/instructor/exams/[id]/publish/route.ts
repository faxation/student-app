import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { createAuditLog } from "@/lib/server/services/audit";
import { notifySectionStudents } from "@/lib/server/services/notifications";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: { sections: true, course: true },
  });

  if (!exam || exam.createdById !== ip.id || exam.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (exam.status === "PUBLISHED") {
    return NextResponse.json({ error: "Already published" }, { status: 400 });
  }

  await prisma.exam.update({
    where: { id: params.id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  await createAuditLog({
    actorId: session!.user.id,
    entityType: "Exam",
    entityId: params.id,
    action: "PUBLISH",
  });

  const sectionIds = exam.sections.map(s => s.sectionId);
  await notifySectionStudents({
    sectionIds,
    type: "EXAM_REMINDER",
    title: `New Exam: ${exam.title}`,
    body: `An exam has been published for ${exam.course.code}.`,
    entityType: "Exam",
    entityId: exam.id,
  });

  return NextResponse.json({ success: true });
}
