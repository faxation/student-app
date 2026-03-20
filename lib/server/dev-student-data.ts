/**
 * Dev-mode fallback data for student API routes.
 * Returns mock data in the exact shapes the frontend pages expect.
 * Used only when the database is unavailable.
 */

export const DEV_STUDENT_HOME = {
  quickStats: {
    enrolledCourses: 5,
    pendingAssignments: 3,
    upcomingExams: 2,
    unreadNotifications: 4,
  },
  todayClasses: [
    { id: "tc1", time: "9:00", endTime: "10:15", courseName: "Principles of Accounting II", courseCode: "ACC 201" },
    { id: "tc2", time: "11:00", endTime: "12:15", courseName: "Business Statistics", courseCode: "BUS 210" },
    { id: "tc3", time: "14:00", endTime: "15:15", courseName: "Financial Management", courseCode: "FIN 301" },
  ],
  upcomingDeadlines: [
    { id: "dl1", title: "Chapter 7 Problem Set", courseCode: "ACC 201", dueDate: "2026-03-23", status: "pending" },
    { id: "dl2", title: "Regression Analysis Report", courseCode: "BUS 210", dueDate: "2026-03-25", status: "pending" },
    { id: "dl3", title: "Portfolio Risk Assessment", courseCode: "FIN 301", dueDate: "2026-03-28", status: "pending" },
  ],
  announcements: [
    { id: "ann1", title: "Midterm Schedule Published", body: "The midterm examination schedule for Spring 2026 has been posted. Please check your exam dates and rooms.", date: "2026-03-18", category: "academic" },
    { id: "ann2", title: "Library Extended Hours", body: "The library will extend its operating hours during midterm week: open until 11 PM from March 23-30.", date: "2026-03-17", category: "event" },
    { id: "ann3", title: "Registration for Summer 2026", body: "Early registration for Summer 2026 courses opens on April 5. Meet with your advisor before registering.", date: "2026-03-15", category: "academic" },
  ],
};

export const DEV_STUDENT_COURSES = {
  courses: [
    {
      id: "sc1",
      code: "ACC 201",
      name: "Principles of Accounting II",
      credits: 3,
      instructor: "Dr. Nadia Haddad",
      schedule: "MWF 9:00-10:15",
      room: "BLK-A 201",
      latestActivity: "New assignment posted",
      section: { id: "sc1", number: "A", instructor: "Dr. Nadia Haddad", meetingTimes: "MWF 9:00 – 10:15", enrollmentCount: 35 },
      attendance: { present: 18, absent: 2, total: 20, absences: 2, warningLevel: "none" },
    },
    {
      id: "sc2",
      code: "BUS 210",
      name: "Business Statistics",
      credits: 3,
      instructor: "Prof. Karim Saab",
      schedule: "MWF 11:00-12:15",
      room: "BLK-B 105",
      latestActivity: "Quiz 3 graded",
      section: { id: "sc2", number: "B", instructor: "Prof. Karim Saab", meetingTimes: "MWF 11:00 – 12:15", enrollmentCount: 40 },
      attendance: { present: 17, absent: 3, total: 20, absences: 3, warningLevel: "none" },
    },
    {
      id: "sc3",
      code: "FIN 301",
      name: "Financial Management",
      credits: 3,
      instructor: "Dr. Rami Khoury",
      schedule: "TTh 14:00-15:15",
      room: "BLK-A 303",
      latestActivity: "Midterm review posted",
      section: { id: "sc3", number: "A", instructor: "Dr. Rami Khoury", meetingTimes: "TTh 14:00 – 15:15", enrollmentCount: 30 },
      attendance: { present: 12, absent: 1, total: 13, absences: 1, warningLevel: "none" },
    },
    {
      id: "sc4",
      code: "MGT 220",
      name: "Principles of Management",
      credits: 3,
      instructor: "Dr. Lina Fares",
      schedule: "TTh 11:00-12:15",
      room: "BLK-C 210",
      latestActivity: "Case study due soon",
      section: { id: "sc4", number: "A", instructor: "Dr. Lina Fares", meetingTimes: "TTh 11:00 – 12:15", enrollmentCount: 38 },
      attendance: { present: 11, absent: 2, total: 13, absences: 2, warningLevel: "none" },
    },
    {
      id: "sc5",
      code: "ENG 202",
      name: "Business Communication",
      credits: 3,
      instructor: "Prof. Maya Nassar",
      schedule: "MW 15:30-16:45",
      room: "BLK-B 302",
      latestActivity: "Presentation schedule posted",
      section: { id: "sc5", number: "C", instructor: "Prof. Maya Nassar", meetingTimes: "MW 15:30 – 16:45", enrollmentCount: 25 },
      attendance: { present: 14, absent: 0, total: 14, absences: 0, warningLevel: "none" },
    },
  ],
};

