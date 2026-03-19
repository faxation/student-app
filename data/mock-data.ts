import type {
  StudentProfile,
  Announcement,
  ClassSession,
  Assignment,
  Exam,
  Course,
  FinanceSummary,
  CalendarEvent,
  AttendanceRecord,
  CourseDetail,
} from "@/lib/types";

// ─── Student Profile ────────────────────────────────────────────
export const studentProfile: StudentProfile = {
  id: "1",
  firstName: "Farid",
  lastName: "Sleimen Rahme",
  email: "farid.sleimenrahme@students.uls.edu.lb",
  studentId: "202300189",
  major: "BAF/General Business",
  year: "Junior",
  semester: "Spring 2026",
  gpa: 2.87,
  avatarInitials: "FS",
  faculty: "Economics & Bus. Adm",
  program: "Undergraduate Bachelor BAF/General Business",
  advisor: "GHAWI Chady",
  creditsCompleted: 69,
  creditsRequired: 96,
};

// ─── Demo Credentials ───────────────────────────────────────────
export const DEMO_CREDENTIALS = {
  username: "202300189",
  password: "std175593",
} as const;

// ─── Announcements ──────────────────────────────────────────────
export const announcements: Announcement[] = [
  {
    id: "a1",
    title: "Spring 2026 Registration Open",
    body: "Course registration for the Spring 2026 semester is now open. Please consult your academic advisor before registering.",
    date: "2026-03-18",
    category: "academic",
  },
  {
    id: "a2",
    title: "Library Extended Hours",
    body: "The university library will operate extended hours during midterm week: 7:00 AM – 11:00 PM.",
    date: "2026-03-17",
    category: "administrative",
  },
  {
    id: "a3",
    title: "Career Fair – March 28",
    body: "Join us at the annual Career Fair in the Main Auditorium. Over 40 companies will be present.",
    date: "2026-03-15",
    category: "event",
  },
  {
    id: "a4",
    title: "Midterm Grade Submission Deadline",
    body: "Faculty must submit midterm grades by March 25. Students can view grades in the portal starting March 27.",
    date: "2026-03-14",
    category: "academic",
  },
];

// ─── Weekly Schedule ────────────────────────────────────────────
export const weeklySchedule: Record<string, ClassSession[]> = {
  Monday: [
    {
      id: "ws-mon-1",
      courseName: "Oral Communication",
      courseCode: "COM 206",
      instructor: "TBD",
      time: "11:00",
      endTime: "12:00",
      room: "TBD",
      day: "Monday",
    },
    {
      id: "ws-mon-2",
      courseName: "Financial Analysis",
      courseCode: "FIN 330",
      instructor: "TBD",
      time: "12:00",
      endTime: "13:00",
      room: "TBD",
      day: "Monday",
    },
    {
      id: "ws-mon-3",
      courseName: "Procurement & Inventory Management",
      courseCode: "SCM 400",
      instructor: "TBD",
      time: "16:00",
      endTime: "17:00",
      room: "TBD",
      day: "Monday",
    },
  ],
  Tuesday: [
    {
      id: "ws-tue-1",
      courseName: "Money & Banking",
      courseCode: "FIN 420",
      instructor: "TBD",
      time: "16:00",
      endTime: "17:00",
      room: "TBD",
      day: "Tuesday",
    },
  ],
  Wednesday: [
    {
      id: "ws-wed-1",
      courseName: "Oral Communication",
      courseCode: "COM 206",
      instructor: "TBD",
      time: "11:00",
      endTime: "12:00",
      room: "TBD",
      day: "Wednesday",
    },
    {
      id: "ws-wed-2",
      courseName: "Financial Analysis",
      courseCode: "FIN 330",
      instructor: "TBD",
      time: "12:00",
      endTime: "13:00",
      room: "TBD",
      day: "Wednesday",
    },
    {
      id: "ws-wed-3",
      courseName: "Procurement & Inventory Management",
      courseCode: "SCM 400",
      instructor: "TBD",
      time: "16:00",
      endTime: "17:00",
      room: "TBD",
      day: "Wednesday",
    },
  ],
  Thursday: [
    {
      id: "ws-thu-1",
      courseName: "Money & Banking",
      courseCode: "FIN 420",
      instructor: "TBD",
      time: "16:00",
      endTime: "17:00",
      room: "TBD",
      day: "Thursday",
    },
  ],
  Friday: [
    {
      id: "ws-fri-1",
      courseName: "Managerial Accounting",
      courseCode: "ACT 320",
      instructor: "TBD",
      time: "17:00",
      endTime: "18:00",
      room: "TBD",
      day: "Friday",
    },
  ],
  Saturday: [],
  Sunday: [],
};

