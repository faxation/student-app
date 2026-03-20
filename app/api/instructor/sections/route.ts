import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";

export async function GET() {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const sections = await prisma.section.findMany({
    where: { instructorId: ip.id, deletedAt: null },
    include: {
      course: true,
      term: true,
      meetings: true,
      enrollments: { where: { status: "ENROLLED" } },
    },
    orderBy: { course: { code: "asc" } },
  });

  return NextResponse.json({
    sections: sections.map(s => ({
      id: s.id,
      courseId: s.courseId,
      courseCode: s.course.code,
      courseName: s.course.name,
      label: `Section ${s.sectionCode}`,
      meetingTime: s.meetings.map(m => `${m.dayOfWeek.slice(0,3)} ${m.startTime} – ${m.endTime}`).join(", "),
      enrolledCount: s.enrollments.length,
    })),
  });
}
