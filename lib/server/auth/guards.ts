import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import {
  getSessionToken,
  validateAndExtendSession,
} from "./session";

type SessionWithUser = NonNullable<
  Awaited<ReturnType<typeof validateAndExtendSession>>
>;

interface AuthResult {
  session: SessionWithUser | null;
  error: NextResponse | null;
}

export async function getAuthenticatedUser(): Promise<AuthResult> {
  const token = getSessionToken();
  if (!token) {
    return {
      session: null,
      error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }

  const session = await validateAndExtendSession(token);
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Session expired" }, { status: 401 }),
    };
  }

  return { session, error: null };
}

export async function requireRole(
  ...roles: UserRole[]
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
  return requireRole(UserRole.STUDENT);
}

export async function requireInstructor(): Promise<AuthResult> {
  return requireRole(UserRole.INSTRUCTOR);
}
