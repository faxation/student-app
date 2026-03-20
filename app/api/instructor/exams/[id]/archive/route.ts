import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { createAuditLog } from "@/lib/server/services/audit";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const exam = await prisma.exam.findUnique({ where: { id: params.id } });
  if (!exam || exam.createdById !== ip.id || exam.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.exam.update({
    where: { id: params.id },
    data: { status: "ARCHIVED", deletedAt: new Date() },
  });

  await createAuditLog({
    actorId: session!.user.id,
    entityType: "Exam",
    entityId: params.id,
    action: "ARCHIVE",
  });

  return NextResponse.json({ success: true });
}
