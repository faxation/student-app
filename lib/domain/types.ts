/**
 * Normalized app domain types.
 * The UI consumes ONLY these types — never raw Moodle types.
 * Each type has a `source` field to indicate data origin.
 */

export type DataSource = "moodle" | "mock" | "manual";

// ─── Student Profile ─────────────────────────────────────────────

export interface DomainStudentProfile {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
  source: DataSource;
}

// ─── Course ──────────────────────────────────────────────────────

export interface DomainCourse {
  id: string;
  title: string;
  shortCode: string;
  instructor: string;
  category: string;
  progress: number | null;
  link: string;
  lastAccess: string | null;
  source: DataSource;
}

// ─── Assignment ──────────────────────────────────────────────────

export interface DomainAssignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  dueDate: string;
  status: "pending" | "submitted" | "late" | "draft" | "unknown";
  description: string;
  link: string;
  source: DataSource;
}

// ─── Calendar Event ──────────────────────────────────────────────

export interface DomainCalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string | null;
  endTime: string | null;
  type: "class" | "assignment" | "exam" | "event" | "quiz" | "deadline";
  relatedCourseCode: string | null;
  relatedCourseName: string | null;
  link: string | null;
  source: DataSource;
}

// ─── Exam ────────────────────────────────────────────────────────

export interface DomainExam {
  id: string;
  title: string;
  courseName: string;
  courseCode: string;
  date: string;
  time: string;
  duration: string;
  locationOrFormat: string;
  type: "midterm" | "final" | "quiz" | "exam";
  source: DataSource;
  /** "high" if explicitly a quiz/exam module, "medium" if inferred from name */
  confidence: "high" | "medium" | "low";
}

// ─── Finance Record ──────────────────────────────────────────────

export interface DomainFinanceRecord {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "charge" | "payment" | "scholarship";
  status: "completed" | "pending";
  source: DataSource;
}

// ─── Announcement ────────────────────────────────────────────────

export interface DomainAnnouncement {
  id: string;
  title: string;
  body: string;
  courseName: string | null;
  publishedAt: string;
  link: string | null;
  source: DataSource;
}

// ─── Full Sync Payload ───────────────────────────────────────────

export interface MoodleSyncData {
  profile: DomainStudentProfile | null;
  courses: DomainCourse[];
  assignments: DomainAssignment[];
  calendarEvents: DomainCalendarEvent[];
  exams: DomainExam[];
  announcements: DomainAnnouncement[];
  syncedAt: string;
  errors: string[];
}
