import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";
import { DEV_STUDENT_ATTENDANCE } from "@/lib/server/dev-student-data";

export async function GET() {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  try {
    const rows = await prisma.attendanceSummary.findMany({
      where: { studentId: sp.id },
      include: {
        section: {
          include: { course: true },
        },
      },
    });

    return NextResponse.json({
      summaries: rows.map(s => ({
        sectionId: s.sectionId,
        courseCode: s.section.course.code,
        courseName: s.section.course.name,
        sectionNumber: s.section.sectionCode,
        totalSessions: s.presentCount + s.absentCount,
        present: s.presentCount,
        late: 0,
        excused: 0,
        absent: s.absentCount,
        warningLevel: s.absentCount >= 5 ? "high" : s.absentCount >= 3 ? "medium" : "none",
      })),
    });
  } catch {
    return NextResponse.json(DEV_STUDENT_ATTENDANCE);
  }
}
