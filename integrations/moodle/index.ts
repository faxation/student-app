/**
 * Moodle integration — public API.
 *
 * Orchestrates auth → fetch → map into a single sync operation.
 * Returns fully normalized MoodleSyncData for the UI layer.
 */

export { getToken, MoodleAuthError } from "./auth";
export { MoodleApiClientError } from "./client";

import { getToken } from "./auth";
import {
  fetchSiteInfo,
  fetchCourses,
  fetchAssignments,
  fetchUpcomingEvents,
  fetchSubmissionStatuses,
} from "./fetchers";
import {
  mapProfile,
  mapCourses,
  mapAssignments,
  mapCalendarEvents,
  extractExams,
} from "./mappers";
import type { MoodleSyncData } from "@/lib/domain/types";

/**
 * Perform a full Moodle data sync.
 * Fetches all available data, maps to domain types, and returns a
 * consolidated payload. Tolerates partial failures gracefully.
 */
export async function syncMoodleData(): Promise<MoodleSyncData> {
  const errors: string[] = [];
  const baseUrl = process.env.MOODLE_BASE_URL ?? "https://lms.uls.edu.lb";

  // 1. Authenticate
  const token = await getToken();

  // 2. Fetch site info (get userId)
  const siteInfo = await fetchSiteInfo(token);
  const userId = siteInfo.userid;
  const profile = mapProfile(siteInfo);

  // 3. Fetch courses
  let courses: MoodleSyncData["courses"] = [];
  let rawCourseIds: number[] = [];
  try {
    const rawCourses = await fetchCourses(token, userId);
    courses = mapCourses(rawCourses, baseUrl);
    rawCourseIds = rawCourses.filter((c) => c.visible !== 0).map((c) => c.id);
  } catch (e) {
    errors.push(`Courses: ${e instanceof Error ? e.message : "Unknown error"}`);
  }

  // 4. Fetch assignments + submission statuses
  let assignments: MoodleSyncData["assignments"] = [];
  if (rawCourseIds.length > 0) {
    try {
      const rawAssignments = await fetchAssignments(token, rawCourseIds);

      // Collect all assignment IDs for batch status fetch
      const allAssignIds: number[] = [];
      for (const course of rawAssignments.courses) {
        for (const assign of course.assignments) {
          allAssignIds.push(assign.id);
        }
      }

      // Fetch submission statuses in parallel
      const statuses = await fetchSubmissionStatuses(token, allAssignIds);

      // Map each course's assignments
      for (const course of rawAssignments.courses) {
        const mapped = mapAssignments(
          course.assignments,
          course.fullname,
          course.shortname,
          statuses,
          baseUrl,
        );
        assignments.push(...mapped);
      }
    } catch (e) {
      errors.push(`Assignments: ${e instanceof Error ? e.message : "Unknown error"}`);
    }
  }

  // 5. Fetch calendar / action events
  let calendarEvents: MoodleSyncData["calendarEvents"] = [];
  let exams: MoodleSyncData["exams"] = [];
  try {
    const rawEvents = await fetchUpcomingEvents(token, 90);
    calendarEvents = mapCalendarEvents(rawEvents);
    exams = extractExams(rawEvents);
  } catch (e) {
    errors.push(`Calendar: ${e instanceof Error ? e.message : "Unknown error"}`);
  }

  return {
    profile,
    courses,
    assignments,
    calendarEvents,
    exams,
    announcements: [], // Forum-based announcements require per-course fetching — future enhancement
    syncedAt: new Date().toISOString(),
    errors,
  };
}
