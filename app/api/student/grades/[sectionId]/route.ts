import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";

export async function GET(
  _request: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  const gradeAttempts = await prisma.gradeAttempt.findMany({
    where: { studentId: sp.id, sectionId: params.sectionId, isPublished: true },
    include: { assignment: true, exam: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    grades: gradeAttempts.map(g => ({
      id: g.id,
      title: g.assignment?.title ?? g.exam?.title ?? "",
      type: g.assignmentId ? "assignment" : "exam",
      numericGrade: g.numericGrade ? Number(g.numericGrade) : null,
      letterGrade: g.letterGrade,
      weight: g.assignment ? Number(g.assignment.weightPercent) : g.exam ? Number(g.exam.weightPercent) : 0,
      feedback: g.feedback,
    })),
  });
}