export const DEV_STUDENT_ASSIGNMENTS = {
  assignments: [
    { id: "sa1", title: "Chapter 7 Problem Set", courseCode: "ACC 201", courseName: "Principles of Accounting II", sectionNumber: "A", dueDate: "2026-03-23", weight: 5, status: "pending", description: "Complete exercises 7.1 through 7.15 from the textbook." },
    { id: "sa2", title: "Regression Analysis Report", courseCode: "BUS 210", courseName: "Business Statistics", sectionNumber: "B", dueDate: "2026-03-25", weight: 10, status: "pending", description: "Perform a multiple regression analysis on the provided dataset." },
    { id: "sa3", title: "Portfolio Risk Assessment", courseCode: "FIN 301", courseName: "Financial Management", sectionNumber: "A", dueDate: "2026-03-28", weight: 8, status: "pending", description: "Analyze the risk profile of the given portfolio using CAPM." },
    { id: "sa4", title: "Chapter 5 Homework", courseCode: "ACC 201", courseName: "Principles of Accounting II", sectionNumber: "A", dueDate: "2026-03-15", weight: 5, status: "submitted", description: "Journal entries and trial balance exercises." },
    { id: "sa5", title: "Descriptive Statistics Lab", courseCode: "BUS 210", courseName: "Business Statistics", sectionNumber: "B", dueDate: "2026-03-12", weight: 5, status: "submitted", description: "Excel-based descriptive statistics lab." },
    { id: "sa6", title: "Management Case Study 1", courseCode: "MGT 220", courseName: "Principles of Management", sectionNumber: "A", dueDate: "2026-03-10", weight: 10, status: "submitted", description: "Case analysis of Toyota's lean management system." },
    { id: "sa7", title: "Business Letter Draft", courseCode: "ENG 202", courseName: "Business Communication", sectionNumber: "C", dueDate: "2026-03-08", weight: 5, status: "late", description: "Write a formal business letter following the provided template." },
  ],
};

export const DEV_STUDENT_EXAMS = {
  exams: [
    { id: "se1", courseName: "Principles of Accounting II", courseCode: "ACC 201", sectionNumber: "A", title: "Midterm Exam", date: "2026-03-30", startTime: "9:00", endTime: "11:00", time: "9:00", duration: "9:00 - 11:00", room: "Hall A", location: "Hall A", weight: 25, type: "midterm", format: "in-person", status: "published" },
    { id: "se2", courseName: "Business Statistics", courseCode: "BUS 210", sectionNumber: "B", title: "Midterm Exam", date: "2026-04-01", startTime: "11:00", endTime: "13:00", time: "11:00", duration: "11:00 - 13:00", room: "Hall B", location: "Hall B", weight: 30, type: "midterm", format: "in-person", status: "published" },
    { id: "se3", courseName: "Financial Management", courseCode: "FIN 301", sectionNumber: "A", title: "Midterm Exam", date: "2026-04-03", startTime: "14:00", endTime: "16:00", time: "14:00", duration: "14:00 - 16:00", room: "Hall A", location: "Hall A", weight: 25, type: "midterm", format: "in-person", status: "published" },
    { id: "se4", courseName: "Principles of Management", courseCode: "MGT 220", sectionNumber: "A", title: "Midterm Exam", date: "2026-04-05", startTime: "11:00", endTime: "12:30", time: "11:00", duration: "11:00 - 12:30", room: "BLK-C 210", location: "BLK-C 210", weight: 20, type: "midterm", format: "in-person", status: "published" },
  ],
};

