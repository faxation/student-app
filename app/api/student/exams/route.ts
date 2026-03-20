import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";

export async function GET() {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  const enrollments = await prisma.sectionEnrollment.findMany({
    where: { studentId: sp.id, status: "ENROLLED" },
    select: { sectionId: true },
  });
  const sectionIds = enrollments.map(e => e.sectionId);

  const exams = await prisma.exam.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      sections: { some: { sectionId: { in: sectionIds } } },
    },
    include: { course: { select: { code: true, name: true } } },
    orderBy: { examDate: "asc" },
  });

  return NextResponse.json({
    exams: exams.map(e => ({
      id: e.id,
      courseName: e.course.name,
      courseCode: e.course.code,
      date: e.examDate?.toISOString().split("T")[0] ?? "",
      time: e.startTime ?? "",
      duration: e.startTime && e.endTime ? `${e.startTime} - ${e.endTime}` : "",
      room: e.room ?? "",
      format: "in-person" as const,
      type: e.examNumberLabel.toLowerCase().includes("final") ? "final" as const : "midterm" as const,
    })),
  });
}
