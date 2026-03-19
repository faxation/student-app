export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  major: string;
  year: string;
  semester: string;
  gpa: number;
  avatarInitials: string;
  faculty?: string;
  program?: string;
  advisor?: string;
  creditsCompleted?: number;
  creditsRequired?: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  category: "academic" | "administrative" | "event";
}

export interface ClassSession {
  id: string;
  courseName: string;
  courseCode: string;
  instructor: string;
  time: string;
  endTime: string;
  room: string;
  day: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string;
  status: "pending" | "submitted" | "late";
  description: string;
}

export interface Exam {
  id: string;
  courseName: string;
  courseCode: string;
  date: string;
  time: string;
  duration: string;
  room: string;
  format: "in-person" | "online";
  type: "midterm" | "final" | "quiz";
}

export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  schedule: string;
  room: string;
  attendance: {
    present: number;
    absent: number;
    total: number;
  };
  latestActivity: string;
}

export interface AttendanceRecord {
  courseCode: string;
  courseName: string;
  section: string;
  present: number;
  excusedAbsences: number;
  unexcusedAbsences: number;
  excusedTardiness: number;
  unexcusedTardiness: number;
  totalSessions: number;
}

export interface LBPSemesterFee {
  semester: string;
  chargesFees: number;
  coursesTuition: number;
  oldBalance: number;
  oldBalanceConverted: number;
  lbpCollection: number;
  sponsorCollection: number;
  scholarshipAmount: number;
  adminDiscount: number;
  remainingAmount: number;
}

export interface USDSemesterFee {
  semester: string;
  chargesFees: number;
  usdTuition: number;
  usdCollection: number;
  usdSponsors: number;
  scholarship: number;
  remainingAmount: number;
}

export interface FinanceSummary {
  totalLbpRemaining: number;
  totalUsdRemaining: number;
  lbpFees: LBPSemesterFee[];
  usdFees: USDSemesterFee[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: "class" | "assignment" | "exam" | "event";
  courseCode?: string;
}

export interface QuickStat {
  label: string;
  value: string | number;
  change?: string;
  icon: string;
}

// ─── Course Detail Types ────────────────────────────────────────
export interface CourseMaterial {
  id: string;
  category: "syllabus" | "chapter" | "slides" | "assignment" | "reading" | "notes";
  title: string;
  description?: string;
  fileType?: string;
  date?: string;
}

export interface CourseParticipant {
  id: string;
  name: string;
  role: "Instructor" | "Student";
  email: string;
  initials: string;
}

export interface GradeItem {
  id: string;
  title: string;
  earnedScore: number;
  maxScore: number;
  weight: number;
}

export interface CourseDetail {
  courseId: string;
  materials: CourseMaterial[];
  participants: CourseParticipant[];
  grades: GradeItem[];
  totalGrade: number;
  letterGrade: string;
}
