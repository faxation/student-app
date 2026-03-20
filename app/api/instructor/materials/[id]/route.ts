import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const material = await prisma.sectionMaterial.findUnique({
    where: { id: params.id },
    include: { section: true },
  });
  if (!material || material.section.instructorId !== ip.id || material.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  await prisma.sectionMaterial.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.materialType !== undefined && { materialType: body.materialType }),
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const material = await prisma.sectionMaterial.findUnique({
    where: { id: params.id },
    include: { section: true },
  });
  if (!material || material.section.instructorId !== ip.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.sectionMaterial.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
