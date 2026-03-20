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
  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json({ user: null });
  }

  const sp = session.user.studentProfile;
  if (!sp) {
    return NextResponse.json({ user: null });
  }

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
