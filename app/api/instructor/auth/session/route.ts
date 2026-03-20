import { NextResponse } from "next/server";
import {
  getSessionToken,
  validateAndExtendSession,
} from "@/lib/server/auth/session";
import {
  getDevSession,
  formatDevInstructorResponse,
} from "@/lib/server/auth/dev-users";

export async function GET() {
  // Try database session first
  const token = getSessionToken();
  if (token) {
    try {
      const session = await validateAndExtendSession(token);
      if (session && session.user.role === "INSTRUCTOR") {
        const ip = session.user.instructorProfile;
        if (ip) {
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
    } catch {
      // Database unavailable — fall through to dev fallback
    }
  }

  // Dev fallback: check dev session cookie
  const devSession = getDevSession();
  if (devSession && devSession.role === "INSTRUCTOR" && devSession.instructorProfile) {
    return NextResponse.json(
      formatDevInstructorResponse({
        password: "",
        role: "INSTRUCTOR",
        userId: devSession.userId,
        instructorProfile: devSession.instructorProfile,
      })
    );
  }

  return NextResponse.json({ user: null });
}
