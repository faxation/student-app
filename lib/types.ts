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

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "charge" | "payment" | "scholarship";
  status: "completed" | "pending";
}

export interface FinanceSummary {
  totalTuition: number;
  totalPaid: number;
  balance: number;
  scholarshipAmount: number;
  nextPaymentDue: string;
  nextPaymentAmount: number;
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
