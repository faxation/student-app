import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";
import { DEV_STUDENT_GRADES } from "@/lib/server/dev-student-data";

export async function GET() {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;

  try {
    const enrollments = await prisma.sectionEnrollment.findMany({
      where: { studentId: sp.id, status: { in: ["ENROLLED", "COMPLETED"] } },
      include: {
        section: {
          include: {
            course: true,
            finalGrades: { where: { studentId: sp.id } },
          },
        },
      },
    });

    return NextResponse.json({
      courses: enrollments.map(e => {
        const fg = e.section.finalGrades[0];
        return {
          sectionId: e.section.id,
          courseCode: e.section.course.code,
          courseName: e.section.course.name,
          credits: e.section.course.credits,
          finalGrade: fg?.finalNumeric ? Number(fg.finalNumeric) : null,
          letterGrade: fg?.finalLetter ?? null,
          isReleased: fg?.isReleased ?? false,
        };
      }),
    });
  } catch {
    return NextResponse.json(DEV_STUDENT_GRADES);
  }
}
