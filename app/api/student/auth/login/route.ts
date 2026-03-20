import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { verifyPassword } from "@/lib/server/auth/password";
import {
  createSession,
  setSessionCookie,
  purgeExpiredSessions,
} from "@/lib/server/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        studentProfile: {
          include: { faculty: true, program: true, admissionTerm: true },
        },
      },
    });

    if (!user || !user.isActive || user.deletedAt) {
      return NextResponse.json(
        { error: "Invalid student ID or password" },
        { status: 401 }
      );
    }

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Invalid student ID or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid student ID or password" },
        { status: 401 }
      );
    }

    // Purge old sessions in background
    purgeExpiredSessions().catch(() => {});

    const token = await createSession(user.id);
    setSessionCookie(token);

    const sp = user.studentProfile!;
    const names = sp.fullName.split(" ");

    return NextResponse.json({
      user: {
        id: sp.id,
        firstName: names[0] ?? "",
        lastName: names.slice(1).join(" "),
        email: sp.email,
        studentId: sp.studentId,
        major: sp.program?.name ?? "",
        year: "Junior",
        semester: sp.admissionTerm
          ? "Spring 2026"
          : "Spring 2026",
        gpa: sp.gpa ? Number(sp.gpa) : 0,
        avatarInitials: sp.avatarInitials ?? "",
        faculty: sp.faculty?.name,
        program: sp.program?.name,
        advisor: "Dr. Khalil Assaf",
        creditsCompleted: sp.creditsCompleted,
        creditsRequired: sp.creditsRequired,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
