import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  const assignment = await prisma.assignment.findUnique({
    where: { id: params.id },
    include: {
      course: true,
      sections: { select: { sectionId: true } },
      files: { include: { file: true } },
    },
  });

  if (!assignment || assignment.status !== "PUBLISHED" || assignment.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Verify student is enrolled in one of the assignment's sections
  const enrollment = await prisma.sectionEnrollment.findFirst({
    where: {
      studentId: sp.id,
      sectionId: { in: assignment.sections.map(s => s.sectionId) },
      status: "ENROLLED",
    },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  return NextResponse.json({
    id: assignment.id,
    title: assignment.title,
    courseCode: assignment.course.code,
    courseName: assignment.course.name,
    dueDate: assignment.dueAt?.toISOString().split("T")[0] ?? "",
    weight: Number(assignment.weightPercent),
    instructions: assignment.instructionsText,
    chapter: assignment.relatedChapter,
    files: assignment.files.map(f => ({
      id: f.file.id,
      name: f.file.originalName,
      type: f.file.extension,
      size: f.file.sizeBytes,
    })),
  });
}
