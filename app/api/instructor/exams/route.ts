import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { validateTotalWeight } from "@/lib/server/services/grades";
import { createAuditLog } from "@/lib/server/services/audit";

export async function GET() {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const exams = await prisma.exam.findMany({
    where: { createdById: ip.id, deletedAt: null },
    include: {
      course: { select: { code: true, name: true } },
      sections: { include: { section: { select: { id: true, sectionCode: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    exams: exams.map(e => ({
      id: e.id,
      title: e.title,
      courseId: e.courseId,
      courseCode: e.course.code,
      courseName: e.course.name,
      sectionId: e.sections[0]?.section.id ?? "",
      sectionLabel: e.sections[0] ? `Section ${e.sections[0].section.sectionCode}` : "",
      hasFile: false,
      fileType: "",
      createdDate: e.createdAt.toISOString().split("T")[0],
      status: e.status.toLowerCase(),
    })),
  });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const body = await request.json();
  const { title, courseId, sectionIds, examNumberLabel, examDate, startTime, endTime, room, weightPercent, instructionsText, chaptersCovered } = body;

  if (!title || !courseId || !sectionIds?.length || !weightPercent || !examNumberLabel) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify sections belong to instructor
  const sections = await prisma.section.findMany({
    where: { id: { in: sectionIds }, instructorId: ip.id },
  });
  if (sections.length !== sectionIds.length) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  for (const sid of sectionIds) {
    const { valid, currentTotal } = await validateTotalWeight({
      courseId, sectionId: sid, newWeight: weightPercent,
    });
    if (!valid) {
      return NextResponse.json({
        error: `Total weight would exceed 90%. Current: ${currentTotal}%`,
      }, { status: 400 });
    }
  }

  const exam = await prisma.exam.create({
    data: {
      courseId,
      createdById: ip.id,
      examNumberLabel,
      title,
      chaptersCovered,
      examDate: examDate ? new Date(examDate) : null,
      startTime,
      endTime,
      room,
      instructionsText,
      weightPercent,
      status: "DRAFT",
      sections: {
        create: sectionIds.map((sectionId: string) => ({ sectionId })),
      },
    },
  });

  await createAuditLog({
    actorId: session!.user.id,
    entityType: "Exam",
    entityId: exam.id,
    action: "CREATE",
    newValues: { title, courseId, weightPercent, examNumberLabel },
  });

  return NextResponse.json({ id: exam.id, title: exam.title }, { status: 201 });
}
