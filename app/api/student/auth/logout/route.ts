import { NextResponse } from "next/server";
import { getSessionToken, destroySession } from "@/lib/server/auth/session";

export async function POST() {
  const token = getSessionToken();
  if (token) {
    await destroySession(token);
  }
  return NextResponse.json({ success: true });
}