// ─── Today's Classes (dynamic) ──────────────────────────────────
function getTodayDayName(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
}

export const todayClasses: ClassSession[] = weeklySchedule[getTodayDayName()] ?? [];

// ─── Assignments ────────────────────────────────────────────────
export const assignments: Assignment[] = [
  {
    id: "as1",
    title: "Variance Analysis Report",
    courseCode: "ACT 320",
    courseName: "Managerial Accounting",
    dueDate: "2026-03-24",
    status: "pending",
    description: "Prepare a variance analysis report comparing budgeted vs. actual costs for the given case study.",
  },
  {
    id: "as2",
    title: "Persuasive Speech Outline",
    courseCode: "COM 206",
    courseName: "Oral Communication",
    dueDate: "2026-03-22",
    status: "submitted",
    description: "Submit the outline and supporting materials for your persuasive speech presentation.",
  },
  {
    id: "as3",
    title: "Financial Statement Analysis",
    courseCode: "FIN 330",
    courseName: "Financial Analysis",
    dueDate: "2026-03-26",
    status: "pending",
    description: "Analyze the financial statements of a publicly traded company using ratio analysis techniques.",
  },
  {
    id: "as4",
    title: "Central Bank Policy Case Study",
    courseCode: "FIN 420",
    courseName: "Money & Banking",
    dueDate: "2026-03-20",
    status: "late",
    description: "Write a case study analyzing a central bank's monetary policy decision and its economic impact.",
  },
  {
    id: "as5",
    title: "Supplier Evaluation Matrix",
    courseCode: "SCM 400",
    courseName: "Procurement & Inventory Management",
    dueDate: "2026-03-28",
    status: "pending",
    description: "Develop a supplier evaluation matrix using weighted scoring for the provided procurement scenario.",
  },
  {
    id: "as6",
    title: "Group Debate Preparation",
    courseCode: "COM 206",
    courseName: "Oral Communication",
    dueDate: "2026-04-02",
    status: "pending",
    description: "Prepare arguments and counterarguments for the upcoming group debate on business ethics.",
  },
];

// ─── Exams ──────────────────────────────────────────────────────
export const exams: Exam[] = [
  {
    id: "e1",
    courseName: "Managerial Accounting",
    courseCode: "ACT 320",
    date: "2026-03-25",
    time: "17:00 – 19:00",
    duration: "2 hours",
    room: "Exam Hall A",
    format: "in-person",
    type: "midterm",
  },
  {
    id: "e2",
    courseName: "Oral Communication",
    courseCode: "COM 206",
    date: "2026-03-27",
    time: "11:00 – 12:30",
    duration: "1.5 hours",
    room: "Exam Hall B",
    format: "in-person",
    type: "midterm",
  },
  {
    id: "e3",
    courseName: "Financial Analysis",
    courseCode: "FIN 330",
    date: "2026-03-26",
    time: "12:00 – 14:00",
    duration: "2 hours",
    room: "Exam Hall A",
    format: "in-person",
    type: "midterm",
  },
  {
    id: "e4",
    courseName: "Money & Banking",
    courseCode: "FIN 420",
    date: "2026-04-01",
    time: "16:00 – 18:00",
    duration: "2 hours",
    room: "Exam Hall B",
    format: "in-person",
    type: "midterm",
  },
  {
    id: "e5",
    courseName: "Procurement & Inventory Management",
    courseCode: "SCM 400",
    date: "2026-04-03",
    time: "16:00 – 18:00",
    duration: "2 hours",
    room: "Exam Hall A",
    format: "in-person",
    type: "midterm",
  },
];

// ─── Courses ────────────────────────────────────────────────────
export const courses: Course[] = [
  {
    id: "cr1",
    name: "Managerial Accounting",
    code: "ACT 320",
    instructor: "TBD",
    credits: 3,
    schedule: "Fri 5:00 PM",
    room: "TBD",
    attendance: { present: 5, absent: 2, total: 7 },
    latestActivity: "Section B-En · Spring 2026",
  },
  {
    id: "cr2",
    name: "Oral Communication",
    code: "COM 206",
    instructor: "TBD",
    credits: 3,
    schedule: "Mon / Wed 11:00 AM",
    room: "TBD",
    attendance: { present: 10, absent: 3, total: 13 },
    latestActivity: "Section F-En · Spring 2026",
  },
  {
    id: "cr3",
    name: "Financial Analysis",
    code: "FIN 330",
    instructor: "TBD",
    credits: 3,
    schedule: "Mon / Wed 12:00 PM",
    room: "TBD",
    attendance: { present: 7, absent: 3, total: 10 },
    latestActivity: "Section G-En · Spring 2026",
  },
  {
    id: "cr4",
    name: "Money & Banking",
    code: "FIN 420",
    instructor: "TBD",
    credits: 3,
    schedule: "Tue / Thu 4:00 PM",
    room: "TBD",
    attendance: { present: 12, absent: 3, total: 15 },
    latestActivity: "Section E-En · Spring 2026",
  },
  {
    id: "cr5",
    name: "Procurement & Inventory Management",
    code: "SCM 400",
    instructor: "TBD",
    credits: 3,
    schedule: "Mon / Wed 4:00 PM",
    room: "TBD",
    attendance: { present: 8, absent: 0, total: 8 },
    latestActivity: "Section A-En · Spring 2026",
  },
];

