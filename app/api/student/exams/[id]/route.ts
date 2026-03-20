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

  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: {
      course: true,
      sections: { select: { sectionId: true } },
      files: { include: { file: true } },
    },
  });

  if (!exam || exam.status !== "PUBLISHED" || exam.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const enrollment = await prisma.sectionEnrollment.findFirst({
    where: {
      studentId: sp.id,
      sectionId: { in: exam.sections.map(s => s.sectionId) },
      status: "ENROLLED",
    },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  return NextResponse.json({
    id: exam.id,
    title: exam.title,
    courseCode: exam.course.code,
    courseName: exam.course.name,
    examDate: exam.examDate?.toISOString().split("T")[0] ?? "",
    startTime: exam.startTime,
    endTime: exam.endTime,
    room: exam.room,
    weight: Number(exam.weightPercent),
    instructions: exam.instructionsText,
    chapters: exam.chaptersCovered,
  });
}
