export interface InstructorProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  instructorId: string;
  department: string;
  title: string;
  avatarInitials: string;
}

export interface InstructorCourse {
  id: string;
  code: string;
  name: string;
  term: string;
  credits: number;
  sectionCount: number;
}

export interface InstructorSection {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  label: string;
  meetingTime: string;
  enrolledCount: number;
}

export interface InstructorAssignment {
  id: string;
  title: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  sectionId: string;
  sectionLabel: string;
  dueDate: string;
  weight: number;
  hasFile: boolean;
  status: "published" | "draft";
}

export interface InstructorExam {
  id: string;
  title: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  sectionId: string;
  sectionLabel: string;
  hasFile: boolean;
  fileType: string;
  createdDate: string;
}

export interface SectionStudent {
  id: string;
  name: string;
  studentId: string;
}

export interface GradeEntry {
  studentId: string;
  grade: string;
}
