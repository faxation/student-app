import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { recomputeAttendanceSummary } from "@/lib/server/services/attendance";

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { session: authSession, error } = await requireInstructor();
  if (error) return error;
  const ip = authSession!.user.instructorProfile!;

  const attendanceSession = await prisma.attendanceSession.findUnique({
    where: { id: params.sessionId },
    include: { section: true },
  });

  if (!attendanceSession || attendanceSession.section.instructorId !== ip.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { records } = await request.json();
  if (!Array.isArray(records)) {
    return NextResponse.json({ error: "records array required" }, { status: 400 });
  }

  for (const r of records) {
    await prisma.attendanceRecord.upsert({
      where: {
        sessionId_studentId: { sessionId: params.sessionId, studentId: r.studentId },
      },
      create: {
        sessionId: params.sessionId,
        studentId: r.studentId,
        value: r.value,
      },
      update: { value: r.value },
    });

    // Recompute summary (handles AW logic)
    await recomputeAttendanceSummary(
      r.studentId,
      attendanceSession.sectionId,
      authSession!.user.id
    );
  }

  return NextResponse.json({ success: true });
}
