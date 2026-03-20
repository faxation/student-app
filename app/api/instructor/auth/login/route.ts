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
  formatDevInstructorResponse,
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
        include: { instructorProfile: true },
      });

      if (user && user.isActive && !user.deletedAt && user.role === "INSTRUCTOR") {
        const valid = await verifyPassword(password, user.passwordHash);
        if (valid) {
          purgeExpiredSessions().catch(() => {});
          const token = await createSession(user.id);
          setSessionCookie(token);

          const ip = user.instructorProfile!;
          const names = ip.fullName.split(" ");

          return NextResponse.json({
            user: {
              id: ip.id,
              firstName: names[0] ?? "",
              lastName: names.slice(1).join(" "),
              email: ip.email,
              instructorId: ip.id,
              department: ip.department ?? "",
              title: ip.teachingRoleLabel ?? "Instructor",
              avatarInitials: ip.avatarInitials ?? "",
            },
          });
        }
      }

      // DB available but credentials invalid
      if (user !== undefined) {
        return NextResponse.json(
          { error: "Invalid username or password" },
          { status: 401 }
        );
      }
    } catch {
      // Database unavailable — fall through to dev fallback
    }

    // Dev fallback: check hardcoded credentials
    const devUser = verifyDevCredentials(username, password, "INSTRUCTOR");
    if (!devUser) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    setDevSessionCookie(devUser);
    return NextResponse.json(formatDevInstructorResponse(devUser));
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
