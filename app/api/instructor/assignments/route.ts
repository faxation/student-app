import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { validateTotalWeight, getNextAssignmentNumber } from "@/lib/server/services/grades";
import { createAuditLog } from "@/lib/server/services/audit";

export async function GET() {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const assignments = await prisma.assignment.findMany({
    where: { createdById: ip.id, deletedAt: null },
    include: {
      course: { select: { code: true, name: true } },
      sections: { include: { section: { select: { id: true, sectionCode: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    assignments: assignments.map(a => ({
      id: a.id,
      title: a.title,
      courseId: a.courseId,
      courseCode: a.course.code,
      courseName: a.course.name,
      sectionId: a.sections[0]?.section.id ?? "",
      sectionLabel: a.sections[0] ? `Section ${a.sections[0].section.sectionCode}` : "",
      dueDate: a.dueAt?.toISOString().split("T")[0] ?? "",
      weight: Number(a.weightPercent),
      hasFile: false,
      status: a.status.toLowerCase(),
    })),
  });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const body = await request.json();
  const { title, courseId, sectionIds, dueAt, weightPercent, instructionsText, relatedChapter } = body;

  if (!title || !courseId || !sectionIds?.length || !weightPercent) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify instructor owns these sections
  const sections = await prisma.section.findMany({
    where: { id: { in: sectionIds }, instructorId: ip.id },
  });
  if (sections.length !== sectionIds.length) {
    return NextResponse.json({ error: "Unauthorized for one or more sections" }, { status: 403 });
  }

  // Validate weight
  for (const sid of sectionIds) {
    const { valid, currentTotal } = await validateTotalWeight({
      courseId, sectionId: sid, newWeight: weightPercent,
    });
    if (!valid) {
      return NextResponse.json({
        error: `Total weight would exceed 90%. Current total: ${currentTotal}%`,
      }, { status: 400 });
    }
  }

  const assignmentNumber = await getNextAssignmentNumber(courseId);

  const assignment = await prisma.assignment.create({
    data: {
      courseId,
      createdById: ip.id,
      assignmentNumber,
      title,
      relatedChapter,
      instructionsText,
      weightPercent,
      dueAt: dueAt ? new Date(dueAt) : null,
      status: "DRAFT",
      sections: {
        create: sectionIds.map((sectionId: string) => ({ sectionId })),
      },
    },
    include: { course: { select: { code: true, name: true } }, sections: { include: { section: true } } },
  });

  await createAuditLog({
    actorId: session!.user.id,
    entityType: "Assignment",
    entityId: assignment.id,
    action: "CREATE",
    newValues: { title, courseId, weightPercent, assignmentNumber },
  });

  return NextResponse.json({
    id: assignment.id,
    title: assignment.title,
    courseCode: assignment.course.code,
    courseName: assignment.course.name,
    assignmentNumber,
    status: assignment.status,
  }, { status: 201 });
}
