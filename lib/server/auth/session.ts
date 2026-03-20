import { prisma } from "@/lib/server/db";
import { cookies } from "next/headers";

const SESSION_COOKIE = "session_token";
const SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: { token, userId, expiresAt },
  });

  return token;
}

export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300, // 5 minutes in seconds
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function getSessionToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function validateAndExtendSession(token: string) {
  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: {
        include: {
          studentProfile: {
            include: { faculty: true, program: true },
          },
          instructorProfile: true,
        },
      },
    },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  // Slide the expiry window
  await prisma.session.update({
    where: { id: session.id },
    data: { expiresAt: new Date(Date.now() + SESSION_TTL_MS) },
  });

  // Also refresh the cookie max-age
  setSessionCookie(token);

  return session;
}

export async function destroySession(token: string) {
  await prisma.session.deleteMany({ where: { token } });
  clearSessionCookie();
}

/** Clean up expired sessions (call periodically or on login) */
export async function purgeExpiredSessions() {
  await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}
