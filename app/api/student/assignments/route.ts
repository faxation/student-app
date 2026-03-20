import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";
import { DEV_STUDENT_ASSIGNMENTS } from "@/lib/server/dev-student-data";

export async function GET() {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  try {
    const enrollments = await prisma.sectionEnrollment.findMany({
      where: { studentId: sp.id, status: "ENROLLED" },
      select: { sectionId: true },
    });
    const sectionIds = enrollments.map(e => e.sectionId);

    const assignments = await prisma.assignment.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        sections: { some: { sectionId: { in: sectionIds } } },
      },
      include: {
        course: { select: { code: true, name: true } },
        sections: { include: { section: { select: { sectionCode: true } } } },
      },
      orderBy: { dueAt: "asc" },
    });

    // Check which have grades submitted
    const gradeAttempts = await prisma.gradeAttempt.findMany({
      where: {
        studentId: sp.id,
        assignmentId: { in: assignments.map(a => a.id) },
      },
      select: { assignmentId: true },
    });
    const gradedIds = new Set(gradeAttempts.map(g => g.assignmentId));

    return NextResponse.json({
      assignments: assignments.map(a => {
        const dueDate = a.dueAt?.toISOString().split("T")[0] ?? "";
        const isPast = a.dueAt ? a.dueAt < new Date() : false;
        const hasGrade = gradedIds.has(a.id);
        let status: string = "pending";
        if (hasGrade) status = "submitted";
        else if (isPast) status = "late";

        return {
          id: a.id,
          title: a.title,
          courseCode: a.course.code,
          courseName: a.course.name,
          sectionNumber: a.sections[0]?.section.sectionCode ?? "",
          dueDate,
          weight: Number(a.weightPercent),
          status,
          description: a.instructionsText ?? "",
        };
      }),
    });
  } catch {
    return NextResponse.json(DEV_STUDENT_ASSIGNMENTS);
  }
}