// ─── Attendance Records ─────────────────────────────────────────
export const attendanceRecords: AttendanceRecord[] = [
  {
    courseCode: "ACT 320",
    courseName: "Managerial Accounting",
    section: "B-En",
    present: 5,
    excusedAbsences: 0,
    unexcusedAbsences: 2,
    excusedTardiness: 0,
    unexcusedTardiness: 0,
    totalSessions: 7,
  },
  {
    courseCode: "COM 206",
    courseName: "Oral Communication",
    section: "F-En",
    present: 10,
    excusedAbsences: 0,
    unexcusedAbsences: 3,
    excusedTardiness: 0,
    unexcusedTardiness: 0,
    totalSessions: 13,
  },
  {
    courseCode: "FIN 330",
    courseName: "Financial Analysis",
    section: "G-En",
    present: 7,
    excusedAbsences: 0,
    unexcusedAbsences: 3,
    excusedTardiness: 0,
    unexcusedTardiness: 0,
    totalSessions: 10,
  },
  {
    courseCode: "FIN 420",
    courseName: "Money & Banking",
    section: "E-En",
    present: 12,
    excusedAbsences: 0,
    unexcusedAbsences: 3,
    excusedTardiness: 0,
    unexcusedTardiness: 0,
    totalSessions: 15,
  },
  {
    courseCode: "SCM 400",
    courseName: "Procurement & Inventory Management",
    section: "A-En",
    present: 8,
    excusedAbsences: 0,
    unexcusedAbsences: 0,
    excusedTardiness: 0,
    unexcusedTardiness: 0,
    totalSessions: 8,
  },
];

// ─── Finance ────────────────────────────────────────────────────
export const financeSummary: FinanceSummary = {
  totalLbpRemaining: 0,
  totalUsdRemaining: 3607,
  lbpFees: [
    {
      semester: "Spring 2026",
      chargesFees: 7000000,
      coursesTuition: 0,
      oldBalance: 0,
      oldBalanceConverted: 0,
      lbpCollection: 7000000,
      sponsorCollection: 0,
      scholarshipAmount: 0,
      adminDiscount: 0,
      remainingAmount: 0,
    },
    {
      semester: "Fall 2025",
      chargesFees: 15400000,
      coursesTuition: 0,
      oldBalance: 0,
      oldBalanceConverted: 0,
      lbpCollection: 15400000,
      sponsorCollection: 0,
      scholarshipAmount: 0,
      adminDiscount: 0,
      remainingAmount: 0,
    },
    {
      semester: "Spring 2025",
      chargesFees: 7000000,
      coursesTuition: 0,
      oldBalance: 0,
      oldBalanceConverted: 0,
      lbpCollection: 7000000,
      sponsorCollection: 0,
      scholarshipAmount: 0,
      adminDiscount: 0,
      remainingAmount: 0,
    },
    {
      semester: "Fall 2024",
      chargesFees: 12400000,
      coursesTuition: 0,
      oldBalance: 0,
      oldBalanceConverted: 0,
      lbpCollection: 12400000,
      sponsorCollection: 0,
      scholarshipAmount: 0,
      adminDiscount: 0,
      remainingAmount: 0,
    },
    {
      semester: "Spring 2024",
      chargesFees: 0,
      coursesTuition: 1800000,
      oldBalance: 0,
      oldBalanceConverted: 0,
      lbpCollection: 1800000,
      sponsorCollection: 0,
      scholarshipAmount: 0,
      adminDiscount: 0,
      remainingAmount: 0,
    },
    {
      semester: "Fall 2023",
      chargesFees: 2800000,
      coursesTuition: 2700000,
      oldBalance: 0,
      oldBalanceConverted: 0,
      lbpCollection: 5500000,
      sponsorCollection: 0,
      scholarshipAmount: 0,
      adminDiscount: 0,
      remainingAmount: 0,
    },
    {
      semester: "Spring 2023",
      chargesFees: 2280000,
      coursesTuition: 4230000,
      oldBalance: -3730000,
      oldBalanceConverted: 22380000,
      lbpCollection: 25160000,
      sponsorCollection: 0,
      scholarshipAmount: 0,
      adminDiscount: 0,
      remainingAmount: 0,
    },
  ],
  usdFees: [
    {
      semester: "Spring 2026",
      chargesFees: 370,
      usdTuition: 2550,
      usdCollection: 370,
      usdSponsors: 0,
      scholarship: 0,
      remainingAmount: 2550,
    },
    {
      semester: "Fall 2025",
      chargesFees: 401,
      usdTuition: 3060,
      usdCollection: 2404,
      usdSponsors: 0,
      scholarship: 0,
      remainingAmount: 1057,
    },
    {
      semester: "Spring 2025",
      chargesFees: 371,
      usdTuition: 2340,
      usdCollection: 1775,
      usdSponsors: 0,
      scholarship: 936,
      remainingAmount: 0,
    },
    {
      semester: "Fall 2024",
      chargesFees: 341,
      usdTuition: 1950,
      usdCollection: 1511,
      usdSponsors: 0,
      scholarship: 780,
      remainingAmount: 0,
    },
    {
      semester: "Spring 2024",
      chargesFees: 150,
      usdTuition: 1080,
      usdCollection: 1230,
      usdSponsors: 0,
      scholarship: 0,
      remainingAmount: 0,
    },
    {
      semester: "Fall 2023",
      chargesFees: 150,
      usdTuition: 1620,
      usdCollection: 1570,
      usdSponsors: 200,
      scholarship: 0,
      remainingAmount: 0,
    },
    {
      semester: "Spring 2023",
      chargesFees: 500,
      usdTuition: 0,
      usdCollection: 500,
      usdSponsors: 0,
      scholarship: 0,
      remainingAmount: 0,
    },
  ],
};

