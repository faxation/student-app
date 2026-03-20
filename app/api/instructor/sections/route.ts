import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { DEV_INSTRUCTOR_SECTIONS } from "@/lib/server/dev-instructor-data";

export async function GET() {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  try {
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
        number: s.sectionCode,
        courseId: s.courseId,
        courseCode: s.course.code,
        courseName: s.course.name,
        status: s.status,
        modality: s.modality,
        meetingTimes: s.meetings.map(m => `${m.dayOfWeek.slice(0,3)} ${m.startTime} – ${m.endTime}`).join(", "),
        enrollmentCount: s.enrollments.length,
        maxCapacity: s.capacity,
      })),
    });
  } catch {
    // Database unavailable — return dev data
    return NextResponse.json(DEV_INSTRUCTOR_SECTIONS);
  }
}
