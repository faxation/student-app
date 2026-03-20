import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hash(pw: string) {
  return bcrypt.hash(pw, 12);
}

async function main() {
  console.log("Seeding database...");

  // ─── Grade Scale ──────────────────────────────────────────────
  const gradeScale = [
    { letter: "A",  minScore: 90, maxScore: 100, gradePoints: 4.0 },
    { letter: "A-", minScore: 87, maxScore: 89.99, gradePoints: 3.7 },
    { letter: "B+", minScore: 83, maxScore: 86.99, gradePoints: 3.3 },
    { letter: "B",  minScore: 80, maxScore: 82.99, gradePoints: 3.0 },
    { letter: "B-", minScore: 77, maxScore: 79.99, gradePoints: 2.7 },
    { letter: "C+", minScore: 73, maxScore: 76.99, gradePoints: 2.3 },
    { letter: "C",  minScore: 70, maxScore: 72.99, gradePoints: 2.0 },
    { letter: "C-", minScore: 67, maxScore: 69.99, gradePoints: 1.7 },
    { letter: "D+", minScore: 63, maxScore: 66.99, gradePoints: 1.3 },
    { letter: "D",  minScore: 60, maxScore: 62.99, gradePoints: 1.0 },
    { letter: "F",  minScore: 0,  maxScore: 59.99, gradePoints: 0.0 },
  ];
  for (const gs of gradeScale) {
    await prisma.gradeScale.upsert({
      where: { letter: gs.letter },
      update: {},
      create: gs,
    });
  }
  console.log("  Grade scale seeded");

  // ─── Faculties ────────────────────────────────────────────────
  const econFaculty = await prisma.faculty.upsert({
    where: { code: "ECON" },
    update: {},
    create: { code: "ECON", name: "Economics & Bus. Adm" },
  });
  const csFaculty = await prisma.faculty.upsert({
    where: { code: "CS" },
    update: {},
    create: { code: "CS", name: "Computer Science" },
  });

  // ─── Programs ─────────────────────────────────────────────────
  const bafProgram = await prisma.program.upsert({
    where: { code: "BAF" },
    update: {},
    create: {
      code: "BAF",
      name: "BAF/General Business",
      facultyId: econFaculty.id,
      requiredCredits: 96,
    },
  });
  const csProgram = await prisma.program.upsert({
    where: { code: "CSC" },
    update: {},
    create: {
      code: "CSC",
      name: "Computer Science",
      facultyId: csFaculty.id,
      requiredCredits: 90,
    },
  });

  // ─── Terms ────────────────────────────────────────────────────
  const spring2026 = await prisma.term.upsert({
    where: { code: "SPR2026" },
    update: {},
    create: {
      code: "SPR2026",
      name: "Spring 2026",
      startDate: new Date("2026-01-26"),
      endDate: new Date("2026-05-22"),
      status: "ACTIVE",
    },
  });
  const fall2025 = await prisma.term.upsert({
    where: { code: "FALL2025" },
    update: {},
    create: {
      code: "FALL2025",
      name: "Fall 2025",
      startDate: new Date("2025-09-15"),
      endDate: new Date("2025-12-19"),
      status: "COMPLETED",
    },
  });

  // ─── Users: Student ───────────────────────────────────────────
  const studentUser = await prisma.user.upsert({
    where: { username: "202300189" },
    update: {},
    create: {
      email: "farid.sleimenrahme@students.uls.edu.lb",
      username: "202300189",
      passwordHash: await hash("std175593"),
      role: "STUDENT",
    },
  });
  const studentProfile = await prisma.studentProfile.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      studentId: "202300189",
      fullName: "Farid Sleimen Rahme",
      email: "farid.sleimenrahme@students.uls.edu.lb",
      phone: "+961 71 123 456",
      facultyId: econFaculty.id,
      programId: bafProgram.id,
      admissionTermId: fall2025.id,
      gpa: 2.87,
      creditsCompleted: 69,
      creditsRequired: 96,
      avatarInitials: "FS",
    },
  });

  // ─── Users: Instructors ───────────────────────────────────────
  async function createInstructor(
    username: string, password: string, email: string,
    fullName: string, dept: string, title: string, initials: string
  ) {
    const user = await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        email,
        username,
        passwordHash: await hash(password),
        role: "INSTRUCTOR",
      },
    });
    const profile = await prisma.instructorProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        fullName,
        email,
        department: dept,
        teachingRoleLabel: title,
        avatarInitials: initials,
      },
    });
    return { user, profile };
  }

  const adam = await createInstructor(
    "Adam", "Act3and4",
    "adam.mitchell@uls.edu", "Adam Mitchell",
    "Computer Science", "Associate Professor", "AM"
  );
  const instKhoury = await createInstructor(
    "ykhoury", "inst2026",
    "youssef.khoury@uls.edu", "Dr. Youssef Khoury",
    "Accounting", "Associate Professor", "YK"
  );
  const instHakimi = await createInstructor(
    "nhakimi", "inst2026",
    "nadia.hakimi@uls.edu", "Dr. Nadia Hakimi",
    "Communication", "Assistant Professor", "NH"
  );
  const instAssaf = await createInstructor(
    "kassaf", "inst2026",
    "khalil.assaf@uls.edu", "Dr. Khalil Assaf",
    "Finance", "Professor", "KA"
  );
  const instSaba = await createInstructor(
    "rsaba", "inst2026",
    "rami.saba@uls.edu", "Dr. Rami Saba",
    "Finance", "Associate Professor", "RS"
  );
  const instBaz = await createInstructor(
    "lbaz", "inst2026",
    "layla.baz@uls.edu", "Dr. Layla Baz",
    "Supply Chain", "Assistant Professor", "LB"
  );
  console.log("  Users seeded");

  // ─── Courses ──────────────────────────────────────────────────
  async function upsertCourse(code: string, name: string, credits: number, programId: string) {
    return prisma.course.upsert({
      where: { code },
      update: {},
      create: { code, name, credits, programId },
    });
  }

  const ACT320 = await upsertCourse("ACT 320", "Managerial Accounting", 3, bafProgram.id);
  const COM206 = await upsertCourse("COM 206", "Oral Communication", 3, bafProgram.id);
  const FIN330 = await upsertCourse("FIN 330", "Financial Analysis", 3, bafProgram.id);
  const FIN420 = await upsertCourse("FIN 420", "Money & Banking", 3, bafProgram.id);
  const SCM400 = await upsertCourse("SCM 400", "Procurement & Inventory Management", 3, bafProgram.id);
  const CSC301 = await upsertCourse("CSC 301", "Data Structures & Algorithms", 3, csProgram.id);
  const CSC415 = await upsertCourse("CSC 415", "Database Systems", 3, csProgram.id);
  const CSC210 = await upsertCourse("CSC 210", "Object-Oriented Programming", 3, csProgram.id);
  console.log("  Courses seeded");

  // ─── Sections ─────────────────────────────────────────────────
  async function upsertSection(
    courseId: string, termId: string, instructorId: string,
    sectionCode: string, room: string, capacity: number
  ) {
    return prisma.section.upsert({
      where: { courseId_sectionCode_termId: { courseId, sectionCode, termId } },
      update: {},
      create: { courseId, termId, instructorId, sectionCode, room, capacity },
    });
  }

  // Student's business course sections
  const secACT = await upsertSection(ACT320.id, spring2026.id, instKhoury.profile.id, "B-En", "Room 301", 35);
  const secCOM = await upsertSection(COM206.id, spring2026.id, instHakimi.profile.id, "A-En", "Room 205", 30);
  const secFIN330 = await upsertSection(FIN330.id, spring2026.id, instAssaf.profile.id, "A-En", "Room 102", 40);
  const secFIN420 = await upsertSection(FIN420.id, spring2026.id, instSaba.profile.id, "A-En", "Room 303", 35);
  const secSCM = await upsertSection(SCM400.id, spring2026.id, instBaz.profile.id, "A-En", "Room 401", 30);

  // Adam's CS sections
  const secCSC301_A = await upsertSection(CSC301.id, spring2026.id, adam.profile.id, "A", "Lab 201", 32);
  const secCSC301_B = await upsertSection(CSC301.id, spring2026.id, adam.profile.id, "B", "Lab 202", 28);
  const secCSC415_A = await upsertSection(CSC415.id, spring2026.id, adam.profile.id, "A", "Lab 301", 35);
  const secCSC415_B = await upsertSection(CSC415.id, spring2026.id, adam.profile.id, "B", "Lab 302", 30);
  const secCSC210_A = await upsertSection(CSC210.id, spring2026.id, adam.profile.id, "A", "Lab 101", 40);
  console.log("  Sections seeded");

  // ─── Section Meetings ─────────────────────────────────────────
  type Day = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";
  async function addMeeting(sectionId: string, day: Day, start: string, end: string, room?: string) {
    const existing = await prisma.sectionMeeting.findFirst({
      where: { sectionId, dayOfWeek: day, startTime: start },
    });
    if (!existing) {
      await prisma.sectionMeeting.create({
        data: { sectionId, dayOfWeek: day, startTime: start, endTime: end, room },
      });
    }
  }

  // ACT 320 - Friday 17:00-18:00
  await addMeeting(secACT.id, "FRIDAY", "17:00", "18:00", "Room 301");
  // COM 206 - Mon/Wed 11:00-12:00
  await addMeeting(secCOM.id, "MONDAY", "11:00", "12:00", "Room 205");
  await addMeeting(secCOM.id, "WEDNESDAY", "11:00", "12:00", "Room 205");
  // FIN 330 - Mon/Wed 12:00-13:00
  await addMeeting(secFIN330.id, "MONDAY", "12:00", "13:00", "Room 102");
  await addMeeting(secFIN330.id, "WEDNESDAY", "12:00", "13:00", "Room 102");
  // FIN 420 - Tue/Thu 16:00-17:00
  await addMeeting(secFIN420.id, "TUESDAY", "16:00", "17:00", "Room 303");
  await addMeeting(secFIN420.id, "THURSDAY", "16:00", "17:00", "Room 303");
  // SCM 400 - Mon/Wed 16:00-17:00
  await addMeeting(secSCM.id, "MONDAY", "16:00", "17:00", "Room 401");
  await addMeeting(secSCM.id, "WEDNESDAY", "16:00", "17:00", "Room 401");

  // Adam's CS sections
  await addMeeting(secCSC301_A.id, "MONDAY", "09:00", "10:15", "Lab 201");
  await addMeeting(secCSC301_A.id, "WEDNESDAY", "09:00", "10:15", "Lab 201");
  await addMeeting(secCSC301_A.id, "FRIDAY", "09:00", "10:15", "Lab 201");
  await addMeeting(secCSC301_B.id, "MONDAY", "11:00", "12:15", "Lab 202");
  await addMeeting(secCSC301_B.id, "WEDNESDAY", "11:00", "12:15", "Lab 202");
  await addMeeting(secCSC301_B.id, "FRIDAY", "11:00", "12:15", "Lab 202");
  await addMeeting(secCSC415_A.id, "TUESDAY", "10:00", "11:30", "Lab 301");
  await addMeeting(secCSC415_A.id, "THURSDAY", "10:00", "11:30", "Lab 301");
  await addMeeting(secCSC415_B.id, "TUESDAY", "14:00", "15:30", "Lab 302");
  await addMeeting(secCSC415_B.id, "THURSDAY", "14:00", "15:30", "Lab 302");
  await addMeeting(secCSC210_A.id, "MONDAY", "14:00", "15:15", "Lab 101");
  await addMeeting(secCSC210_A.id, "WEDNESDAY", "14:00", "15:15", "Lab 101");
  await addMeeting(secCSC210_A.id, "FRIDAY", "14:00", "15:15", "Lab 101");
  console.log("  Meetings seeded");

  // ─── Student Enrollments ──────────────────────────────────────
  const studentSections = [secACT, secCOM, secFIN330, secFIN420, secSCM];
  for (const sec of studentSections) {
    await prisma.sectionEnrollment.upsert({
      where: { studentId_sectionId: { studentId: studentProfile.id, sectionId: sec.id } },
      update: {},
      create: { studentId: studentProfile.id, sectionId: sec.id, status: "ENROLLED" },
    });
  }

  // Create CS students for Adam's sections
  const csStudentNames = [
    "Lara Haddad", "Omar Khoury", "Nour El Dine", "Karim Nassar",
    "Maya Abi Nader", "Rami Saleh", "Sara Baroudi", "Ali Hamdan",
    "Tala Fakhri", "Jad Moussawi", "Hana Bazzi", "Youssef Aoun",
    "Leen Saab", "Ziad Khalil", "Nadia Traboulsi", "Sami Geagea",
    "Rita Frem", "Walid Hanna", "Diana Chalouhi", "Elie Boustani",
  ];
  const csStudents: string[] = [];
  for (let i = 0; i < csStudentNames.length; i++) {
    const sid = `20230${(200 + i).toString()}`;
    const sUser = await prisma.user.upsert({
      where: { username: sid },
      update: {},
      create: {
        email: `${csStudentNames[i].toLowerCase().replace(/ /g, ".")}@students.uls.edu.lb`,
        username: sid,
        passwordHash: await hash("student2026"),
        role: "STUDENT",
      },
    });
    const initials = csStudentNames[i].split(" ").map(n => n[0]).join("");
    const sp = await prisma.studentProfile.upsert({
      where: { userId: sUser.id },
      update: {},
      create: {
        userId: sUser.id,
        studentId: sid,
        fullName: csStudentNames[i],
        email: sUser.email,
        facultyId: csFaculty.id,
        programId: csProgram.id,
        admissionTermId: fall2025.id,
        gpa: 2.5 + Math.random() * 1.5,
        creditsCompleted: 40 + Math.floor(Math.random() * 40),
        creditsRequired: 90,
        avatarInitials: initials,
      },
    });
    csStudents.push(sp.id);
  }

  // Enroll CS students in Adam's sections
  const adamSections = [secCSC301_A, secCSC301_B, secCSC415_A, secCSC415_B, secCSC210_A];
  for (let i = 0; i < csStudents.length; i++) {
    // Spread students across sections
    const secs = i < 7 ? [secCSC301_A, secCSC415_A] :
                 i < 14 ? [secCSC301_B, secCSC415_B] :
                 [secCSC210_A];
    for (const sec of secs) {
      await prisma.sectionEnrollment.upsert({
        where: { studentId_sectionId: { studentId: csStudents[i], sectionId: sec.id } },
        update: {},
        create: { studentId: csStudents[i], sectionId: sec.id, status: "ENROLLED" },
      });
    }
  }
  console.log("  Enrollments seeded");

  // ─── Assignments (matching mock data) ─────────────────────────
  const assignmentData = [
    { course: ACT320, section: secACT, inst: instKhoury.profile.id, num: 1, title: "Variance Analysis Report", due: "2026-03-24", weight: 10, status: "PUBLISHED" as const, chapter: "Ch. 8–9" },
    { course: COM206, section: secCOM, inst: instHakimi.profile.id, num: 1, title: "Persuasive Speech Outline", due: "2026-03-22", weight: 8, status: "PUBLISHED" as const, chapter: "Ch. 5" },
    { course: FIN330, section: secFIN330, inst: instAssaf.profile.id, num: 1, title: "Financial Statement Analysis", due: "2026-03-26", weight: 12, status: "PUBLISHED" as const, chapter: "Ch. 4–6" },
    { course: FIN420, section: secFIN420, inst: instSaba.profile.id, num: 1, title: "Central Bank Policy Case Study", due: "2026-03-20", weight: 10, status: "PUBLISHED" as const, chapter: "Ch. 7" },
    { course: SCM400, section: secSCM, inst: instBaz.profile.id, num: 1, title: "Supplier Evaluation Matrix", due: "2026-03-28", weight: 10, status: "PUBLISHED" as const, chapter: "Ch. 3" },
    { course: COM206, section: secCOM, inst: instHakimi.profile.id, num: 2, title: "Group Debate Preparation", due: "2026-04-02", weight: 10, status: "PUBLISHED" as const, chapter: "Ch. 6–7" },
    // Adam's assignments
    { course: CSC301, section: secCSC301_A, inst: adam.profile.id, num: 1, title: "Binary Search Tree Implementation", due: "2026-04-05", weight: 15, status: "PUBLISHED" as const, chapter: "Ch. 10" },
    { course: CSC301, section: secCSC301_B, inst: adam.profile.id, num: 2, title: "Graph Traversal Lab", due: "2026-04-08", weight: 10, status: "PUBLISHED" as const, chapter: "Ch. 12" },
    { course: CSC415, section: secCSC415_A, inst: adam.profile.id, num: 1, title: "SQL Joins Practice", due: "2026-03-28", weight: 10, status: "PUBLISHED" as const, chapter: "Ch. 4" },
    { course: CSC415, section: secCSC415_B, inst: adam.profile.id, num: 2, title: "ER Diagram Project", due: "2026-04-15", weight: 20, status: "DRAFT" as const, chapter: "Ch. 2–3" },
    { course: CSC210, section: secCSC210_A, inst: adam.profile.id, num: 1, title: "Inheritance Patterns Exercise", due: "2026-04-01", weight: 12, status: "PUBLISHED" as const, chapter: "Ch. 8" },
  ];

  for (const a of assignmentData) {
    const existing = await prisma.assignment.findFirst({
      where: { courseId: a.course.id, assignmentNumber: a.num, createdById: a.inst },
    });
    if (!existing) {
      await prisma.assignment.create({
        data: {
          courseId: a.course.id,
          createdById: a.inst,
          assignmentNumber: a.num,
          title: a.title,
          relatedChapter: a.chapter,
          instructionsText: `Complete the ${a.title} as described in class.`,
          weightPercent: a.weight,
          dueAt: new Date(a.due),
          status: a.status,
          publishedAt: a.status === "PUBLISHED" ? new Date("2026-03-01") : null,
          sections: { create: { sectionId: a.section.id } },
        },
      });
    }
  }
  console.log("  Assignments seeded");

  // ─── Exams (matching mock data) ───────────────────────────────
  const examData = [
    { course: ACT320, section: secACT, inst: instKhoury.profile.id, label: "Exam 1", title: "Midterm – Managerial Accounting", date: "2026-03-25", start: "17:00", end: "19:00", room: "Exam Hall A", weight: 25 },
    { course: COM206, section: secCOM, inst: instHakimi.profile.id, label: "Exam 1", title: "Midterm – Oral Communication", date: "2026-03-27", start: "11:00", end: "12:30", room: "Exam Hall B", weight: 25 },
    { course: FIN330, section: secFIN330, inst: instAssaf.profile.id, label: "Exam 1", title: "Midterm – Financial Analysis", date: "2026-03-26", start: "12:00", end: "14:00", room: "Exam Hall A", weight: 30 },
    { course: FIN420, section: secFIN420, inst: instSaba.profile.id, label: "Exam 1", title: "Midterm – Money & Banking", date: "2026-04-01", start: "16:00", end: "18:00", room: "Exam Hall B", weight: 25 },
    { course: SCM400, section: secSCM, inst: instBaz.profile.id, label: "Exam 1", title: "Midterm – Procurement & Inventory", date: "2026-04-03", start: "16:00", end: "18:00", room: "Exam Hall A", weight: 25 },
    // Adam's exams
    { course: CSC301, section: secCSC301_A, inst: adam.profile.id, label: "Exam 1", title: "Midterm – Data Structures", date: "2026-03-25", start: "09:00", end: "11:00", room: "Exam Hall C", weight: 25 },
    { course: CSC415, section: secCSC415_A, inst: adam.profile.id, label: "Exam 1", title: "Midterm – Database Systems", date: "2026-03-28", start: "10:00", end: "12:00", room: "Exam Hall C", weight: 25 },
    { course: CSC210, section: secCSC210_A, inst: adam.profile.id, label: "Exam 1", title: "Quiz 2 – OOP Patterns", date: "2026-03-30", start: "14:00", end: "15:00", room: "Lab 101", weight: 10 },
  ];

  for (const e of examData) {
    const existing = await prisma.exam.findFirst({
      where: { courseId: e.course.id, examNumberLabel: e.label, createdById: e.inst },
    });
    if (!existing) {
      await prisma.exam.create({
        data: {
          courseId: e.course.id,
          createdById: e.inst,
          examNumberLabel: e.label,
          title: e.title,
          examDate: new Date(e.date),
          startTime: e.start,
          endTime: e.end,
          room: e.room,
          weightPercent: e.weight,
          status: "PUBLISHED",
          publishedAt: new Date("2026-03-01"),
          sections: { create: { sectionId: e.section.id } },
        },
      });
    }
  }
  console.log("  Exams seeded");

  // ─── Attendance ───────────────────────────────────────────────
  // Create 7 past sessions for student's courses
  const sessionDates = [
    "2026-02-02", "2026-02-09", "2026-02-16", "2026-02-23",
    "2026-03-02", "2026-03-09", "2026-03-16",
  ];
  // ACT 320 - Fri, Farid: 5 present, 2 absent
  const actAttendance = ["PRESENT","PRESENT","PRESENT","ABSENT","PRESENT","ABSENT","PRESENT"];
  for (let i = 0; i < sessionDates.length; i++) {
    const sess = await prisma.attendanceSession.upsert({
      where: { sectionId_sessionDate: { sectionId: secACT.id, sessionDate: new Date(sessionDates[i]) } },
      update: {},
      create: {
        sectionId: secACT.id,
        sessionDate: new Date(sessionDates[i]),
        dayOfWeek: "FRIDAY",
        startTime: "17:00",
        endTime: "18:00",
      },
    });
    await prisma.attendanceRecord.upsert({
      where: { sessionId_studentId: { sessionId: sess.id, studentId: studentProfile.id } },
      update: {},
      create: { sessionId: sess.id, studentId: studentProfile.id, value: actAttendance[i] as any },
    });
  }

  // Update attendance summaries for Farid
  const summaryData = [
    { sectionId: secACT.id, present: 5, absent: 2 },
    { sectionId: secCOM.id, present: 12, absent: 1 },
    { sectionId: secFIN330.id, present: 11, absent: 2 },
    { sectionId: secFIN420.id, present: 10, absent: 3 },
    { sectionId: secSCM.id, present: 11, absent: 2 },
  ];
  for (const s of summaryData) {
    await prisma.attendanceSummary.upsert({
      where: { studentId_sectionId: { studentId: studentProfile.id, sectionId: s.sectionId } },
      update: { presentCount: s.present, absentCount: s.absent },
      create: {
        studentId: studentProfile.id,
        sectionId: s.sectionId,
        presentCount: s.present,
        absentCount: s.absent,
        warningLevel: "NONE",
      },
    });
  }
  console.log("  Attendance seeded");

  // ─── Grades (sample published for the submitted assignment) ───
  const submittedAssignment = await prisma.assignment.findFirst({
    where: { title: "Persuasive Speech Outline" },
  });
  if (submittedAssignment) {
    await prisma.gradeAttempt.upsert({
      where: {
        id: `seed-grade-${submittedAssignment.id}-${studentProfile.id}`,
      },
      update: {},
      create: {
        id: `seed-grade-${submittedAssignment.id}-${studentProfile.id}`,
        studentId: studentProfile.id,
        sectionId: secCOM.id,
        assignmentId: submittedAssignment.id,
        attemptNumber: 1,
        numericGrade: 82,
        letterGrade: "B",
        isPublished: true,
        publishedAt: new Date("2026-03-18"),
        gradedById: instHakimi.profile.id,
      },
    });
  }
  console.log("  Grades seeded");

  // ─── Finance ──────────────────────────────────────────────────
  const finAccount = await prisma.studentFinanceAccount.upsert({
    where: { studentId: studentProfile.id },
    update: {},
    create: { studentId: studentProfile.id },
  });

  const finEntries = [
    { term: spring2026.id, type: "TUITION" as const, desc: "Tuition – Spring 2026", amount: 4500, currency: "USD" as const, status: "PARTIALLY_PAID" as const },
    { term: spring2026.id, type: "CHARGE" as const, desc: "Registration Fee", amount: 150, currency: "USD" as const, status: "PAID" as const },
    { term: spring2026.id, type: "PAYMENT" as const, desc: "Payment received", amount: -2000, currency: "USD" as const, status: "PAID" as const },
    { term: spring2026.id, type: "TUITION" as const, desc: "Tuition – Spring 2026 (LBP)", amount: 45000000, currency: "LBP" as const, status: "PARTIALLY_PAID" as const },
    { term: spring2026.id, type: "PAYMENT" as const, desc: "LBP Payment", amount: -30000000, currency: "LBP" as const, status: "PAID" as const },
    { term: fall2025.id, type: "TUITION" as const, desc: "Tuition – Fall 2025", amount: 4500, currency: "USD" as const, status: "PAID" as const },
    { term: fall2025.id, type: "PAYMENT" as const, desc: "Full payment", amount: -4500, currency: "USD" as const, status: "PAID" as const },
    { term: fall2025.id, type: "SCHOLARSHIP" as const, desc: "Merit scholarship", amount: -500, currency: "USD" as const, status: "SCHOLARSHIP_APPLIED" as const },
  ];

  for (const entry of finEntries) {
    const exists = await prisma.financeLedgerEntry.findFirst({
      where: { accountId: finAccount.id, description: entry.desc, termId: entry.term },
    });
    if (!exists) {
      await prisma.financeLedgerEntry.create({
        data: {
          accountId: finAccount.id,
          termId: entry.term,
          entryType: entry.type,
          description: entry.desc,
          amount: entry.amount,
          currency: entry.currency,
          status: entry.status,
        },
      });
    }
  }
  console.log("  Finance seeded");

  // ─── Announcements ────────────────────────────────────────────
  const announcementData = [
    { title: "Spring 2026 Registration Open", body: "Course registration for the Spring 2026 semester is now open. Please consult your academic advisor before registering.", date: "2026-03-18" },
    { title: "Library Extended Hours", body: "The university library will operate extended hours during midterm week: 7:00 AM – 11:00 PM.", date: "2026-03-17" },
    { title: "Career Fair – March 28", body: "Join us at the annual Career Fair in the Main Auditorium. Over 40 companies will be present.", date: "2026-03-15" },
    { title: "Midterm Grade Submission Deadline", body: "Faculty must submit midterm grades by March 25. Students can view grades in the portal starting March 27.", date: "2026-03-14" },
  ];

  for (const ann of announcementData) {
    const exists = await prisma.announcement.findFirst({ where: { title: ann.title } });
    if (!exists) {
      await prisma.announcement.create({
        data: {
          title: ann.title,
          body: ann.body,
          scope: "GLOBAL",
          createdById: instAssaf.profile.id,
          status: "PUBLISHED",
          publishedAt: new Date(ann.date),
        },
      });
    }
  }
  console.log("  Announcements seeded");

  // ─── Calendar Events ──────────────────────────────────────────
  // Exam calendar events
  for (const e of examData) {
    const exists = await prisma.calendarEvent.findFirst({
      where: { title: e.title, eventType: "EXAM" },
    });
    if (!exists) {
      await prisma.calendarEvent.create({
        data: {
          title: e.title,
          eventType: "EXAM",
          eventDate: new Date(e.date),
          startTime: e.start,
          endTime: e.end,
          sectionId: e.section.id,
          courseCode: e.course.code,
        },
      });
    }
  }

  // Holiday
  const holiday = await prisma.calendarEvent.findFirst({ where: { title: "Spring Break" } });
  if (!holiday) {
    await prisma.calendarEvent.create({
      data: {
        title: "Spring Break",
        description: "University closed for spring break",
        eventType: "HOLIDAY",
        eventDate: new Date("2026-04-06"),
      },
    });
  }
  console.log("  Calendar events seeded");

  // ─── Notifications ────────────────────────────────────────────
  const notifExists = await prisma.notification.findFirst({ where: { userId: studentUser.id } });
  if (!notifExists) {
    await prisma.notification.createMany({
      data: [
        { userId: studentUser.id, type: "ANNOUNCEMENT_RELEASE", title: "Spring 2026 Registration Open", body: "Course registration is now open." },
        { userId: studentUser.id, type: "ASSIGNMENT_REMINDER", title: "Assignment Due: Variance Analysis Report", body: "Due on March 24, 2026." },
        { userId: studentUser.id, type: "EXAM_REMINDER", title: "Upcoming: Midterm – Managerial Accounting", body: "Scheduled for March 25, 2026." },
      ],
    });
  }
  console.log("  Notifications seeded");

  // ─── Section Materials ────────────────────────────────────────
  const materialSections = [
    { sectionId: secACT.id, title: "Syllabus – ACT 320", type: "SYLLABUS" as const },
    { sectionId: secACT.id, title: "Chapter 8: Standard Costing", type: "CHAPTER_MATERIAL" as const },
    { sectionId: secCOM.id, title: "Syllabus – COM 206", type: "SYLLABUS" as const },
    { sectionId: secCOM.id, title: "Chapter 5: Persuasive Speaking", type: "CHAPTER_MATERIAL" as const },
    { sectionId: secFIN330.id, title: "Syllabus – FIN 330", type: "SYLLABUS" as const },
    { sectionId: secFIN330.id, title: "Chapter 4: Ratio Analysis", type: "CHAPTER_MATERIAL" as const },
    { sectionId: secFIN420.id, title: "Syllabus – FIN 420", type: "SYLLABUS" as const },
    { sectionId: secSCM.id, title: "Syllabus – SCM 400", type: "SYLLABUS" as const },
  ];

  for (const m of materialSections) {
    const exists = await prisma.sectionMaterial.findFirst({ where: { sectionId: m.sectionId, title: m.title } });
    if (!exists) {
      await prisma.sectionMaterial.create({
        data: {
          sectionId: m.sectionId,
          title: m.title,
          materialType: m.type,
          status: "PUBLISHED",
          publishedAt: new Date("2026-01-27"),
        },
      });
    }
  }
  console.log("  Materials seeded");

  console.log("\nSeed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
