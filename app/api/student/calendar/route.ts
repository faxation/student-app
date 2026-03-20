import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";
import { DEV_STUDENT_CALENDAR } from "@/lib/server/dev-student-data";

export async function GET(request: NextRequest) {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  try {
    const enrollments = await prisma.sectionEnrollment.findMany({
      where: { studentId: sp.id, status: "ENROLLED" },
      select: { sectionId: true },
    });
    const sectionIds = enrollments.map(e => e.sectionId);

    const events = await prisma.calendarEvent.findMany({
      where: {
        OR: [
          { sectionId: { in: sectionIds } },
          { sectionId: null }, // global events (holidays, etc.)
        ],
      },
      orderBy: { eventDate: "asc" },
    });

    return NextResponse.json({
      events: events.map(e => ({
        id: e.id,
        title: e.title,
        date: e.eventDate.toISOString().split("T")[0],
        time: e.startTime ?? undefined,
        startTime: e.startTime ?? undefined,
        endTime: e.endTime ?? undefined,
        type: e.eventType === "CLASS_SESSION" ? "class" : e.eventType === "ASSIGNMENT_DUE" ? "assignment" : e.eventType === "EXAM" ? "exam" : "event",
        courseCode: e.courseCode ?? undefined,
        location: "",
        sectionNumber: "",
      })),
    });
  } catch {
    return NextResponse.json(DEV_STUDENT_CALENDAR);
  }
}
