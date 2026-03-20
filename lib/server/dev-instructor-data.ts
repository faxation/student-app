/**
 * Dev-mode fallback data for instructor API routes.
 * Returns mock data in the exact shapes the frontend pages expect.
 * Used only when the database is unavailable.
 */

export const DEV_INSTRUCTOR_COURSES = {
  courses: [
    {
      id: "ic1",
      code: "CSC 301",
      name: "Data Structures & Algorithms",
      term: "Spring 2026",
      credits: 3,
      sectionCount: 2,
      sections: [
        { id: "is1", number: "A", status: "ACTIVE", enrollmentCount: 32, meetingTimes: "MWF 9:00 – 10:15" },
        { id: "is2", number: "B", status: "ACTIVE", enrollmentCount: 28, meetingTimes: "MWF 11:00 – 12:15" },
      ],
    },
    {
      id: "ic2",
      code: "CSC 415",
      name: "Database Systems",
      term: "Spring 2026",
      credits: 3,
      sectionCount: 2,
      sections: [
        { id: "is3", number: "A", status: "ACTIVE", enrollmentCount: 35, meetingTimes: "TTh 10:00 – 11:30" },
        { id: "is4", number: "B", status: "ACTIVE", enrollmentCount: 30, meetingTimes: "TTh 14:00 – 15:30" },
      ],
    },
    {
      id: "ic3",
      code: "CSC 210",
      name: "Object-Oriented Programming",
      term: "Spring 2026",
      credits: 3,
      sectionCount: 1,
      sections: [
        { id: "is5", number: "A", status: "ACTIVE", enrollmentCount: 40, meetingTimes: "MWF 14:00 – 15:15" },
      ],
    },
  ],
};

export const DEV_INSTRUCTOR_SECTIONS = {
  sections: [
    { id: "is1", number: "A", courseId: "ic1", courseCode: "CSC 301", courseName: "Data Structures & Algorithms", status: "ACTIVE", modality: "IN_PERSON", meetingTimes: "MWF 9:00 – 10:15", enrollmentCount: 32, maxCapacity: 32 },
    { id: "is2", number: "B", courseId: "ic1", courseCode: "CSC 301", courseName: "Data Structures & Algorithms", status: "ACTIVE", modality: "IN_PERSON", meetingTimes: "MWF 11:00 – 12:15", enrollmentCount: 28, maxCapacity: 28 },
    { id: "is3", number: "A", courseId: "ic2", courseCode: "CSC 415", courseName: "Database Systems", status: "ACTIVE", modality: "IN_PERSON", meetingTimes: "TTh 10:00 – 11:30", enrollmentCount: 35, maxCapacity: 35 },
    { id: "is4", number: "B", courseId: "ic2", courseCode: "CSC 415", courseName: "Database Systems", status: "ACTIVE", modality: "IN_PERSON", meetingTimes: "TTh 14:00 – 15:30", enrollmentCount: 30, maxCapacity: 30 },
    { id: "is5", number: "A", courseId: "ic3", courseCode: "CSC 210", courseName: "Object-Oriented Programming", status: "ACTIVE", modality: "IN_PERSON", meetingTimes: "MWF 14:00 – 15:15", enrollmentCount: 40, maxCapacity: 40 },
  ],
};

export const DEV_INSTRUCTOR_ASSIGNMENTS = {
  assignments: [
    { id: "ia1", title: "Binary Search Tree Implementation", courseId: "ic1", courseCode: "CSC 301", courseName: "Data Structures & Algorithms", sectionId: "is1", sectionLabel: "Section A", sectionNumber: "A", dueDate: "2026-04-05", weight: 15, hasFile: true, status: "published", description: "Implement a BST with insert, delete, and search operations." },
    { id: "ia2", title: "Graph Traversal Lab", courseId: "ic1", courseCode: "CSC 301", courseName: "Data Structures & Algorithms", sectionId: "is2", sectionLabel: "Section B", sectionNumber: "B", dueDate: "2026-04-08", weight: 10, hasFile: true, status: "published", description: "Implement BFS and DFS traversal algorithms." },
    { id: "ia3", title: "SQL Joins Practice", courseId: "ic2", courseCode: "CSC 415", courseName: "Database Systems", sectionId: "is3", sectionLabel: "Section A", sectionNumber: "A", dueDate: "2026-03-28", weight: 10, hasFile: false, status: "published", description: "Practice various SQL join operations." },
    { id: "ia4", title: "ER Diagram Project", courseId: "ic2", courseCode: "CSC 415", courseName: "Database Systems", sectionId: "is4", sectionLabel: "Section B", sectionNumber: "B", dueDate: "2026-04-15", weight: 20, hasFile: true, status: "draft", description: "Design an ER diagram for a real-world system." },
    { id: "ia5", title: "Inheritance Patterns Exercise", courseId: "ic3", courseCode: "CSC 210", courseName: "Object-Oriented Programming", sectionId: "is5", sectionLabel: "Section A", sectionNumber: "A", dueDate: "2026-04-01", weight: 12, hasFile: true, status: "published", description: "Implement design patterns using inheritance." },
  ],
};

