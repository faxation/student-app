import { NextResponse } from "next/server";
import {
  getSessionToken,
  validateAndExtendSession,
} from "@/lib/server/auth/session";

export async function GET() {
  const token = getSessionToken();
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const session = await validateAndExtendSession(token);
  if (!session || session.user.role !== "INSTRUCTOR") {
    return NextResponse.json({ user: null });
  }

  const ip = session.user.instructorProfile;
  if (!ip) {
    return NextResponse.json({ user: null });
  }

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
