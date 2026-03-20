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

  const assignment = await prisma.assignment.findUnique({
    where: { id: params.id },
    include: {
      course: true,
      sections: { include: { section: true } },
      files: { include: { file: true } },
    },
  });

  if (!assignment || assignment.createdById !== ip.id || assignment.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ assignment });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const existing = await prisma.assignment.findUnique({
    where: { id: params.id },
    include: { sections: true },
  });
  if (!existing || existing.createdById !== ip.id || existing.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const { title, dueAt, weightPercent, instructionsText, relatedChapter } = body;

  // If weight changed, validate
  if (weightPercent !== undefined && weightPercent !== Number(existing.weightPercent)) {
    for (const as of existing.sections) {
      const { valid } = await validateTotalWeight({
        courseId: existing.courseId,
        sectionId: as.sectionId,
        excludeAssignmentId: existing.id,
        newWeight: weightPercent,
      });
      if (!valid) {
        return NextResponse.json({ error: "Total weight would exceed 90%" }, { status: 400 });
      }
    }
  }

  const oldValues = { title: existing.title, weightPercent: Number(existing.weightPercent) };

  const updated = await prisma.assignment.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(dueAt !== undefined && { dueAt: dueAt ? new Date(dueAt) : null }),
      ...(weightPercent !== undefined && { weightPercent }),
      ...(instructionsText !== undefined && { instructionsText }),
      ...(relatedChapter !== undefined && { relatedChapter }),
    },
  });

  await createAuditLog({
    actorId: session!.user.id,
    entityType: "Assignment",
    entityId: updated.id,
    action: "UPDATE",
    oldValues,
    newValues: body,
  });

  return NextResponse.json({ success: true });
}
