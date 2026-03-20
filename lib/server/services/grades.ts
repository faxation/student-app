import { prisma } from "@/lib/server/db";
import { Decimal } from "@prisma/client/runtime/library";

/** Convert a numeric grade (0–100) to a letter grade using the GradeScale table. */
export async function computeLetterGrade(
  numericGrade: number
): Promise<string> {
  const scale = await prisma.gradeScale.findMany({
    orderBy: { minScore: "desc" },
  });

  for (const row of scale) {
    if (numericGrade >= Number(row.minScore)) {
      return row.letter;
    }
  }

  return "F";
}

/** Validate that the total weight of all assignments + exams for a section does not exceed 90%. */
export async function validateTotalWeight(params: {
  courseId: string;
  sectionId: string;
  excludeAssignmentId?: string;
  excludeExamId?: string;
  newWeight: number;
}): Promise<{ valid: boolean; currentTotal: number }> {
  // Get all assignment weights for sections matching this section
  const assignments = await prisma.assignment.findMany({
    where: {
      courseId: params.courseId,
      deletedAt: null,
      id: params.excludeAssignmentId
        ? { not: params.excludeAssignmentId }
        : undefined,
      sections: { some: { sectionId: params.sectionId } },
    },
    select: { weightPercent: true },
  });

  const exams = await prisma.exam.findMany({
    where: {
      courseId: params.courseId,
      deletedAt: null,
      id: params.excludeExamId ? { not: params.excludeExamId } : undefined,
      sections: { some: { sectionId: params.sectionId } },
    },
    select: { weightPercent: true },
  });

  const currentTotal =
    assignments.reduce((s, a) => s + Number(a.weightPercent), 0) +
    exams.reduce((s, e) => s + Number(e.weightPercent), 0);

  return {
    valid: currentTotal + params.newWeight <= 90,
    currentTotal,
  };
}

/** Build the next assignment number for a course. */
export async function getNextAssignmentNumber(
  courseId: string
): Promise<number> {
  const max = await prisma.assignment.aggregate({
    where: { courseId, deletedAt: null },
    _max: { assignmentNumber: true },
  });
  return (max._max.assignmentNumber ?? 0) + 1;
}
