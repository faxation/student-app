/**
 * Mappers: convert raw Moodle API types → normalized app domain types.
 * All null-safety and defensive parsing happens here.
 */

import type {
  MoodleSiteInfo,
  MoodleCourse,
  MoodleAssignment,
  MoodleCalendarEvent,
  MoodleSubmissionStatus,
} from "./types";

import type {
  DomainStudentProfile,
  DomainCourse,
  DomainAssignment,
  DomainCalendarEvent,
  DomainExam,
} from "@/lib/domain/types";

// ─── Helpers ─────────────────────────────────────────────────────

function unixToDateStr(ts: number): string {
  if (!ts || ts <= 0) return "";
  return new Date(ts * 1000).toISOString().split("T")[0];
}

function unixToTimeStr(ts: number): string {
  if (!ts || ts <= 0) return "";
  const d = new Date(ts * 1000);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function stripHtml(html: string): string {
  return html?.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() ?? "";
}

function durationStr(seconds: number): string {
  if (!seconds || seconds <= 0) return "N/A";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h} hour${h > 1 ? "s" : ""}`;
  return `${m} min`;
}

const EXAM_KEYWORDS = /\b(exam|midterm|final|quiz|test|assessment)\b/i;

// ─── Profile ─────────────────────────────────────────────────────

export function mapProfile(info: MoodleSiteInfo): DomainStudentProfile {
  return {
    id: String(info.userid),
    displayName: info.fullname || `${info.firstname} ${info.lastname}`,
    firstName: info.firstname || "",
    lastName: info.lastname || "",
    username: info.username || "",
    avatarUrl: info.userpictureurl || undefined,
    source: "moodle",
  };
}

// ─── Courses ─────────────────────────────────────────────────────

export function mapCourses(
  raw: MoodleCourse[],
  baseUrl: string,
): DomainCourse[] {
  return raw
    .filter((c) => c.visible !== 0)
    .map((c) => ({
      id: String(c.id),
      title: c.fullname || c.displayname || c.shortname,
      shortCode: c.shortname || "",
      instructor: "", // Not available from core_enrol_get_users_courses
      category: c.category ? String(c.category) : "",
      progress: typeof c.progress === "number" ? Math.round(c.progress) : null,
      link: `${baseUrl}/course/view.php?id=${c.id}`,
      lastAccess: c.lastaccess ? unixToDateStr(c.lastaccess) : null,
      source: "moodle" as const,
    }));
}

// ─── Assignments ─────────────────────────────────────────────────

export function mapAssignments(
  assignments: MoodleAssignment[],
  courseFullName: string,
  courseShortName: string,
  submissionStatuses: Map<number, MoodleSubmissionStatus>,
  baseUrl: string,
): DomainAssignment[] {
  return assignments.map((a) => {
    const sub = submissionStatuses.get(a.id);
    const submissionStatus = sub?.lastattempt?.submission?.status;
    const isGraded = sub?.lastattempt?.graded === true;
    const dueDateTs = a.duedate;
    const now = Math.floor(Date.now() / 1000);

    let status: DomainAssignment["status"] = "unknown";
    if (submissionStatus === "submitted" || isGraded) {
      status = "submitted";
    } else if (submissionStatus === "draft") {
      status = "draft";
    } else if (dueDateTs > 0 && now > dueDateTs) {
      status = "late";
    } else {
      status = "pending";
    }

    return {
      id: String(a.id),
      title: a.name || "Untitled Assignment",
      courseId: String(a.course),
      courseName: courseFullName,
      courseCode: courseShortName,
      dueDate: dueDateTs > 0 ? unixToDateStr(dueDateTs) : "",
      status,
      description: stripHtml(a.intro || ""),
      link: `${baseUrl}/mod/assign/view.php?id=${a.cmid}`,
      source: "moodle",
    };
  });
}

// ─── Calendar Events ─────────────────────────────────────────────

export function mapCalendarEvents(
  events: MoodleCalendarEvent[],
): DomainCalendarEvent[] {
  return events.map((e) => {
    let type: DomainCalendarEvent["type"] = "event";
    const modName = e.modulename?.toLowerCase() ?? "";
    const name = e.name?.toLowerCase() ?? "";

    if (modName === "assign" || e.eventtype === "due") {
      type = "assignment";
    } else if (modName === "quiz") {
      type = "quiz";
    } else if (EXAM_KEYWORDS.test(name)) {
      type = "exam";
    } else if (e.eventtype === "course") {
      type = "event";
    }

    return {
      id: String(e.id),
      title: e.name || "Untitled Event",
      date: unixToDateStr(e.timestart),
      time: unixToTimeStr(e.timestart),
      endTime:
        e.timeduration > 0
          ? unixToTimeStr(e.timestart + e.timeduration)
          : null,
      type,
      relatedCourseCode: e.course?.shortname ?? null,
      relatedCourseName: e.course?.fullname ?? null,
      link: e.url || null,
      source: "moodle",
    };
  });
}

// ─── Exams (inferred from calendar events and quiz modules) ──────

export function extractExams(
  events: MoodleCalendarEvent[],
): DomainExam[] {
  return events
    .filter((e) => {
      const modName = e.modulename?.toLowerCase() ?? "";
      const name = e.name?.toLowerCase() ?? "";
      return modName === "quiz" || EXAM_KEYWORDS.test(name);
    })
    .map((e) => {
      const modName = e.modulename?.toLowerCase() ?? "";
      const name = e.name?.toLowerCase() ?? "";

      let examType: DomainExam["type"] = "exam";
      let confidence: DomainExam["confidence"] = "medium";

      if (modName === "quiz") {
        examType = "quiz";
        confidence = "high";
      }
      if (/midterm/i.test(name)) {
        examType = "midterm";
        confidence = "high";
      } else if (/final/i.test(name)) {
        examType = "final";
        confidence = "high";
      } else if (/quiz/i.test(name) || modName === "quiz") {
        examType = "quiz";
        confidence = "high";
      }

      return {
        id: String(e.id),
        title: e.name || "Untitled Exam",
        courseName: e.course?.fullname ?? "",
        courseCode: e.course?.shortname ?? "",
        date: unixToDateStr(e.timestart),
        time: unixToTimeStr(e.timestart),
        duration: durationStr(e.timeduration),
        locationOrFormat: modName === "quiz" ? "Online (Moodle)" : "See Moodle",
        type: examType,
        source: "moodle" as const,
        confidence,
      };
    });
}
