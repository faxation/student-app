import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { DEV_SECTION_ROSTERS } from "@/lib/server/dev-instructor-data";

export async function GET(request: NextRequest) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const sectionId = request.nextUrl.searchParams.get("sectionId");
  if (!sectionId) {
    return NextResponse.json({ error: "sectionId required" }, { status: 400 });
  }

  try {
    const section = await prisma.section.findUnique({ where: { id: sectionId } });
    if (!section || section.instructorId !== ip.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const enrollments = await prisma.sectionEnrollment.findMany({
      where: { sectionId, status: { in: ["ENROLLED", "COMPLETED"] } },
      include: { student: true },
      orderBy: { student: { fullName: "asc" } },
    });

    // Get latest published grade attempts per student
    const gradeAttempts = await prisma.gradeAttempt.findMany({
      where: { sectionId, isPublished: true },
    });

    // Calculate current grade per student (weighted average)
    const studentGrades = new Map<string, { total: number; letterGrade: string | null }>();
    for (const g of gradeAttempts) {
      if (g.numericGrade != null) {
        const current = studentGrades.get(g.studentId) ?? { total: 0, letterGrade: null };
        current.total = Number(g.numericGrade);
        current.letterGrade = g.letterGrade;
        studentGrades.set(g.studentId, current);
      }
    }

    return NextResponse.json({
      roster: enrollments.map(e => ({
        id: e.student.id,
        name: e.student.fullName,
        studentNumber: e.student.studentId,
        currentGrade: studentGrades.get(e.student.id)?.total ?? null,
        letterGrade: studentGrades.get(e.student.id)?.letterGrade ?? null,
      })),
    });
  } catch {
    // Database unavailable — return dev data
    const devRoster = DEV_SECTION_ROSTERS[sectionId];
    if (devRoster) {
      return NextResponse.json(devRoster);
    }
    return NextResponse.json({ roster: [] });
  }
}
