import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";

export async function GET() {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  const summaries = await prisma.attendanceSummary.findMany({
    where: { studentId: sp.id },
    include: {
      section: {
        include: { course: true },
      },
    },
  });

  return NextResponse.json({
    records: summaries.map(s => ({
      courseCode: s.section.course.code,
      courseName: s.section.course.name,
      section: s.section.sectionCode,
      present: s.presentCount,
      excusedAbsences: 0,
      unexcusedAbsences: s.absentCount,
      excusedTardiness: 0,
      unexcusedTardiness: 0,
      totalSessions: s.presentCount + s.absentCount,
    })),
  });
}
