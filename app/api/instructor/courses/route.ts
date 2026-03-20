import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { DEV_INSTRUCTOR_COURSES } from "@/lib/server/dev-instructor-data";

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
    });

    // Group by course
    const courseMap = new Map<string, { course: any; term: any; sections: any[] }>();
    for (const s of sections) {
      const key = s.courseId;
      if (!courseMap.has(key)) {
        courseMap.set(key, { course: s.course, term: s.term, sections: [] });
      }
      courseMap.get(key)!.sections.push(s);
    }

    const courses = Array.from(courseMap.values()).map(({ course, term, sections: secs }) => ({
      id: course.id,
      code: course.code,
      name: course.name,
      term: term.name,
      credits: course.credits,
      sectionCount: secs.length,
      sections: secs.map((s: any) => ({
        id: s.id,
        number: s.sectionCode,
        status: s.status,
        enrollmentCount: s.enrollments.length,
        meetingTimes: s.meetings
          .map((m: any) => `${m.dayOfWeek.slice(0, 3)} ${m.startTime} – ${m.endTime}`)
          .join(", "),
      })),
    }));

    return NextResponse.json({ courses });
  } catch {
    // Database unavailable — return dev data
    return NextResponse.json(DEV_INSTRUCTOR_COURSES);
  }
}
