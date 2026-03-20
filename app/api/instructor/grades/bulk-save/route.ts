import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { computeLetterGrade } from "@/lib/server/services/grades";
import { createAuditLog } from "@/lib/server/services/audit";

interface GradeInput {
  studentId: string;
  assignmentId?: string;
  examId?: string;
  numericGrade: number;
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const body = await request.json();
  const { sectionId, grades } = body as { sectionId: string; grades: GradeInput[] };

  if (!sectionId || !grades?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const section = await prisma.section.findUnique({ where: { id: sectionId } });
  if (!section || section.instructorId !== ip.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Check AW students
  const awStudents = await prisma.sectionEnrollment.findMany({
    where: { sectionId, status: "ACADEMICALLY_WITHDRAWN" },
    select: { studentId: true },
  });
  const awSet = new Set(awStudents.map(e => e.studentId));

  const results = [];
  for (const g of grades) {
    if (awSet.has(g.studentId)) continue; // Skip AW students

    const letterGrade = await computeLetterGrade(g.numericGrade);

    const existing = await prisma.gradeAttempt.findFirst({
      where: {
        studentId: g.studentId,
        sectionId,
        assignmentId: g.assignmentId ?? null,
        examId: g.examId ?? null,
      },
      orderBy: { attemptNumber: "desc" },
    });

    if (existing) {
      await prisma.gradeAttempt.update({
        where: { id: existing.id },
        data: {
          numericGrade: g.numericGrade,
          letterGrade,
          gradedById: ip.id,
        },
      });

      await createAuditLog({
        actorId: session!.user.id,
        entityType: "GradeAttempt",
        entityId: existing.id,
        action: "UPDATE",
        oldValues: { numericGrade: existing.numericGrade ? Number(existing.numericGrade) : null },
        newValues: { numericGrade: g.numericGrade, letterGrade },
      });

      results.push({ id: existing.id, updated: true });
    } else {
      const created = await prisma.gradeAttempt.create({
        data: {
          studentId: g.studentId,
          sectionId,
          assignmentId: g.assignmentId,
          examId: g.examId,
          attemptNumber: 1,
          numericGrade: g.numericGrade,
          letterGrade,
          gradedById: ip.id,
        },
      });
      results.push({ id: created.id, created: true });
    }
  }

  return NextResponse.json({ saved: results.length });
}
