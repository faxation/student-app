import { NextResponse } from "next/server";
import { getSessionToken, destroySession } from "@/lib/server/auth/session";
import { clearDevSessionCookie } from "@/lib/server/auth/dev-users";

export async function POST() {
  const token = getSessionToken();
  if (token) {
    try {
      await destroySession(token);
    } catch {
      // Database unavailable — just clear cookies
    }
  }
  clearDevSessionCookie();
  return NextResponse.json({ success: true });
}
