import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";

export async function GET() {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const sections = await prisma.section.findMany({
    where: { instructorId: ip.id, deletedAt: null },
    include: { course: true, term: true, enrollments: { where: { status: "ENROLLED" } } },
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
  }));

  return NextResponse.json({ courses });
}
