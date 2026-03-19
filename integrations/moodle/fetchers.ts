/**
 * High-level data fetchers — each function calls one or more Moodle WS
 * functions and returns raw Moodle-typed data.
 *
 * These are consumed by mappers.ts to produce normalized app models.
 */

import { callFunction } from "./client";
import type {
  MoodleSiteInfo,
  MoodleCourse,
  MoodleAssignmentsResponse,
  MoodleActionEventsResponse,
  MoodleCalendarEvent,
  MoodleSubmissionStatus,
  MoodleCourseSection,
} from "./types";

// ─── Site Info & User ────────────────────────────────────────────

export async function fetchSiteInfo(token: string): Promise<MoodleSiteInfo> {
  return callFunction<MoodleSiteInfo>(token, "core_webservice_get_site_info");
}

// ─── Courses ─────────────────────────────────────────────────────

export async function fetchCourses(
  token: string,
  userId: number,
): Promise<MoodleCourse[]> {
  return callFunction<MoodleCourse[]>(token, "core_enrol_get_users_courses", {
    userid: userId,
  });
}

// ─── Course Contents ─────────────────────────────────────────────

export async function fetchCourseContents(
  token: string,
  courseId: number,
): Promise<MoodleCourseSection[]> {
  return callFunction<MoodleCourseSection[]>(
    token,
    "core_course_get_contents",
    { courseid: courseId },
  );
}

// ─── Assignments ─────────────────────────────────────────────────

export async function fetchAssignments(
  token: string,
  courseIds: number[],
): Promise<MoodleAssignmentsResponse> {
  const params: Record<string, string | number> = {};
  courseIds.forEach((id, i) => {
    params[`courseids[${i}]`] = id;
  });
  return callFunction<MoodleAssignmentsResponse>(
    token,
    "mod_assign_get_assignments",
    params,
  );
}

export async function fetchSubmissionStatus(
  token: string,
  assignId: number,
): Promise<MoodleSubmissionStatus> {
  return callFunction<MoodleSubmissionStatus>(
    token,
    "mod_assign_get_submission_status",
    { assignid: assignId },
  );
}

// ─── Calendar / Action Events ────────────────────────────────────

export async function fetchUpcomingEvents(
  token: string,
  lookAheadDays: number = 60,
): Promise<MoodleCalendarEvent[]> {
  try {
    // Try the newer action-events endpoint first (more useful: deadlines, quizzes)
    const res = await callFunction<MoodleActionEventsResponse>(
      token,
      "core_calendar_get_action_events_by_timesort",
      {
        timesortfrom: Math.floor(Date.now() / 1000),
        timesortto: Math.floor(Date.now() / 1000) + lookAheadDays * 86400,
        limitnum: 50,
      },
    );
    return res.events ?? [];
  } catch {
    // Fallback to legacy calendar events
    try {
      const res = await callFunction<{ events: MoodleCalendarEvent[] }>(
        token,
        "core_calendar_get_calendar_upcoming_view",
      );
      return res.events ?? [];
    } catch {
      return [];
    }
  }
}

// ─── Batch fetch submission statuses for a set of assignments ────

export async function fetchSubmissionStatuses(
  token: string,
  assignIds: number[],
): Promise<Map<number, MoodleSubmissionStatus>> {
  const results = new Map<number, MoodleSubmissionStatus>();

  // Fetch in parallel, but tolerate individual failures
  const settled = await Promise.allSettled(
    assignIds.map(async (id) => {
      const status = await fetchSubmissionStatus(token, id);
      return { id, status };
    }),
  );

  for (const result of settled) {
    if (result.status === "fulfilled") {
      results.set(result.value.id, result.value.status);
    }
  }

  return results;
}
