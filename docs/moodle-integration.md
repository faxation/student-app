# Moodle Integration

## Overview

The Student App integrates with the ULS Moodle LMS (`lms.uls.edu.lb`) via the **Moodle Web Services REST API** using the `moodle_mobile_ws` service. This is the official, supported API — no scraping or HTML parsing is required.

## Architecture

```
┌─────────────┐    POST /api/moodle/sync    ┌──────────────────┐
│  Browser UI  │ ──────────────────────────► │  Next.js API      │
│  (React)     │ ◄────── MoodleSyncData ──── │  Route Handler    │
└─────────────┘                              └────────┬─────────┘
                                                      │
                                          ┌───────────▼───────────┐
                                          │  integrations/moodle/  │
                                          │  ├── auth.ts          │ ─► /login/token.php
                                          │  ├── client.ts        │ ─► /webservice/rest/server.php
                                          │  ├── fetchers.ts      │    (WS functions)
                                          │  ├── mappers.ts       │ ─► Domain models
                                          │  └── types.ts         │    (Raw Moodle types)
                                          └───────────────────────┘
```

### Key design principles
- **Credentials are server-side only** — stored in `.env.local`, never sent to the browser
- **Clear separation** — raw Moodle types → mappers → domain types → UI
- **UI never imports from `integrations/moodle/`** — only from `lib/domain/types.ts` via the `useMoodle()` hook
- **Graceful degradation** — if sync fails or data is partial, the app falls back to mock data

## What Data Comes from Moodle

| App Section | Moodle WS Function | Data Available |
|---|---|---|
| **Home** | Multiple | Student name, courses count, assignment deadlines, calendar events |
| **Courses** | `core_enrol_get_users_courses` | Course name, short code, progress %, last access, course link |
| **Assignments** | `mod_assign_get_assignments` + `mod_assign_get_submission_status` | Title, due date, submission status (pending/submitted/late/draft), course, link |
| **Calendar** | `core_calendar_get_action_events_by_timesort` | Upcoming action events (assignments, quizzes, deadlines) |
| **Exams** | Inferred from calendar events | Quiz modules and events with exam-related keywords |

## What Does NOT Come from Moodle

| Data | Reason |
|---|---|
| **Finance / Tuition** | Moodle has no financial data. Requires SIS integration. |
| **Announcements** | Would require per-course forum fetching (`mod_forum_get_forum_discussions`). Planned for future. |
| **Course instructor** | Not returned by `core_enrol_get_users_courses`. Would need `core_user_get_course_user_profiles` per course. |
| **Course schedule/room** | Not available from Moodle API. Requires SIS/timetable integration. |
| **Attendance** | Requires `mod_attendance` plugin which may not be enabled. |
| **GPA** | Not available from Moodle. Requires SIS integration. |
| **Exam rooms/locations** | Not available. Only quiz module info (online) is available. |

## Setup

### 1. Create `.env.local`

```bash
cp .env.example .env.local
```

Edit `.env.local` with your real credentials:

```
MOODLE_BASE_URL=https://lms.uls.edu.lb
MOODLE_USERNAME=your_student_id
MOODLE_PASSWORD=your_password
```

### 2. Run the app

```bash
npm run dev
```

### 3. Trigger sync

Click the **"Sync Moodle"** button in the top-right header. The app will:
1. Authenticate with Moodle to get a temporary token
2. Fetch your courses, assignments, calendar events
3. Fetch submission statuses for each assignment
4. Normalize all data into app domain types
5. Display real data in Home, Courses, Assignments, Calendar, and Exams

## Security Precautions

- **Credentials are in `.env.local` only** — this file is in `.gitignore` and is never committed
- **Token is transient** — acquired per sync request, not persisted to disk
- **Server-side only** — all Moodle API calls happen in the API route (`app/api/moodle/sync/route.ts`), never in browser code
- **No logging of secrets** — error messages never include credentials
- **`.env.example`** contains placeholders only

## API Flow

```
1. POST /api/moodle/sync
2. → auth.getToken() → POST /login/token.php → receive wstoken
3. → fetchSiteInfo(token) → get userId, username, full name
4. → fetchCourses(token, userId) → get enrolled courses
5. → fetchAssignments(token, courseIds[]) → get assignments per course
6. → fetchSubmissionStatuses(token, assignIds[]) → get submission status per assignment (parallel)
7. → fetchUpcomingEvents(token) → get calendar action events (next 90 days)
8. → mappers convert all raw data → domain types
9. → Return MoodleSyncData to client
```

## Known Limitations

1. **Single sync per click** — data is held in React state and lost on page refresh. Future: localStorage persistence.
2. **No real-time updates** — you must click Sync to refresh. Future: background polling.
3. **Announcement extraction not implemented** — requires iterating over all courses and fetching forum posts.
4. **Instructor names not resolved** — would require additional API calls per course.
5. **Exam detection is heuristic** — relies on quiz modules and keyword matching in event names.
6. **Moodle Workplace restrictions** — the admin may have disabled certain WS functions. If a function fails, the app logs the error and continues with partial data.
7. **Rate limiting** — if you have many courses with many assignments, the parallel submission-status fetches may hit server limits.

## Files

| File | Purpose |
|---|---|
| `integrations/moodle/types.ts` | Raw Moodle API response TypeScript types |
| `integrations/moodle/auth.ts` | Token acquisition from env vars |
| `integrations/moodle/client.ts` | Generic REST API client with error handling |
| `integrations/moodle/fetchers.ts` | High-level data fetchers (courses, assignments, events) |
| `integrations/moodle/mappers.ts` | Raw Moodle → domain type conversion |
| `integrations/moodle/index.ts` | Public API + `syncMoodleData()` orchestrator |
| `lib/domain/types.ts` | Normalized domain models consumed by UI |
| `lib/moodle-context.tsx` | React context for Moodle sync state |
| `app/api/moodle/sync/route.ts` | Server-side API route handler |
| `.env.example` | Placeholder environment variables |
