import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";

export async function GET(
  _request: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const section = await prisma.section.findUnique({
    where: { id: params.sectionId },
    include: {
      course: true, term: true, meetings: true,
      enrollments: { where: { status: { in: ["ENROLLED", "ACADEMICALLY_WITHDRAWN"] } }, include: { student: true } },
    },
  });

  if (!section || section.instructorId !== ip.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: section.id,
    courseCode: section.course.code,
    courseName: section.course.name,
    sectionCode: section.sectionCode,
    term: section.term.name,
    room: section.room,
    capacity: section.capacity,
    meetings: section.meetings.map(m => ({
      dayOfWeek: m.dayOfWeek,
      startTime: m.startTime,
      endTime: m.endTime,
      room: m.room,
    })),
    students: section.enrollments.map(e => ({
      id: e.student.id,
      name: e.student.fullName,
      studentId: e.student.studentId,
      status: e.status,
    })),
  });
}
