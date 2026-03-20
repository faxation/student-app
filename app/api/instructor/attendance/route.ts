import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";

export async function GET(request: NextRequest) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const sectionId = request.nextUrl.searchParams.get("sectionId");

  const where: any = { section: { instructorId: ip.id } };
  if (sectionId) where.sectionId = sectionId;

  const sessions = await prisma.attendanceSession.findMany({
    where,
    include: {
      section: { include: { course: true } },
      records: { include: { student: true } },
    },
    orderBy: { sessionDate: "desc" },
    take: 50,
  });

  return NextResponse.json({
    sessions: sessions.map(s => ({
      id: s.id,
      sectionId: s.sectionId,
      courseCode: s.section.course.code,
      date: s.sessionDate.toISOString().split("T")[0],
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      records: s.records.map(r => ({
        id: r.id,
        studentId: r.studentId,
        studentName: r.student.fullName,
        value: r.value,
      })),
    })),
  });
}