export const DEV_STUDENT_GRADES = {
  courses: [
    { sectionId: "sc1", courseCode: "ACC 201", courseName: "Principles of Accounting II", credits: 3, finalGrade: null, letterGrade: null, isReleased: false },
    { sectionId: "sc2", courseCode: "BUS 210", courseName: "Business Statistics", credits: 3, finalGrade: null, letterGrade: null, isReleased: false },
    { sectionId: "sc3", courseCode: "FIN 301", courseName: "Financial Management", credits: 3, finalGrade: null, letterGrade: null, isReleased: false },
    { sectionId: "sc4", courseCode: "MGT 220", courseName: "Principles of Management", credits: 3, finalGrade: null, letterGrade: null, isReleased: false },
    { sectionId: "sc5", courseCode: "ENG 202", courseName: "Business Communication", credits: 3, finalGrade: null, letterGrade: null, isReleased: false },
  ],
};

export const DEV_STUDENT_ATTENDANCE = {
  summaries: [
    { sectionId: "sc1", courseCode: "ACC 201", courseName: "Principles of Accounting II", sectionNumber: "A", totalSessions: 20, present: 18, late: 0, excused: 0, absent: 2, warningLevel: "none" },
    { sectionId: "sc2", courseCode: "BUS 210", courseName: "Business Statistics", sectionNumber: "B", totalSessions: 20, present: 17, late: 1, excused: 1, absent: 2, warningLevel: "none" },
    { sectionId: "sc3", courseCode: "FIN 301", courseName: "Financial Management", sectionNumber: "A", totalSessions: 13, present: 12, late: 0, excused: 0, absent: 1, warningLevel: "none" },
    { sectionId: "sc4", courseCode: "MGT 220", courseName: "Principles of Management", sectionNumber: "A", totalSessions: 13, present: 11, late: 0, excused: 1, absent: 1, warningLevel: "none" },
    { sectionId: "sc5", courseCode: "ENG 202", courseName: "Business Communication", sectionNumber: "C", totalSessions: 14, present: 14, late: 0, excused: 0, absent: 0, warningLevel: "none" },
  ],
};

export const DEV_STUDENT_CALENDAR = {
  events: [
    { id: "ce1", title: "Principles of Accounting II", type: "class", date: "2026-03-20", startTime: "9:00", endTime: "10:15", time: "9:00", location: "BLK-A 201", courseCode: "ACC 201", sectionNumber: "A" },
    { id: "ce2", title: "Business Statistics", type: "class", date: "2026-03-20", startTime: "11:00", endTime: "12:15", time: "11:00", location: "BLK-B 105", courseCode: "BUS 210", sectionNumber: "B" },
    { id: "ce3", title: "Financial Management", type: "class", date: "2026-03-20", startTime: "14:00", endTime: "15:15", time: "14:00", location: "BLK-A 303", courseCode: "FIN 301", sectionNumber: "A" },
    { id: "ce4", title: "Chapter 7 Problem Set", type: "assignment", date: "2026-03-23", startTime: "23:59", endTime: "23:59", time: "23:59", location: "", courseCode: "ACC 201", sectionNumber: "A" },
    { id: "ce5", title: "Regression Analysis Report", type: "assignment", date: "2026-03-25", startTime: "23:59", endTime: "23:59", time: "23:59", location: "", courseCode: "BUS 210", sectionNumber: "B" },
    { id: "ce6", title: "Portfolio Risk Assessment", type: "assignment", date: "2026-03-28", startTime: "23:59", endTime: "23:59", time: "23:59", location: "", courseCode: "FIN 301", sectionNumber: "A" },
    { id: "ce7", title: "ACC 201 Midterm", type: "exam", date: "2026-03-30", startTime: "9:00", endTime: "11:00", time: "9:00", location: "Hall A", courseCode: "ACC 201", sectionNumber: "A" },
    { id: "ce8", title: "BUS 210 Midterm", type: "exam", date: "2026-04-01", startTime: "11:00", endTime: "13:00", time: "11:00", location: "Hall B", courseCode: "BUS 210", sectionNumber: "B" },
    { id: "ce9", title: "FIN 301 Midterm", type: "exam", date: "2026-04-03", startTime: "14:00", endTime: "16:00", time: "14:00", location: "Hall A", courseCode: "FIN 301", sectionNumber: "A" },
  ],
};

