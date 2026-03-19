import type {
  StudentProfile,
  Announcement,
  ClassSession,
  Assignment,
  Exam,
  Course,
  Transaction,
  FinanceSummary,
  CalendarEvent,
} from "@/lib/types";

// ─── Student Profile ────────────────────────────────────────────
export const studentProfile: StudentProfile = {
  id: "1",
  firstName: "Farid",
  lastName: "Khalil",
  email: "farid.khalil@students.uls.edu.lb",
  studentId: "202300189",
  major: "Computer Science",
  year: "Junior",
  semester: "Spring 2026",
  gpa: 3.62,
  avatarInitials: "FK",
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

// ─── Today's Classes ────────────────────────────────────────────
export const todayClasses: ClassSession[] = [
  {
    id: "c1",
    courseName: "Data Structures & Algorithms",
    courseCode: "CSC 301",
    instructor: "Dr. Nadia Haddad",
    time: "09:00",
    endTime: "10:30",
    room: "Building A, Room 204",
    day: "Monday",
  },
  {
    id: "c2",
    courseName: "Database Systems",
    courseCode: "CSC 340",
    instructor: "Dr. Omar Fares",
    time: "11:00",
    endTime: "12:30",
    room: "Building B, Room 112",
    day: "Monday",
  },
  {
    id: "c3",
    courseName: "Discrete Mathematics",
    courseCode: "MTH 260",
    instructor: "Prof. Rima Saad",
    time: "14:00",
    endTime: "15:30",
    room: "Building A, Room 310",
    day: "Monday",
  },
];

// ─── Assignments ────────────────────────────────────────────────
export const assignments: Assignment[] = [
  {
    id: "as1",
    title: "Binary Search Tree Implementation",
    courseCode: "CSC 301",
    courseName: "Data Structures & Algorithms",
    dueDate: "2026-03-22",
    status: "pending",
    description: "Implement a BST with insert, delete, and traversal operations in Java.",
  },
  {
    id: "as2",
    title: "ER Diagram – Library System",
    courseCode: "CSC 340",
    courseName: "Database Systems",
    dueDate: "2026-03-24",
    status: "pending",
    description: "Design a complete ER diagram for a university library management system.",
  },
  {
    id: "as3",
    title: "Proof by Induction Problem Set",
    courseCode: "MTH 260",
    courseName: "Discrete Mathematics",
    dueDate: "2026-03-20",
    status: "submitted",
    description: "Complete problems 4.1 through 4.12 from the textbook.",
  },
  {
    id: "as4",
    title: "Network Protocol Analysis",
    courseCode: "CSC 360",
    courseName: "Computer Networks",
    dueDate: "2026-03-18",
    status: "late",
    description: "Analyze TCP/UDP packet captures using Wireshark and write a report.",
  },
  {
    id: "as5",
    title: "Technical Writing Portfolio",
    courseCode: "ENG 220",
    courseName: "Technical Communication",
    dueDate: "2026-03-28",
    status: "pending",
    description: "Submit a portfolio containing three revised technical documents.",
  },
  {
    id: "as6",
    title: "SQL Query Optimization Lab",
    courseCode: "CSC 340",
    courseName: "Database Systems",
    dueDate: "2026-04-02",
    status: "pending",
    description: "Optimize a set of provided SQL queries and document the performance improvements.",
  },
];

// ─── Exams ──────────────────────────────────────────────────────
export const exams: Exam[] = [
  {
    id: "e1",
    courseName: "Data Structures & Algorithms",
    courseCode: "CSC 301",
    date: "2026-03-25",
    time: "09:00 – 11:00",
    duration: "2 hours",
    room: "Exam Hall A",
    format: "in-person",
    type: "midterm",
  },
  {
    id: "e2",
    courseName: "Database Systems",
    courseCode: "CSC 340",
    date: "2026-03-27",
    time: "11:00 – 13:00",
    duration: "2 hours",
    room: "Exam Hall B",
    format: "in-person",
    type: "midterm",
  },
  {
    id: "e3",
    courseName: "Discrete Mathematics",
    courseCode: "MTH 260",
    date: "2026-03-26",
    time: "14:00 – 15:30",
    duration: "1.5 hours",
    room: "Building A, Room 310",
    format: "in-person",
    type: "midterm",
  },
  {
    id: "e4",
    courseName: "Computer Networks",
    courseCode: "CSC 360",
    date: "2026-04-01",
    time: "10:00 – 11:30",
    duration: "1.5 hours",
    room: "Online (Moodle)",
    format: "online",
    type: "quiz",
  },
  {
    id: "e5",
    courseName: "Technical Communication",
    courseCode: "ENG 220",
    date: "2026-04-10",
    time: "09:00 – 10:30",
    duration: "1.5 hours",
    room: "Building C, Room 105",
    format: "in-person",
    type: "midterm",
  },
];

// ─── Courses ────────────────────────────────────────────────────
export const courses: Course[] = [
  {
    id: "cr1",
    name: "Data Structures & Algorithms",
    code: "CSC 301",
    instructor: "Dr. Nadia Haddad",
    credits: 3,
    schedule: "Mon / Wed  09:00 – 10:30",
    room: "Building A, Room 204",
    attendance: { present: 18, absent: 2, total: 20 },
    latestActivity: "Lecture 20: AVL Trees posted",
  },
  {
    id: "cr2",
    name: "Database Systems",
    code: "CSC 340",
    instructor: "Dr. Omar Fares",
    credits: 3,
    schedule: "Mon / Wed  11:00 – 12:30",
    room: "Building B, Room 112",
    attendance: { present: 19, absent: 1, total: 20 },
    latestActivity: "Assignment 4 graded",
  },
  {
    id: "cr3",
    name: "Discrete Mathematics",
    code: "MTH 260",
    instructor: "Prof. Rima Saad",
    credits: 3,
    schedule: "Mon / Thu  14:00 – 15:30",
    room: "Building A, Room 310",
    attendance: { present: 17, absent: 3, total: 20 },
    latestActivity: "Quiz 3 results available",
  },
  {
    id: "cr4",
    name: "Computer Networks",
    code: "CSC 360",
    instructor: "Dr. Hassan Khoury",
    credits: 3,
    schedule: "Tue / Thu  09:00 – 10:30",
    room: "Building B, Room 305",
    attendance: { present: 16, absent: 4, total: 20 },
    latestActivity: "Lab 6 submission open",
  },
  {
    id: "cr5",
    name: "Technical Communication",
    code: "ENG 220",
    instructor: "Ms. Lina Mansour",
    credits: 3,
    schedule: "Tue / Thu  11:00 – 12:30",
    room: "Building C, Room 105",
    attendance: { present: 20, absent: 0, total: 20 },
    latestActivity: "Peer review round 2 assigned",
  },
];

// ─── Finance ────────────────────────────────────────────────────
export const financeSummary: FinanceSummary = {
  totalTuition: 12500,
  totalPaid: 8750,
  balance: 3750,
  scholarshipAmount: 2500,
  nextPaymentDue: "2026-04-15",
  nextPaymentAmount: 3750,
};

export const transactions: Transaction[] = [
  {
    id: "t1",
    description: "Spring 2026 Tuition – Installment 1",
    amount: -4375,
    date: "2026-01-15",
    type: "charge",
    status: "completed",
  },
  {
    id: "t2",
    description: "Payment Received – Bank Transfer",
    amount: 4375,
    date: "2026-01-20",
    type: "payment",
    status: "completed",
  },
  {
    id: "t3",
    description: "Spring 2026 Tuition – Installment 2",
    amount: -4375,
    date: "2026-02-15",
    type: "charge",
    status: "completed",
  },
  {
    id: "t4",
    description: "Payment Received – Bank Transfer",
    amount: 4375,
    date: "2026-02-22",
    type: "payment",
    status: "completed",
  },
  {
    id: "t5",
    description: "Academic Merit Scholarship",
    amount: 2500,
    date: "2026-01-10",
    type: "scholarship",
    status: "completed",
  },
  {
    id: "t6",
    description: "Spring 2026 Tuition – Installment 3",
    amount: -3750,
    date: "2026-03-15",
    type: "charge",
    status: "pending",
  },
];

// ─── Calendar Events ────────────────────────────────────────────
export const calendarEvents: CalendarEvent[] = [
  { id: "ev1", title: "CSC 301 – Lecture", date: "2026-03-19", time: "09:00", type: "class", courseCode: "CSC 301" },
  { id: "ev2", title: "CSC 340 – Lecture", date: "2026-03-19", time: "11:00", type: "class", courseCode: "CSC 340" },
  { id: "ev3", title: "MTH 260 – Lecture", date: "2026-03-19", time: "14:00", type: "class", courseCode: "MTH 260" },
  { id: "ev4", title: "BST Implementation Due", date: "2026-03-22", type: "assignment", courseCode: "CSC 301" },
  { id: "ev5", title: "ER Diagram Due", date: "2026-03-24", type: "assignment", courseCode: "CSC 340" },
  { id: "ev6", title: "CSC 301 Midterm", date: "2026-03-25", time: "09:00", type: "exam", courseCode: "CSC 301" },
  { id: "ev7", title: "MTH 260 Midterm", date: "2026-03-26", time: "14:00", type: "exam", courseCode: "MTH 260" },
  { id: "ev8", title: "CSC 340 Midterm", date: "2026-03-27", time: "11:00", type: "exam", courseCode: "CSC 340" },
  { id: "ev9", title: "Career Fair", date: "2026-03-28", time: "10:00", type: "event" },
  { id: "ev10", title: "Technical Writing Portfolio Due", date: "2026-03-28", type: "assignment", courseCode: "ENG 220" },
  { id: "ev11", title: "CSC 360 Quiz", date: "2026-04-01", time: "10:00", type: "exam", courseCode: "CSC 360" },
  { id: "ev12", title: "SQL Optimization Lab Due", date: "2026-04-02", type: "assignment", courseCode: "CSC 340" },
];