export const DEV_INSTRUCTOR_EXAMS = {
  exams: [
    { id: "ie1", title: "Midterm – Data Structures", courseCode: "CSC 301", courseName: "Data Structures & Algorithms", sectionNumber: "A", sectionId: "is1", date: "2026-03-25", startTime: "09:00", endTime: "11:00", location: "Exam Hall C", weight: 25, type: "midterm", status: "published" },
    { id: "ie2", title: "Midterm – Database Systems", courseCode: "CSC 415", courseName: "Database Systems", sectionNumber: "A", sectionId: "is3", date: "2026-03-28", startTime: "10:00", endTime: "12:00", location: "Exam Hall C", weight: 25, type: "midterm", status: "published" },
    { id: "ie3", title: "Quiz 2 – OOP Patterns", courseCode: "CSC 210", courseName: "Object-Oriented Programming", sectionNumber: "A", sectionId: "is5", date: "2026-03-30", startTime: "14:00", endTime: "15:00", location: "Lab 101", weight: 10, type: "quiz", status: "published" },
  ],
};

export const DEV_SECTION_ROSTERS: Record<string, { roster: Array<{ id: string; name: string; studentNumber: string; currentGrade: number | null; letterGrade: string | null }> }> = {
  is1: { roster: [
    { id: "s1", name: "Lara Haddad", studentNumber: "202300200", currentGrade: 85, letterGrade: "B" },
    { id: "s2", name: "Omar Khoury", studentNumber: "202300201", currentGrade: 92, letterGrade: "A" },
    { id: "s3", name: "Nour El Dine", studentNumber: "202300202", currentGrade: 78, letterGrade: "C+" },
    { id: "s4", name: "Karim Nassar", studentNumber: "202300203", currentGrade: null, letterGrade: null },
    { id: "s5", name: "Maya Abi Nader", studentNumber: "202300204", currentGrade: 88, letterGrade: "B+" },
    { id: "s6", name: "Rami Saleh", studentNumber: "202300205", currentGrade: null, letterGrade: null },
    { id: "s7", name: "Sara Baroudi", studentNumber: "202300206", currentGrade: 71, letterGrade: "C" },
  ]},
  is2: { roster: [
    { id: "s8", name: "Ali Hamdan", studentNumber: "202300207", currentGrade: 90, letterGrade: "A" },
    { id: "s9", name: "Tala Fakhri", studentNumber: "202300208", currentGrade: 76, letterGrade: "C+" },
    { id: "s10", name: "Jad Moussawi", studentNumber: "202300209", currentGrade: null, letterGrade: null },
    { id: "s11", name: "Hana Bazzi", studentNumber: "202300210", currentGrade: 83, letterGrade: "B" },
    { id: "s12", name: "Youssef Aoun", studentNumber: "202300211", currentGrade: 95, letterGrade: "A" },
    { id: "s13", name: "Leen Saab", studentNumber: "202300212", currentGrade: 68, letterGrade: "D+" },
  ]},
  is3: { roster: [
    { id: "s14", name: "Ziad Khalil", studentNumber: "202300213", currentGrade: 87, letterGrade: "B+" },
    { id: "s15", name: "Nadia Traboulsi", studentNumber: "202300214", currentGrade: 91, letterGrade: "A" },
    { id: "s16", name: "Sami Geagea", studentNumber: "202300215", currentGrade: null, letterGrade: null },
    { id: "s17", name: "Rita Frem", studentNumber: "202300216", currentGrade: 74, letterGrade: "C" },
    { id: "s18", name: "Walid Hanna", studentNumber: "202300217", currentGrade: 82, letterGrade: "B" },
    { id: "s19", name: "Diana Chalouhi", studentNumber: "202300218", currentGrade: 89, letterGrade: "B+" },
    { id: "s20", name: "Elie Boustani", studentNumber: "202300219", currentGrade: null, letterGrade: null },
  ]},
  is4: { roster: [
    { id: "s21", name: "Layal Makhlouf", studentNumber: "202300220", currentGrade: 79, letterGrade: "C+" },
    { id: "s22", name: "Ahmad Darwish", studentNumber: "202300221", currentGrade: 93, letterGrade: "A" },
    { id: "s23", name: "Perla Assaf", studentNumber: "202300222", currentGrade: 85, letterGrade: "B" },
    { id: "s24", name: "Hussein Itani", studentNumber: "202300223", currentGrade: null, letterGrade: null },
    { id: "s25", name: "Christina Naim", studentNumber: "202300224", currentGrade: 72, letterGrade: "C" },
    { id: "s26", name: "Tarek Abdallah", studentNumber: "202300225", currentGrade: 88, letterGrade: "B+" },
  ]},
  is5: { roster: [
    { id: "s27", name: "Yasmine Harb", studentNumber: "202300226", currentGrade: 94, letterGrade: "A" },
    { id: "s28", name: "Marc Azar", studentNumber: "202300227", currentGrade: 81, letterGrade: "B" },
    { id: "s29", name: "Dina Obeid", studentNumber: "202300228", currentGrade: 77, letterGrade: "C+" },
    { id: "s30", name: "Fadi Rahal", studentNumber: "202300229", currentGrade: null, letterGrade: null },
    { id: "s31", name: "Rania Sfeir", studentNumber: "202300230", currentGrade: 86, letterGrade: "B+" },
    { id: "s32", name: "Charbel Daou", studentNumber: "202300231", currentGrade: 70, letterGrade: "C" },
    { id: "s33", name: "Joelle Kanaan", studentNumber: "202300232", currentGrade: 91, letterGrade: "A" },
    { id: "s34", name: "Bilal Tabbara", studentNumber: "202300233", currentGrade: null, letterGrade: null },
  ]},
};
