import { NextResponse } from "next/server";
import {
  getSessionToken,
  validateAndExtendSession,
} from "./session";
import { getDevSession } from "./dev-users";

type SessionWithUser = NonNullable<
  Awaited<ReturnType<typeof validateAndExtendSession>>
>;

interface AuthResult {
  session: SessionWithUser | null;
  error: NextResponse | null;
}

export async function getAuthenticatedUser(): Promise<AuthResult> {
  // Try database session first
  const token = getSessionToken();
  if (token) {
    try {
      const session = await validateAndExtendSession(token);
      if (session) {
        return { session, error: null };
      }
    } catch {
      // Database unavailable — fall through to dev fallback
    }
  }

  // Dev fallback: check dev session cookie
  const devSession = getDevSession();
  if (devSession) {
    // Construct a session-like object matching the shape API routes expect
    const mockSession = {
      id: "dev-session",
      token: "dev-token",
      userId: devSession.userId,
      expiresAt: new Date(Date.now() + 86400000),
      createdAt: new Date(),
      user: {
        id: devSession.userId,
        email: devSession.studentProfile?.email ?? devSession.instructorProfile?.email ?? "",
        username: "",
        passwordHash: "",
        role: devSession.role as "STUDENT" | "INSTRUCTOR" | "ADMIN",
        isActive: true,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        fullName: devSession.studentProfile?.fullName ?? devSession.instructorProfile?.fullName ?? "",
        avatarInitials: devSession.studentProfile?.avatarInitials ?? devSession.instructorProfile?.avatarInitials ?? "",
        studentProfile: devSession.studentProfile
          ? {
              id: devSession.studentProfile.id,
              userId: devSession.userId,
              studentId: devSession.studentProfile.studentId,
              fullName: devSession.studentProfile.fullName,
              email: devSession.studentProfile.email,
              phone: null,
              facultyId: null,
              programId: null,
              admissionTermId: null,
              gpa: devSession.studentProfile.gpa,
              creditsCompleted: devSession.studentProfile.creditsCompleted,
              creditsRequired: devSession.studentProfile.creditsRequired,
              avatarInitials: devSession.studentProfile.avatarInitials,
              createdAt: new Date(),
              updatedAt: new Date(),
              faculty: devSession.studentProfile.faculty ? { id: "dev-faculty", code: "ECON", name: devSession.studentProfile.faculty.name, createdAt: new Date(), updatedAt: new Date() } : null,
              program: devSession.studentProfile.program ? { id: "dev-program", code: "BAF", name: devSession.studentProfile.program.name, facultyId: "dev-faculty", requiredCredits: devSession.studentProfile.creditsRequired, createdAt: new Date(), updatedAt: new Date() } : null,
            }
          : null,
        instructorProfile: devSession.instructorProfile
          ? {
              id: devSession.instructorProfile.id,
              userId: devSession.userId,
              fullName: devSession.instructorProfile.fullName,
              email: devSession.instructorProfile.email,
              phone: null,
              department: devSession.instructorProfile.department,
              teachingRoleLabel: devSession.instructorProfile.teachingRoleLabel,
              avatarInitials: devSession.instructorProfile.avatarInitials,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          : null,
      },
    } as unknown as SessionWithUser;

    return { session: mockSession, error: null };
  }

  return {
    session: null,
    error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
  };
}

export async function requireRole(
  ...roles: string[]
): Promise<AuthResult> {
  const result = await getAuthenticatedUser();
  if (result.error) return result;

  if (!roles.includes(result.session!.user.role)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return result;
}

export async function requireStudent(): Promise<AuthResult> {
  return requireRole("STUDENT");
}

export async function requireInstructor(): Promise<AuthResult> {
  return requireRole("INSTRUCTOR");
}
