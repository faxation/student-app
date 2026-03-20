import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";

export async function GET() {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const files = await prisma.instructorFileLibrary.findMany({
    where: { instructorId: ip.id },
    include: { file: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    files: files.map(f => ({
      id: f.file.id,
      name: f.file.originalName,
      type: f.file.extension,
      size: f.file.sizeBytes,
      label: f.label,
      uploadedAt: f.file.createdAt.toISOString(),
    })),
  });
}
