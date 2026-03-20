import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";
import { verifyPassword } from "@/lib/server/auth/password";
import {
  createSession,
  setSessionCookie,
  purgeExpiredSessions,
} from "@/lib/server/auth/session";
import {
  verifyDevCredentials,
  setDevSessionCookie,
  formatDevStudentResponse,
} from "@/lib/server/auth/dev-users";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Try database auth first
    try {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          studentProfile: {
            include: { faculty: true, program: true, admissionTerm: true },
          },
        },
      });

      if (user && user.isActive && !user.deletedAt && user.role === "STUDENT") {
        const valid = await verifyPassword(password, user.passwordHash);
        if (valid) {
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
              semester: "Spring 2026",
              gpa: sp.gpa ? Number(sp.gpa) : 0,
              avatarInitials: sp.avatarInitials ?? "",
              faculty: sp.faculty?.name,
              program: sp.program?.name,
              advisor: "Dr. Khalil Assaf",
              creditsCompleted: sp.creditsCompleted,
              creditsRequired: sp.creditsRequired,
            },
          });
        }
      }

      // DB available but credentials invalid
      if (user !== undefined) {
        return NextResponse.json(
          { error: "Invalid student ID or password" },
          { status: 401 }
        );
      }
    } catch {
      // Database unavailable — fall through to dev fallback
    }

    // Dev fallback: check hardcoded credentials
    const devUser = verifyDevCredentials(username, password, "STUDENT");
    if (!devUser) {
      return NextResponse.json(
        { error: "Invalid student ID or password" },
        { status: 401 }
      );
    }

    setDevSessionCookie(devUser);
    return NextResponse.json(formatDevStudentResponse(devUser));
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