// ─── Calendar Events (dynamic from weekly schedule) ─────────────
function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

const dayOffsets: Record<string, number> = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

export function getCalendarEventsForWeeks(weeksCount: number = 2): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const today = new Date();
  const monday = getMonday(today);
  let counter = 0;

  for (let week = 0; week < weeksCount; week++) {
    for (const [dayName, sessions] of Object.entries(weeklySchedule)) {
      if (sessions.length === 0) continue;
      const offset = dayOffsets[dayName] ?? 0;
      const eventDate = new Date(monday);
      eventDate.setDate(monday.getDate() + week * 7 + offset);
      const dateStr = formatDateStr(eventDate);

      for (const session of sessions) {
        counter++;
        events.push({
          id: `cal-${counter}`,
          title: `${session.courseCode} – ${session.courseName}`,
          date: dateStr,
          time: session.time,
          type: "class",
          courseCode: session.courseCode,
        });
      }
    }
  }

  return events;
}

// Static export for backward compatibility — 2 weeks of class events + exam/assignment events
export const calendarEvents: CalendarEvent[] = [
  ...getCalendarEventsForWeeks(2),
  // Exam events
  { id: "ev-exam-1", title: "ACT 320 Midterm", date: "2026-03-25", time: "17:00", type: "exam", courseCode: "ACT 320" },
  { id: "ev-exam-2", title: "FIN 330 Midterm", date: "2026-03-26", time: "12:00", type: "exam", courseCode: "FIN 330" },
  { id: "ev-exam-3", title: "COM 206 Midterm", date: "2026-03-27", time: "11:00", type: "exam", courseCode: "COM 206" },
  { id: "ev-exam-4", title: "FIN 420 Midterm", date: "2026-04-01", time: "16:00", type: "exam", courseCode: "FIN 420" },
  { id: "ev-exam-5", title: "SCM 400 Midterm", date: "2026-04-03", time: "16:00", type: "exam", courseCode: "SCM 400" },
  // Assignment events
  { id: "ev-asgn-1", title: "Persuasive Speech Outline Due", date: "2026-03-22", type: "assignment", courseCode: "COM 206" },
  { id: "ev-asgn-2", title: "Variance Analysis Report Due", date: "2026-03-24", type: "assignment", courseCode: "ACT 320" },
  { id: "ev-asgn-3", title: "Financial Statement Analysis Due", date: "2026-03-26", type: "assignment", courseCode: "FIN 330" },
  { id: "ev-asgn-4", title: "Supplier Evaluation Matrix Due", date: "2026-03-28", type: "assignment", courseCode: "SCM 400" },
  { id: "ev-asgn-5", title: "Group Debate Preparation Due", date: "2026-04-02", type: "assignment", courseCode: "COM 206" },
  // General events
  { id: "ev-event-1", title: "Career Fair", date: "2026-03-28", time: "10:00", type: "event" },
];

