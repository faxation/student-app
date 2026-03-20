import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireStudent } from "@/lib/server/auth/guards";

export async function GET(
  _request: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  const { session, error } = await requireStudent();
  if (error) return error;
  const sp = session!.user.studentProfile!;
  const { sectionId } = params;

  // Verify enrollment
  const enrollment = await prisma.sectionEnrollment.findUnique({
    where: { studentId_sectionId: { studentId: sp.id, sectionId } },
  });
  if (!enrollment || enrollment.status === "WITHDRAWN") {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: {
      course: true,
      instructor: true,
      meetings: true,
      materials: {
        where: { status: "PUBLISHED", deletedAt: null },
        include: { files: { include: { file: true } } },
      },
      enrollments: {
        where: { status: { in: ["ENROLLED", "COMPLETED"] } },
        include: { student: true },
      },
    },
  });

  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  // Get student's grade attempts for this section
  const gradeAttempts = await prisma.gradeAttempt.findMany({
    where: { studentId: sp.id, sectionId, isPublished: true },
    include: { assignment: true, exam: true },
    orderBy: { createdAt: "asc" },
  });

  // Materials
  const materials = section.materials.map(m => ({
    id: m.id,
    category: m.materialType.toLowerCase().replace("_", " "),
    title: m.title,
    description: m.description,
    fileType: m.files[0]?.file.extension ?? "",
    date: m.publishedAt?.toISOString().split("T")[0],
  }));

  // Participants
  const participants = [
    {
      id: section.instructor.id,
      name: section.instructor.fullName,
      role: "Instructor" as const,
      email: section.instructor.email,
      initials: section.instructor.avatarInitials ?? section.instructor.fullName.split(" ").map(n => n[0]).join(""),
    },
    ...section.enrollments.map(e => ({
      id: e.student.id,
      name: e.student.fullName,
      role: "Student" as const,
      email: e.student.email,
      initials: e.student.avatarInitials ?? e.student.fullName.split(" ").map(n => n[0]).join(""),
    })),
  ];

  // Grades (only this student's published grades)
  const grades = gradeAttempts.map(g => ({
    id: g.id,
    title: g.assignment?.title ?? g.exam?.title ?? "",
    earnedScore: g.numericGrade ? Number(g.numericGrade) : 0,
    maxScore: 100,
    weight: g.assignment ? Number(g.assignment.weightPercent) : g.exam ? Number(g.exam.weightPercent) : 0,
  }));

  const totalGrade = grades.reduce((sum, g) => sum + (g.earnedScore * g.weight / 100), 0);
  const letterGrade = totalGrade >= 90 ? "A" : totalGrade >= 80 ? "B" : totalGrade >= 70 ? "C" : totalGrade >= 60 ? "D" : "F";

  return NextResponse.json({
    courseId: sectionId,
    courseName: section.course.name,
    courseCode: section.course.code,
    materials,
    participants,
    grades,
    totalGrade: Math.round(totalGrade * 100) / 100,
    letterGrade,
  });
}
