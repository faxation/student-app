import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";
import { storage } from "@/lib/server/storage";

export async function POST(request: NextRequest) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const formData = await request.formData();
  const file = formData.get("file") as globalThis.File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const storageKey = `${ip.id}/${Date.now()}-${file.name}`;

  await storage.upload(storageKey, buffer, file.type);

  const dbFile = await prisma.file.create({
    data: {
      storageKey,
      originalName: file.name,
      mimeType: file.type,
      extension: ext,
      sizeBytes: buffer.length,
      uploadedById: session!.user.id,
    },
  });

  // Add to instructor file library
  await prisma.instructorFileLibrary.create({
    data: {
      instructorId: ip.id,
      fileId: dbFile.id,
      label: file.name,
    },
  });

  return NextResponse.json({
    id: dbFile.id,
    name: dbFile.originalName,
    type: dbFile.extension,
    size: dbFile.sizeBytes,
  }, { status: 201 });
}
