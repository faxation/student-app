import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";

export async function GET(request: NextRequest) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const sectionId = request.nextUrl.searchParams.get("sectionId");
  if (!sectionId) {
    return NextResponse.json({ error: "sectionId required" }, { status: 400 });
  }

  const section = await prisma.section.findUnique({ where: { id: sectionId } });
  if (!section || section.instructorId !== ip.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const enrollments = await prisma.sectionEnrollment.findMany({
    where: { sectionId, status: { in: ["ENROLLED", "COMPLETED"] } },
    include: { student: true },
    orderBy: { student: { fullName: "asc" } },
  });

  // Get existing grade attempts for this section
  const gradeAttempts = await prisma.gradeAttempt.findMany({
    where: { sectionId },
    include: { assignment: true, exam: true },
  });

  // Get assignments and exams for this section
  const assignments = await prisma.assignment.findMany({
    where: { deletedAt: null, sections: { some: { sectionId } } },
    orderBy: { assignmentNumber: "asc" },
  });
  const exams = await prisma.exam.findMany({
    where: { deletedAt: null, sections: { some: { sectionId } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    students: enrollments.map(e => ({
      id: e.student.id,
      name: e.student.fullName,
      studentId: e.student.studentId,
      status: e.status,
    })),
    assignments: assignments.map(a => ({
      id: a.id,
      title: a.title,
      number: a.assignmentNumber,
      weight: Number(a.weightPercent),
    })),
    exams: exams.map(e => ({
      id: e.id,
      title: e.title,
      label: e.examNumberLabel,
      weight: Number(e.weightPercent),
    })),
    grades: gradeAttempts.map(g => ({
      id: g.id,
      studentId: g.studentId,
      assignmentId: g.assignmentId,
      examId: g.examId,
      numericGrade: g.numericGrade ? Number(g.numericGrade) : null,
      letterGrade: g.letterGrade,
      isPublished: g.isPublished,
    })),
  });
}
