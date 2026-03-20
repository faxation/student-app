import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { validateTotalWeight } from "@/lib/server/services/grades";
import { createAuditLog } from "@/lib/server/services/audit";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: { course: true, sections: { include: { section: true } }, files: { include: { file: true } } },
  });

  if (!exam || exam.createdById !== ip.id || exam.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ exam });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const existing = await prisma.exam.findUnique({
    where: { id: params.id },
    include: { sections: true },
  });
  if (!existing || existing.createdById !== ip.id || existing.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();

  if (body.weightPercent !== undefined && body.weightPercent !== Number(existing.weightPercent)) {
    for (const es of existing.sections) {
      const { valid } = await validateTotalWeight({
        courseId: existing.courseId,
        sectionId: es.sectionId,
        excludeExamId: existing.id,
        newWeight: body.weightPercent,
      });
      if (!valid) {
        return NextResponse.json({ error: "Total weight would exceed 90%" }, { status: 400 });
      }
    }
  }

  await prisma.exam.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.examDate !== undefined && { examDate: body.examDate ? new Date(body.examDate) : null }),
      ...(body.startTime !== undefined && { startTime: body.startTime }),
      ...(body.endTime !== undefined && { endTime: body.endTime }),
      ...(body.room !== undefined && { room: body.room }),
      ...(body.weightPercent !== undefined && { weightPercent: body.weightPercent }),
      ...(body.instructionsText !== undefined && { instructionsText: body.instructionsText }),
      ...(body.chaptersCovered !== undefined && { chaptersCovered: body.chaptersCovered }),
    },
  });

  await createAuditLog({
    actorId: session!.user.id,
    entityType: "Exam",
    entityId: params.id,
    action: "UPDATE",
    oldValues: { title: existing.title },
    newValues: body,
  });

  return NextResponse.json({ success: true });
}
