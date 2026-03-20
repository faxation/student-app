import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { requireInstructor } from "@/lib/server/auth/guards";

export async function GET() {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const announcements = await prisma.announcement.findMany({
    where: { createdById: ip.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    announcements: announcements.map(a => ({
      id: a.id,
      title: a.title,
      body: a.body,
      scope: a.scope,
      status: a.status,
      publishedAt: a.publishedAt?.toISOString() ?? null,
      createdAt: a.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireInstructor();
  if (error) return error;
  const ip = session!.user.instructorProfile!;

  const body = await request.json();
  const { title, body: content, scope, sectionId, courseCode } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and body required" }, { status: 400 });
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      body: content,
      scope: scope ?? "GLOBAL",
      sectionId,
      courseCode,
      createdById: ip.id,
      status: "DRAFT",
    },
  });

  return NextResponse.json({ id: announcement.id }, { status: 201 });
}
