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

  const records = await prisma.attendanceRecord.findMany({
    where: {
      studentId: sp.id,
      session: { sectionId: params.sectionId },
    },
    include: { session: true },
    orderBy: { session: { sessionDate: "asc" } },
  });

  const summary = await prisma.attendanceSummary.findUnique({
    where: { studentId_sectionId: { studentId: sp.id, sectionId: params.sectionId } },
  });

  return NextResponse.json({
    records: records.map(r => ({
      id: r.id,
      date: r.session.sessionDate.toISOString().split("T")[0],
      value: r.value,
    })),
    summary: summary ? {
      presentCount: summary.presentCount,
      absentCount: summary.absentCount,
      warningLevel: summary.warningLevel,
      isAW: summary.isAcademicallyWithdrawn,
    } : null,
  });
}
