/**
 * Raw Moodle API response types.
 * These map directly to the JSON returned by Moodle Web Services.
 * They are NOT used by the UI — see lib/domain/types.ts for app models.
 */

// ─── Auth ────────────────────────────────────────────────────────

export interface MoodleTokenResponse {
  token?: string;
  privatetoken?: string;
  error?: string;
  errorcode?: string;
}

// ─── Site Info ───────────────────────────────────────────────────

export interface MoodleSiteInfo {
  sitename: string;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  lang: string;
  userid: number;
  siteurl: string;
  userpictureurl: string;
  functions: { name: string; version: string }[];
  release: string;
  version: string;
}

// ─── Courses ─────────────────────────────────────────────────────

export interface MoodleCourse {
  id: number;
  shortname: string;
  fullname: string;
  displayname: string;
  enrolledusercount?: number;
  idnumber: string;
  visible: number;
  summary: string;
  summaryformat: number;
  format: string;
  category?: number;
  progress?: number | null;
  completed?: boolean;
  startdate: number;
  enddate: number;
  marker?: number;
  lastaccess?: number;
  isfavourite?: boolean;
  hidden?: boolean;
  overviewfiles?: { filename: string; fileurl: string; filesize: number; timemodified: number }[];
}

// ─── Assignments ─────────────────────────────────────────────────

export interface MoodleAssignmentsResponse {
  courses: MoodleAssignmentCourse[];
  warnings?: MoodleWarning[];
}

export interface MoodleAssignmentCourse {
  id: number;
  fullname: string;
  shortname: string;
  assignments: MoodleAssignment[];
}

export interface MoodleAssignment {
  id: number;
  cmid: number;
  course: number;
  name: string;
  nosubmissions: number;
  submissiondrafts: number;
  sendnotifications: number;
  sendlatenotifications: number;
  sendstudentnotifications: number;
  duedate: number;
  allowsubmissionsfromdate: number;
  grade: number;
  timemodified: number;
  completionsubmit: number;
  cutoffdate: number;
  gradingduedate: number;
  teamsubmission: number;
  requireallteammemberssubmit: number;
  teamsubmissiongroupingid: number;
  blindmarking: number;
  hidegrader: number;
  revealidentities: number;
  attemptreopenmethod: string;
  maxattempts: number;
  markingworkflow: number;
  markingallocation: number;
  requiresubmissionstatement: number;
  configs: { plugin: string; subtype: string; name: string; value: string }[];
  intro: string;
  introformat: number;
  introfiles: { filename: string; fileurl: string }[];
  introattachments?: { filename: string; fileurl: string }[];
}

export interface MoodleSubmissionStatus {
  lastattempt?: {
    submission?: {
      id: number;
      userid: number;
      status: string; // "new" | "submitted" | "draft"
      timecreated: number;
      timemodified: number;
      timestarted: number;
    };
    submissiongroupmemberswhoneedtosubmit?: unknown[];
    graded?: boolean;
    gradingstatus?: string;
  };
  feedback?: {
    grade?: {
      grade: string;
      gradefordisplay: string;
    };
  };
  warnings?: MoodleWarning[];
}

// ─── Calendar Events ─────────────────────────────────────────────

export interface MoodleCalendarEventsResponse {
  events: MoodleCalendarEvent[];
  warnings?: MoodleWarning[];
}

export interface MoodleCalendarEvent {
  id: number;
  name: string;
  description: string;
  descriptionformat: number;
  categoryid?: number;
  groupid?: number;
  userid?: number;
  repeatid?: number;
  eventcount?: number;
  component?: string;
  modulename?: string;
  activityname?: string;
  activitystr?: string;
  instance?: number;
  eventtype: string; // "user" | "site" | "course" | "due" | "open" | "close" | "category"
  timestart: number;
  timeduration: number;
  timesort?: number;
  timeusermidnight?: number;
  visible: number;
  timemodified: number;
  subscriptionid?: number;
  course?: MoodleEventCourse;
  canedit?: boolean;
  candelete?: boolean;
  url: string;
  action?: {
    name: string;
    url: string;
    itemcount: number;
    actionable: boolean;
    showitemcount: boolean;
  };
}

export interface MoodleEventCourse {
  id: number;
  fullname: string;
  shortname: string;
  idnumber: string;
  summary: string;
  summaryformat: number;
}

// ─── Action Events (timeline) ────────────────────────────────────

export interface MoodleActionEventsResponse {
  events: MoodleCalendarEvent[];
  firstid: number;
  lastid: number;
}

// ─── Grades ──────────────────────────────────────────────────────

export interface MoodleGradeItemsResponse {
  usergrades: MoodleUserGrade[];
  warnings?: MoodleWarning[];
}

export interface MoodleUserGrade {
  courseid: number;
  courseidnumber: string;
  userid: number;
  userfullname: string;
  gradeitems: MoodleGradeItem[];
}

export interface MoodleGradeItem {
  id: number;
  itemname: string;
  itemtype: string;
  itemmodule?: string;
  iteminstance?: number;
  itemnumber?: number;
  categoryid?: number;
  outcomeid?: number;
  scaleid?: number;
  graderaw?: number | null;
  gradedatesubmitted?: number;
  gradedategraded?: number;
  grademin: number;
  grademax: number;
  gradeformatted: string;
  percentageformatted: string;
  feedback: string;
  feedbackformat: number;
}

// ─── Course Content ──────────────────────────────────────────────

export interface MoodleCourseSection {
  id: number;
  name: string;
  visible: number;
  summary: string;
  summaryformat: number;
  section: number;
  hiddenbynumsections: number;
  uservisible: boolean;
  modules: MoodleCourseModule[];
}

export interface MoodleCourseModule {
  id: number;
  url?: string;
  name: string;
  instance: number;
  contextid: number;
  visible: number;
  uservisible: boolean;
  visibleoncoursepage: number;
  modicon: string;
  modname: string; // "assign", "quiz", "forum", "resource", "url", "page", etc.
  modplural: string;
  indent: number;
  onclick: string;
  afterlink?: string;
  customdata?: string;
  noviewlink?: boolean;
  completion?: number;
  completiondata?: {
    state: number; // 0=incomplete, 1=complete, 2=complete-pass, 3=complete-fail
    timecompleted: number;
    overrideby?: number;
    valueused?: boolean;
  };
  dates?: { label: string; timestamp: number }[];
  contents?: { type: string; filename: string; fileurl: string; filesize: number; timemodified: number }[];
}

// ─── Common ──────────────────────────────────────────────────────

export interface MoodleWarning {
  item?: string;
  itemid?: number;
  warningcode: string;
  message: string;
}

export interface MoodleApiError {
  exception?: string;
  errorcode?: string;
  message?: string;
  debuginfo?: string;
}
