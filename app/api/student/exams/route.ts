import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";
import { DEV_STUDENT_EXAMS } from "@/lib/server/dev-student-data";

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

    const exams = await prisma.exam.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        sections: { some: { sectionId: { in: sectionIds } } },
      },
      include: {
        course: { select: { code: true, name: true } },
        sections: { include: { section: { select: { sectionCode: true } } } },
      },
      orderBy: { examDate: "asc" },
    });

    return NextResponse.json({
      exams: exams.map(e => ({
        id: e.id,
        title: e.title,
        courseName: e.course.name,
        courseCode: e.course.code,
        sectionNumber: e.sections[0]?.section.sectionCode ?? "",
        date: e.examDate?.toISOString().split("T")[0] ?? "",
        startTime: e.startTime ?? "",
        endTime: e.endTime ?? "",
        time: e.startTime ?? "",
        duration: e.startTime && e.endTime ? `${e.startTime} - ${e.endTime}` : "",
        room: e.room ?? "",
        location: e.room ?? "",
        weight: Number(e.weightPercent),
        format: "in-person" as const,
        type: e.examNumberLabel.toLowerCase().includes("final") ? "final" as const
          : e.examNumberLabel.toLowerCase().includes("quiz") ? "quiz" as const
          : "midterm" as const,
        status: e.status.toLowerCase(),
      })),
    });
  } catch {
    return NextResponse.json(DEV_STUDENT_EXAMS);
  }
}
