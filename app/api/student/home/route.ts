import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";

export async function GET() {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  // Get enrolled section IDs
  const enrollments = await prisma.sectionEnrollment.findMany({
    where: { studentId: sp.id, status: "ENROLLED" },
    select: { sectionId: true, section: { select: { courseId: true, course: { select: { code: true, name: true } }, meetings: true } } },
  });
  const sectionIds = enrollments.map(e => e.sectionId);

  // Quick stats
  const activeCourses = enrollments.length;
  const pendingAssignments = await prisma.assignment.count({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      dueAt: { gte: new Date() },
      sections: { some: { sectionId: { in: sectionIds } } },
    },
  });
  const upcomingExams = await prisma.exam.count({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      examDate: { gte: new Date() },
      sections: { some: { sectionId: { in: sectionIds } } },
    },
  });

  // Today's classes
  const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const todayDay = days[new Date().getDay()];
  const todayClasses = enrollments.flatMap(e =>
    e.section.meetings
      .filter(m => m.dayOfWeek === todayDay)
      .map(m => ({
        id: m.id,
        courseName: e.section.course.name,
        courseCode: e.section.course.code,
        time: m.startTime,
        endTime: m.endTime,
        room: m.room ?? "",
        instructor: "",
      }))
  ).sort((a, b) => a.time.localeCompare(b.time));

  // Upcoming deadlines (assignments due in next 7 days)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  const deadlines = await prisma.assignment.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      dueAt: { gte: new Date(), lte: sevenDaysFromNow },
      sections: { some: { sectionId: { in: sectionIds } } },
    },
    include: { course: { select: { code: true, name: true } } },
    orderBy: { dueAt: "asc" },
    take: 10,
  });

  // Announcements (latest 4 published)
  const announcements = await prisma.announcement.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      OR: [
        { scope: "GLOBAL" },
        { sectionId: { in: sectionIds } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });

  return NextResponse.json({
    stats: {
      gpa: sp.gpa ? Number(sp.gpa) : 0,
      activeCourses,
      pendingAssignments,
      upcomingExams,
    },
    todayClasses,
    deadlines: deadlines.map(a => ({
      id: a.id,
      title: a.title,
      courseCode: a.course.code,
      courseName: a.course.name,
      dueDate: a.dueAt?.toISOString().split("T")[0] ?? "",
    })),
    announcements: announcements.map(a => ({
      id: a.id,
      title: a.title,
      body: a.body,
      date: a.publishedAt?.toISOString().split("T")[0] ?? a.createdAt.toISOString().split("T")[0],
      category: a.scope === "GLOBAL" ? "academic" : "academic",
    })),
  });
}