export const DEV_STUDENT_FINANCE = {
  account: { balanceUsd: 1250.00, balanceLbp: 4500000, currency: "USD" },
  entries: [],
  lbpFees: [
    { semester: "Fall 2024", chargesFees: 12000000, coursesTuition: 18000000, lbpCollection: 28500000, remainingAmount: 1500000 },
    { semester: "Spring 2025", chargesFees: 12000000, coursesTuition: 18000000, lbpCollection: 27000000, remainingAmount: 3000000 },
    { semester: "Fall 2025", chargesFees: 12000000, coursesTuition: 18000000, lbpCollection: 30000000, remainingAmount: 0 },
    { semester: "Spring 2026", chargesFees: 12000000, coursesTuition: 18000000, lbpCollection: 25500000, remainingAmount: 4500000 },
  ],
  usdFees: [
    { semester: "Fall 2024", chargesFees: 200, usdTuition: 2400, usdCollection: 2200, usdSponsors: 0, scholarship: 400, remainingAmount: 0 },
    { semester: "Spring 2025", chargesFees: 200, usdTuition: 2400, usdCollection: 2100, usdSponsors: 0, scholarship: 400, remainingAmount: 100 },
    { semester: "Fall 2025", chargesFees: 200, usdTuition: 2400, usdCollection: 2600, usdSponsors: 0, scholarship: 0, remainingAmount: 0 },
    { semester: "Spring 2026", chargesFees: 200, usdTuition: 2400, usdCollection: 950, usdSponsors: 0, scholarship: 400, remainingAmount: 1250 },
  ],
  totalLbpRemaining: 4500000,
  totalUsdRemaining: 1250,
  studentProfile: {
    program: "BAF – General Business",
    faculty: "Faculty of Business Administration",
    advisor: "Dr. Nadia Haddad",
    gpa: 2.87,
    creditsCompleted: 69,
    creditsRequired: 96,
  },
};

export const DEV_STUDENT_NOTIFICATIONS = {
  notifications: [
    { id: "sn1", type: "GRADE", title: "Quiz 3 Graded", body: "Your grade for BUS 210 Quiz 3 has been posted.", isRead: false, createdAt: "2026-03-19T14:30:00Z" },
    { id: "sn2", type: "ASSIGNMENT", title: "New Assignment Posted", body: "ACC 201: Chapter 7 Problem Set is due March 23.", isRead: false, createdAt: "2026-03-18T10:00:00Z" },
    { id: "sn3", type: "ANNOUNCEMENT", title: "Midterm Schedule Published", body: "The midterm examination schedule for Spring 2026 has been posted.", isRead: false, createdAt: "2026-03-18T08:00:00Z" },
    { id: "sn4", type: "ANNOUNCEMENT", title: "Library Extended Hours", body: "The library will extend hours during midterm week.", isRead: false, createdAt: "2026-03-17T09:00:00Z" },
    { id: "sn5", type: "GRADE", title: "Assignment Graded", body: "Your Chapter 5 Homework for ACC 201 has been graded.", isRead: true, createdAt: "2026-03-16T11:00:00Z" },
  ],
  unreadCount: 4,
};
