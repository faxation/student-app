import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";

export async function GET() {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  const enrollments = await prisma.sectionEnrollment.findMany({
    where: { studentId: sp.id, status: { in: ["ENROLLED", "COMPLETED"] } },
    include: {
      section: {
        include: {
          course: true,
          term: true,
          instructor: true,
          meetings: true,
          attendanceSummaries: { where: { studentId: sp.id } },
        },
      },
    },
  });

  const courses = enrollments.map(e => {
    const s = e.section;
    const summary = s.attendanceSummaries[0];
    const schedule = s.meetings.map(m => `${m.dayOfWeek.slice(0,3)} ${m.startTime}-${m.endTime}`).join(", ");
    return {
      id: s.id, // sectionId used as the course identifier for student
      name: s.course.name,
      code: s.course.code,
      instructor: s.instructor.fullName,
      credits: s.course.credits,
      schedule,
      room: s.room ?? s.meetings[0]?.room ?? "",
      attendance: {
        present: summary?.presentCount ?? 0,
        absent: summary?.absentCount ?? 0,
        total: (summary?.presentCount ?? 0) + (summary?.absentCount ?? 0),
      },
      latestActivity: "",
    };
  });

  return NextResponse.json({ courses });
}
