import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { recomputeAttendanceSummary } from "@/lib/server/services/attendance";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const record = await prisma.attendanceRecord.findUnique({
    where: { id: params.id },
    include: { session: { include: { section: true } } },
  });

  if (!record || record.session.section.instructorId !== ip.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { value } = await request.json();
  if (!value || !["PRESENT", "ABSENT"].includes(value)) {
    return NextResponse.json({ error: "Invalid value" }, { status: 400 });
  }

  await prisma.attendanceRecord.update({
    where: { id: params.id },
    data: { value },
  });

  await recomputeAttendanceSummary(
    record.studentId,
    record.session.sectionId,
    session!.user.id
  );

  return NextResponse.json({ success: true });
}
