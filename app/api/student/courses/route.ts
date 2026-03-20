import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";
import { DEV_STUDENT_COURSES } from "@/lib/server/dev-student-data";

export async function GET() {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  try {
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
      const presentCount = summary?.presentCount ?? 0;
      const absentCount = summary?.absentCount ?? 0;
      const totalCount = presentCount + absentCount;
      const schedule = s.meetings.map(m => `${m.dayOfWeek.slice(0,3)} ${m.startTime}-${m.endTime}`).join(", ");
      const meetingTimes = s.meetings.map(m => `${m.dayOfWeek.slice(0,3)} ${m.startTime} – ${m.endTime}`).join(", ");
      return {
        id: s.id,
        name: s.course.name,
        code: s.course.code,
        instructor: s.instructor.fullName,
        credits: s.course.credits,
        schedule,
        room: s.room ?? s.meetings[0]?.room ?? "",
        latestActivity: "",
        section: {
          id: s.id,
          number: s.sectionCode,
          instructor: s.instructor.fullName,
          meetingTimes,
          enrollmentCount: 0,
        },
        attendance: {
          present: presentCount,
          absent: absentCount,
          total: totalCount,
          absences: absentCount,
          warningLevel: absentCount >= 5 ? "high" : absentCount >= 3 ? "medium" : "none",
        },
      };
    });

    return NextResponse.json({ courses });
  } catch {
    return NextResponse.json(DEV_STUDENT_COURSES);
  }
}
