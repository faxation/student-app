/**
 * Dev-mode fallback credentials and session helpers.
 * Used when no PostgreSQL database is available.
 * When a real database is configured, these are never reached.
 */
import { cookies } from "next/headers";

const DEV_COOKIE = "dev_session";
const DEV_MAX_AGE = 86400; // 24 hours

// ─── Dev Credential Definitions ───────────────────────────────

interface DevStudentProfile {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  gpa: number;
  creditsCompleted: number;
  creditsRequired: number;
  avatarInitials: string;
  faculty: { name: string };
  program: { name: string };
}

interface DevInstructorProfile {
  id: string;
  fullName: string;
  email: string;
  department: string;
  teachingRoleLabel: string;
  avatarInitials: string;
}

interface DevUser {
  password: string;
  role: "STUDENT" | "INSTRUCTOR";
  userId: string;
  studentProfile?: DevStudentProfile;
  instructorProfile?: DevInstructorProfile;
}

const DEV_USERS: Record<string, DevUser> = {
  "202300189": {
    password: "std175593",
    role: "STUDENT",
    userId: "dev-student-user-001",
    studentProfile: {
      id: "dev-student-profile-001",
      studentId: "202300189",
      fullName: "Farid Sleimen Rahme",
      email: "farid.sleimenrahme@students.uls.edu.lb",
      gpa: 2.87,
      creditsCompleted: 69,
      creditsRequired: 96,
      avatarInitials: "FS",
      faculty: { name: "Economics & Bus. Adm" },
      program: { name: "BAF/General Business" },
    },
  },
  Adam: {
    password: "Act3and4",
    role: "INSTRUCTOR",
    userId: "dev-instructor-user-001",
    instructorProfile: {
      id: "dev-instructor-profile-001",
      fullName: "Adam Mitchell",
      email: "adam.mitchell@uls.edu",
      department: "Computer Science",
      teachingRoleLabel: "Associate Professor",
      avatarInitials: "AM",
    },
  },
};

// ─── Credential Verification ──────────────────────────────────

export function verifyDevCredentials(
  username: string,
  password: string,
  requiredRole: "STUDENT" | "INSTRUCTOR"
): DevUser | null {
  const entry = DEV_USERS[username];
  if (!entry) return null;
  if (entry.password !== password) return null;
  if (entry.role !== requiredRole) return null;
  return entry;
}

// ─── Dev Session Cookie ───────────────────────────────────────

interface DevSessionPayload {
  role: "STUDENT" | "INSTRUCTOR";
  userId: string;
  studentProfile?: DevStudentProfile;
  instructorProfile?: DevInstructorProfile;
}

export function setDevSessionCookie(user: DevUser): void {
  const payload: DevSessionPayload = {
    role: user.role,
    userId: user.userId,
    studentProfile: user.studentProfile,
    instructorProfile: user.instructorProfile,
  };
  const cookieStore = cookies();
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64");
  cookieStore.set(DEV_COOKIE, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DEV_MAX_AGE,
  });
}

export function getDevSession(): DevSessionPayload | null {
  try {
    const cookieStore = cookies();
    const value = cookieStore.get(DEV_COOKIE)?.value;
    if (!value) return null;
    return JSON.parse(Buffer.from(value, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

export function clearDevSessionCookie(): void {
  try {
    const cookieStore = cookies();
    cookieStore.delete(DEV_COOKIE);
  } catch {
    // ignore
  }
}

// ─── Response Formatters ──────────────────────────────────────

export function formatDevStudentResponse(user: DevUser) {
  const sp = user.studentProfile!;
  const names = sp.fullName.split(" ");
  return {
    user: {
      id: sp.id,
      firstName: names[0] ?? "",
      lastName: names.slice(1).join(" "),
      email: sp.email,
      studentId: sp.studentId,
      major: sp.program?.name ?? "",
      year: "Junior",
      semester: "Spring 2026",
      gpa: sp.gpa,
      avatarInitials: sp.avatarInitials,
      faculty: sp.faculty?.name,
      program: sp.program?.name,
      advisor: "Dr. Khalil Assaf",
      creditsCompleted: sp.creditsCompleted,
      creditsRequired: sp.creditsRequired,
    },
  };
}

export function formatDevInstructorResponse(user: DevUser) {
  const ip = user.instructorProfile!;
  const names = ip.fullName.split(" ");
  return {
    user: {
      id: ip.id,
      firstName: names[0] ?? "",
      lastName: names.slice(1).join(" "),
      email: ip.email,
      instructorId: ip.id,
      department: ip.department,
      title: ip.teachingRoleLabel,
      avatarInitials: ip.avatarInitials,
    },
  };
}
