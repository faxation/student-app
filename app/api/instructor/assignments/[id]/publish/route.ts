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

  const assignment = await prisma.assignment.findUnique({
    where: { id: params.id },
    include: { sections: true, course: true },
  });

  if (!assignment || assignment.createdById !== ip.id || assignment.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (assignment.status === "PUBLISHED") {
    return NextResponse.json({ error: "Already published" }, { status: 400 });
  }

  await prisma.assignment.update({
    where: { id: params.id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });

  await createAuditLog({
    actorId: session!.user.id,
    entityType: "Assignment",
    entityId: params.id,
    action: "PUBLISH",
  });

  // Notify students
  const sectionIds = assignment.sections.map(s => s.sectionId);
  await notifySectionStudents({
    sectionIds,
    type: "ASSIGNMENT_REMINDER",
    title: `New Assignment: ${assignment.title}`,
    body: `A new assignment has been published for ${assignment.course.code}.`,
    entityType: "Assignment",
    entityId: assignment.id,
  });

  return NextResponse.json({ success: true });
}
