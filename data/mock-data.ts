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
