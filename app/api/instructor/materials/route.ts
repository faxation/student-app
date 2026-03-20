import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";

export async function GET() {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const sections = await prisma.section.findMany({
    where: { instructorId: ip.id },
    select: { id: true },
  });
  const sectionIds = sections.map(s => s.id);

  const materials = await prisma.sectionMaterial.findMany({
    where: { sectionId: { in: sectionIds }, deletedAt: null },
    include: { section: { include: { course: true } }, files: { include: { file: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    materials: materials.map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      materialType: m.materialType,
      status: m.status,
      sectionId: m.sectionId,
      courseCode: m.section.course.code,
      files: m.files.map(f => ({ id: f.file.id, name: f.file.originalName })),
    })),
  });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const body = await request.json();
  const { sectionId, title, description, materialType } = body;

  if (!sectionId || !title || !materialType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const section = await prisma.section.findUnique({ where: { id: sectionId } });
  if (!section || section.instructorId !== ip.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const material = await prisma.sectionMaterial.create({
    data: { sectionId, title, description, materialType, status: "DRAFT" },
  });

  return NextResponse.json({ id: material.id }, { status: 201 });
}
