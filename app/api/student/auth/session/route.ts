import { NextResponse } from "next/server";
import {
  getSessionToken,
  validateAndExtendSession,
} from "@/lib/server/auth/session";
import {
  getDevSession,
  formatDevStudentResponse,
} from "@/lib/server/auth/dev-users";

export async function GET() {
  // Try database session first
  const token = getSessionToken();
  if (token) {
    try {
      const session = await validateAndExtendSession(token);
      if (session && session.user.role === "STUDENT") {
        const sp = session.user.studentProfile;
        if (sp) {
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
    } catch {
      // Database unavailable — fall through to dev fallback
    }
  }

  // Dev fallback: check dev session cookie
  const devSession = getDevSession();
  if (devSession && devSession.role === "STUDENT" && devSession.studentProfile) {
    return NextResponse.json(
      formatDevStudentResponse({
        password: "",
        role: "STUDENT",
        userId: devSession.userId,
        studentProfile: devSession.studentProfile,
      })
    );
  }

  return NextResponse.json({ user: null });
}