// ─── Course Detail Data ─────────────────────────────────────────
// Letter grade mapping:
// A: 93–100, A-: 90–92, B+: 87–89, B: 83–86, B-: 80–82
// C+: 77–79, C: 73–76, C-: 70–72, D+: 67–69, D: 63–66, D-: 60–62, F: <60
function getLetterGrade(score: number): string {
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

function computeTotalGrade(grades: { earnedScore: number; maxScore: number; weight: number }[]): number {
  let totalWeight = 0;
  let weightedSum = 0;
  for (const g of grades) {
    const pct = (g.earnedScore / g.maxScore) * 100;
    weightedSum += pct * g.weight;
    totalWeight += g.weight;
  }
  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0;
}

const courseDetailsRaw: Record<string, Omit<CourseDetail, "totalGrade" | "letterGrade">> = {
  cr1: {
    courseId: "cr1",
    materials: [
      { id: "m1-1", category: "syllabus", title: "ACT 320 Course Syllabus", description: "Course outline, grading policy, and schedule", fileType: "PDF", date: "2026-01-13" },
      { id: "m1-2", category: "chapter", title: "Chapter 1 – Introduction to Managerial Accounting", fileType: "PDF", date: "2026-01-17" },
      { id: "m1-3", category: "chapter", title: "Chapter 2 – Cost Behavior and Cost-Volume-Profit", fileType: "PDF", date: "2026-01-24" },
      { id: "m1-4", category: "chapter", title: "Chapter 3 – Job-Order Costing Systems", fileType: "PDF", date: "2026-01-31" },
      { id: "m1-5", category: "slides", title: "Lecture Slides – Budgeting & Variance Analysis", fileType: "PPTX", date: "2026-02-14" },
      { id: "m1-6", category: "assignment", title: "Variance Analysis Report Brief", description: "Instructions for the variance analysis assignment", fileType: "PDF", date: "2026-03-10" },
      { id: "m1-7", category: "notes", title: "Midterm Revision Notes", description: "Key topics and formulas for midterm preparation", fileType: "PDF", date: "2026-03-14" },
    ],
    participants: [
      { id: "p1-0", name: "Dr. Nadine Khalil", role: "Instructor", email: "n.khalil@uls.edu.lb", initials: "NK" },
      { id: "p1-1", name: "Farid Sleimen Rahme", role: "Student", email: "202300189@students.uls.edu.lb", initials: "FS" },
      { id: "p1-2", name: "Lara Haddad", role: "Student", email: "202300201@students.uls.edu.lb", initials: "LH" },
      { id: "p1-3", name: "Omar Nasser", role: "Student", email: "202300215@students.uls.edu.lb", initials: "ON" },
      { id: "p1-4", name: "Maya Karam", role: "Student", email: "202300228@students.uls.edu.lb", initials: "MK" },
      { id: "p1-5", name: "Rami Fares", role: "Student", email: "202300234@students.uls.edu.lb", initials: "RF" },
      { id: "p1-6", name: "Nour Saad", role: "Student", email: "202300247@students.uls.edu.lb", initials: "NS" },
      { id: "p1-7", name: "Karim Abboud", role: "Student", email: "202300256@students.uls.edu.lb", initials: "KA" },
      { id: "p1-8", name: "Sarah Mounir", role: "Student", email: "202300263@students.uls.edu.lb", initials: "SM" },
    ],
    grades: [
      { id: "g1-1", title: "Assignment 1 – Cost Classification", earnedScore: 82, maxScore: 100, weight: 10 },
      { id: "g1-2", title: "Assignment 2 – CVP Analysis", earnedScore: 75, maxScore: 100, weight: 10 },
      { id: "g1-3", title: "Quiz 1", earnedScore: 18, maxScore: 25, weight: 10 },
      { id: "g1-4", title: "Case Study – Job-Order Costing", earnedScore: 38, maxScore: 50, weight: 15 },
      { id: "g1-5", title: "Midterm Exam", earnedScore: 68, maxScore: 100, weight: 25 },
      { id: "g1-6", title: "Variance Analysis Report", earnedScore: 0, maxScore: 100, weight: 15 },
      { id: "g1-7", title: "Final Exam", earnedScore: 0, maxScore: 100, weight: 15 },
    ],
  },
  cr2: {
    courseId: "cr2",
    materials: [
      { id: "m2-1", category: "syllabus", title: "COM 206 Course Syllabus", description: "Course objectives, assessment criteria, and timeline", fileType: "PDF", date: "2026-01-13" },
      { id: "m2-2", category: "chapter", title: "Chapter 1 – Foundations of Public Speaking", fileType: "PDF", date: "2026-01-15" },
      { id: "m2-3", category: "chapter", title: "Chapter 2 – Organizing and Outlining Speeches", fileType: "PDF", date: "2026-01-22" },
      { id: "m2-4", category: "chapter", title: "Chapter 3 – Persuasive Communication", fileType: "PDF", date: "2026-02-05" },
      { id: "m2-5", category: "slides", title: "Presentation Skills Workshop Slides", fileType: "PPTX", date: "2026-02-12" },
      { id: "m2-6", category: "reading", title: "Article – Effective Body Language in Presentations", fileType: "PDF", date: "2026-02-19" },
      { id: "m2-7", category: "assignment", title: "Persuasive Speech Outline Guidelines", description: "Detailed rubric for the speech outline submission", fileType: "PDF", date: "2026-03-08" },
      { id: "m2-8", category: "assignment", title: "Group Debate Brief", description: "Instructions and topic for the group debate", fileType: "PDF", date: "2026-03-15" },
    ],
    participants: [
      { id: "p2-0", name: "Prof. Carla Mansour", role: "Instructor", email: "c.mansour@uls.edu.lb", initials: "CM" },
      { id: "p2-1", name: "Farid Sleimen Rahme", role: "Student", email: "202300189@students.uls.edu.lb", initials: "FS" },
      { id: "p2-2", name: "Tala Rizk", role: "Student", email: "202300192@students.uls.edu.lb", initials: "TR" },
      { id: "p2-3", name: "Ahmad Salameh", role: "Student", email: "202300205@students.uls.edu.lb", initials: "AS" },
      { id: "p2-4", name: "Yara Harb", role: "Student", email: "202300218@students.uls.edu.lb", initials: "YH" },
      { id: "p2-5", name: "Jad Chamoun", role: "Student", email: "202300231@students.uls.edu.lb", initials: "JC" },
      { id: "p2-6", name: "Rana Obeid", role: "Student", email: "202300244@students.uls.edu.lb", initials: "RO" },
      { id: "p2-7", name: "Ziad Khoury", role: "Student", email: "202300257@students.uls.edu.lb", initials: "ZK" },
      { id: "p2-8", name: "Lea Daou", role: "Student", email: "202300270@students.uls.edu.lb", initials: "LD" },
      { id: "p2-9", name: "Hassan Mrad", role: "Student", email: "202300283@students.uls.edu.lb", initials: "HM" },
      { id: "p2-10", name: "Diana Hajj", role: "Student", email: "202300296@students.uls.edu.lb", initials: "DH" },
    ],
    grades: [
      { id: "g2-1", title: "Speech 1 – Informative", earnedScore: 85, maxScore: 100, weight: 15 },
      { id: "g2-2", title: "Speech 2 – Persuasive Outline", earnedScore: 90, maxScore: 100, weight: 15 },
      { id: "g2-3", title: "Participation & Peer Evaluations", earnedScore: 42, maxScore: 50, weight: 10 },
      { id: "g2-4", title: "Midterm – Written Exam", earnedScore: 78, maxScore: 100, weight: 20 },
      { id: "g2-5", title: "Group Debate", earnedScore: 0, maxScore: 100, weight: 20 },
      { id: "g2-6", title: "Final Presentation", earnedScore: 0, maxScore: 100, weight: 20 },
    ],
  },
  cr3: {
    courseId: "cr3",
    materials: [
      { id: "m3-1", category: "syllabus", title: "FIN 330 Course Syllabus", description: "Grading breakdown, office hours, and course calendar", fileType: "PDF", date: "2026-01-13" },
      { id: "m3-2", category: "chapter", title: "Chapter 1 – Financial Statement Overview", fileType: "PDF", date: "2026-01-15" },
      { id: "m3-3", category: "chapter", title: "Chapter 2 – Ratio Analysis", fileType: "PDF", date: "2026-01-22" },
      { id: "m3-4", category: "chapter", title: "Chapter 3 – Cash Flow Analysis", fileType: "PDF", date: "2026-02-05" },
      { id: "m3-5", category: "slides", title: "Lecture Slides – DuPont Analysis Framework", fileType: "PPTX", date: "2026-02-19" },
      { id: "m3-6", category: "reading", title: "Reading – Annual Report Analysis Guide", fileType: "PDF", date: "2026-02-26" },
      { id: "m3-7", category: "assignment", title: "Financial Statement Analysis Brief", description: "Guidelines for analyzing a publicly traded company", fileType: "PDF", date: "2026-03-12" },
      { id: "m3-8", category: "notes", title: "Midterm Revision Summary", fileType: "PDF", date: "2026-03-18" },
    ],
    participants: [
      { id: "p3-0", name: "Dr. Walid Hamdan", role: "Instructor", email: "w.hamdan@uls.edu.lb", initials: "WH" },
      { id: "p3-1", name: "Farid Sleimen Rahme", role: "Student", email: "202300189@students.uls.edu.lb", initials: "FS" },
      { id: "p3-2", name: "Charbel Aoun", role: "Student", email: "202300198@students.uls.edu.lb", initials: "CA" },
      { id: "p3-3", name: "Nadia Touma", role: "Student", email: "202300211@students.uls.edu.lb", initials: "NT" },
      { id: "p3-4", name: "Ali Issa", role: "Student", email: "202300224@students.uls.edu.lb", initials: "AI" },
      { id: "p3-5", name: "Hala Mikati", role: "Student", email: "202300237@students.uls.edu.lb", initials: "HM" },
      { id: "p3-6", name: "Sami Baz", role: "Student", email: "202300250@students.uls.edu.lb", initials: "SB" },
      { id: "p3-7", name: "Rita Azar", role: "Student", email: "202300264@students.uls.edu.lb", initials: "RA" },
    ],
    grades: [
      { id: "g3-1", title: "Assignment 1 – Ratio Analysis", earnedScore: 78, maxScore: 100, weight: 10 },
      { id: "g3-2", title: "Assignment 2 – Cash Flow Statement", earnedScore: 85, maxScore: 100, weight: 10 },
      { id: "g3-3", title: "Quiz 1 – Financial Statements", earnedScore: 20, maxScore: 25, weight: 10 },
      { id: "g3-4", title: "Midterm Exam", earnedScore: 72, maxScore: 100, weight: 25 },
      { id: "g3-5", title: "Financial Statement Analysis Project", earnedScore: 0, maxScore: 100, weight: 20 },
      { id: "g3-6", title: "Final Exam", earnedScore: 0, maxScore: 100, weight: 25 },
    ],
  },
  cr4: {
    courseId: "cr4",
    materials: [
      { id: "m4-1", category: "syllabus", title: "FIN 420 Course Syllabus", description: "Course overview, policies, and assessment plan", fileType: "PDF", date: "2026-01-14" },
      { id: "m4-2", category: "chapter", title: "Chapter 1 – Money, Banking, and the Financial System", fileType: "PDF", date: "2026-01-16" },
      { id: "m4-3", category: "chapter", title: "Chapter 2 – Interest Rates and Bond Valuation", fileType: "PDF", date: "2026-01-23" },
      { id: "m4-4", category: "chapter", title: "Chapter 3 – Central Banks and Monetary Policy", fileType: "PDF", date: "2026-02-06" },
      { id: "m4-5", category: "chapter", title: "Chapter 4 – Money Supply and Demand", fileType: "PDF", date: "2026-02-20" },
      { id: "m4-6", category: "slides", title: "Lecture Slides – BDL Monetary Policy Case", fileType: "PPTX", date: "2026-03-06" },
      { id: "m4-7", category: "assignment", title: "Central Bank Policy Case Study Brief", description: "Analysis of a central bank monetary policy decision", fileType: "PDF", date: "2026-03-06" },
      { id: "m4-8", category: "reading", title: "Reading – The Role of Central Banks in Emerging Markets", fileType: "PDF", date: "2026-03-13" },
    ],
    participants: [
      { id: "p4-0", name: "Dr. Fadi Youssef", role: "Instructor", email: "f.youssef@uls.edu.lb", initials: "FY" },
      { id: "p4-1", name: "Farid Sleimen Rahme", role: "Student", email: "202300189@students.uls.edu.lb", initials: "FS" },
      { id: "p4-2", name: "Layla Nassar", role: "Student", email: "202300195@students.uls.edu.lb", initials: "LN" },
      { id: "p4-3", name: "Tony Geha", role: "Student", email: "202300208@students.uls.edu.lb", initials: "TG" },
      { id: "p4-4", name: "Dima Sleiman", role: "Student", email: "202300221@students.uls.edu.lb", initials: "DS" },
      { id: "p4-5", name: "Elie Hanna", role: "Student", email: "202300240@students.uls.edu.lb", initials: "EH" },
      { id: "p4-6", name: "Joanna Mouawad", role: "Student", email: "202300253@students.uls.edu.lb", initials: "JM" },
      { id: "p4-7", name: "Khaled Tabbara", role: "Student", email: "202300266@students.uls.edu.lb", initials: "KT" },
      { id: "p4-8", name: "Celine Khalife", role: "Student", email: "202300279@students.uls.edu.lb", initials: "CK" },
      { id: "p4-9", name: "Marc Helou", role: "Student", email: "202300292@students.uls.edu.lb", initials: "MH" },
    ],
    grades: [
      { id: "g4-1", title: "Assignment 1 – Interest Rate Calculations", earnedScore: 88, maxScore: 100, weight: 10 },
      { id: "g4-2", title: "Assignment 2 – Bond Valuation", earnedScore: 76, maxScore: 100, weight: 10 },
      { id: "g4-3", title: "Quiz 1", earnedScore: 21, maxScore: 25, weight: 5 },
      { id: "g4-4", title: "Quiz 2", earnedScore: 19, maxScore: 25, weight: 5 },
      { id: "g4-5", title: "Central Bank Policy Case Study", earnedScore: 41, maxScore: 50, weight: 15 },
      { id: "g4-6", title: "Midterm Exam", earnedScore: 70, maxScore: 100, weight: 25 },
      { id: "g4-7", title: "Final Exam", earnedScore: 0, maxScore: 100, weight: 30 },
    ],
  },
  cr5: {
    courseId: "cr5",
    materials: [
      { id: "m5-1", category: "syllabus", title: "SCM 400 Course Syllabus", description: "Course structure, learning outcomes, and schedule", fileType: "PDF", date: "2026-01-13" },
      { id: "m5-2", category: "chapter", title: "Chapter 1 – Introduction to Procurement", fileType: "PDF", date: "2026-01-15" },
      { id: "m5-3", category: "chapter", title: "Chapter 2 – Supplier Selection & Evaluation", fileType: "PDF", date: "2026-01-22" },
      { id: "m5-4", category: "chapter", title: "Chapter 3 – Inventory Management Models", fileType: "PDF", date: "2026-02-05" },
      { id: "m5-5", category: "chapter", title: "Chapter 4 – EOQ and Safety Stock", fileType: "PDF", date: "2026-02-19" },
      { id: "m5-6", category: "slides", title: "Lecture Slides – ABC Analysis and JIT Systems", fileType: "PPTX", date: "2026-03-05" },
      { id: "m5-7", category: "assignment", title: "Supplier Evaluation Matrix Brief", description: "Weighted scoring model for supplier selection", fileType: "PDF", date: "2026-03-14" },
      { id: "m5-8", category: "reading", title: "Reading – Sustainable Procurement Practices", fileType: "PDF", date: "2026-03-07" },
    ],
    participants: [
      { id: "p5-0", name: "Dr. Hiba Kabbani", role: "Instructor", email: "h.kabbani@uls.edu.lb", initials: "HK" },
      { id: "p5-1", name: "Farid Sleimen Rahme", role: "Student", email: "202300189@students.uls.edu.lb", initials: "FS" },
      { id: "p5-2", name: "Tarek Fawaz", role: "Student", email: "202300196@students.uls.edu.lb", initials: "TF" },
      { id: "p5-3", name: "Mira Bakri", role: "Student", email: "202300209@students.uls.edu.lb", initials: "MB" },
      { id: "p5-4", name: "Georges Sfeir", role: "Student", email: "202300222@students.uls.edu.lb", initials: "GS" },
      { id: "p5-5", name: "Nadya Akel", role: "Student", email: "202300235@students.uls.edu.lb", initials: "NA" },
      { id: "p5-6", name: "Wael Dannaoui", role: "Student", email: "202300248@students.uls.edu.lb", initials: "WD" },
      { id: "p5-7", name: "Rola Bassil", role: "Student", email: "202300261@students.uls.edu.lb", initials: "RB" },
    ],
    grades: [
      { id: "g5-1", title: "Assignment 1 – Procurement Process Map", earnedScore: 92, maxScore: 100, weight: 10 },
      { id: "g5-2", title: "Assignment 2 – Supplier Evaluation", earnedScore: 88, maxScore: 100, weight: 10 },
      { id: "g5-3", title: "Quiz 1 – Inventory Models", earnedScore: 22, maxScore: 25, weight: 10 },
      { id: "g5-4", title: "Case Study – JIT Implementation", earnedScore: 44, maxScore: 50, weight: 15 },
      { id: "g5-5", title: "Midterm Exam", earnedScore: 81, maxScore: 100, weight: 25 },
      { id: "g5-6", title: "Supplier Evaluation Matrix Project", earnedScore: 0, maxScore: 100, weight: 15 },
      { id: "g5-7", title: "Final Exam", earnedScore: 0, maxScore: 100, weight: 15 },
    ],
  },
};

// Build final courseDetails with computed totals
export const courseDetails: Record<string, CourseDetail> = {};
for (const [key, raw] of Object.entries(courseDetailsRaw)) {
  // Only count graded items (earnedScore > 0) for total
  const gradedItems = raw.grades.filter((g) => g.earnedScore > 0);
  const total = gradedItems.length > 0 ? computeTotalGrade(gradedItems) : 0;
  courseDetails[key] = {
    ...raw,
    totalGrade: total,
    letterGrade: gradedItems.length > 0 ? getLetterGrade(total) : "N/A",
  };
}
