# API Plan

> V1 endpoint reference — all routes are Next.js API Route Handlers under `app/api/`.

---

## Authentication

All endpoints except login require a valid `session_token` cookie. Sessions have a 5-minute sliding expiration window.

### Student Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/student/auth/login` | Login with studentId + password → sets cookie |
| POST | `/api/student/auth/logout` | Destroy session, clear cookie |
| GET | `/api/student/auth/session` | Validate session, return student profile or null |

### Instructor Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/instructor/auth/login` | Login with username + password → sets cookie |
| POST | `/api/instructor/auth/logout` | Destroy session, clear cookie |
| GET | `/api/instructor/auth/session` | Validate session, return instructor profile or null |

---

## Student Endpoints (Read-Only)

All require `requireStudent()` guard.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/student/home` | Dashboard: today's classes, deadlines, announcements, quick stats |
| GET | `/api/student/courses` | Enrolled courses with attendance summaries |
| GET | `/api/student/courses/[sectionId]` | Section detail: materials, participants, grades |
| GET | `/api/student/assignments` | Published assignments for enrolled sections |
| GET | `/api/student/assignments/[id]` | Assignment detail |
| GET | `/api/student/exams` | Published exams for enrolled sections |
| GET | `/api/student/exams/[id]` | Exam detail |
| GET | `/api/student/attendance` | Attendance summaries for all sections |
| GET | `/api/student/attendance/[sectionId]` | Detailed attendance records for a section |
| GET | `/api/student/grades` | Final grades overview |
| GET | `/api/student/grades/[sectionId]` | Grade attempts for a section |
| GET | `/api/student/finance` | Finance account + ledger entries |
| GET | `/api/student/calendar` | Calendar events |
| GET | `/api/student/notifications` | Notifications list |
| PATCH | `/api/student/notifications/[id]/read` | Mark notification as read |

---

## Instructor Endpoints

All require `requireInstructor()` guard. Write operations create audit log entries.

### Courses & Sections

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/instructor/courses` | Courses assigned to instructor with section counts |
| GET | `/api/instructor/courses/[sectionId]` | Section detail with roster |
| GET | `/api/instructor/sections` | All sections taught by instructor |
| GET | `/api/instructor/sections/[sectionId]` | Section detail |

### Assignments

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/instructor/assignments` | All assignments for instructor's sections |
| POST | `/api/instructor/assignments` | Create assignment (validates weight ≤ 90%) |
| GET | `/api/instructor/assignments/[id]` | Assignment detail |
| PATCH | `/api/instructor/assignments/[id]` | Update assignment |
| POST | `/api/instructor/assignments/[id]/publish` | Publish + notify students |
| POST | `/api/instructor/assignments/[id]/archive` | Archive assignment |

### Exams

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/instructor/exams` | All exams for instructor's sections |
| POST | `/api/instructor/exams` | Create exam (validates weight ≤ 90%) |
| GET | `/api/instructor/exams/[id]` | Exam detail |
| PATCH | `/api/instructor/exams/[id]` | Update exam |
| POST | `/api/instructor/exams/[id]/publish` | Publish + notify students |
| POST | `/api/instructor/exams/[id]/archive` | Archive exam |

### Materials

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/instructor/materials` | Materials for instructor's sections |
| POST | `/api/instructor/materials` | Create material |
| PATCH | `/api/instructor/materials/[id]` | Update material |
| DELETE | `/api/instructor/materials/[id]` | Soft-delete material |
| POST | `/api/instructor/materials/[id]/publish` | Publish material |

### Grades

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/instructor/grades/roster?sectionId=X` | Student roster with current grades |
| POST | `/api/instructor/grades/bulk-save` | Save grades for multiple students (skips AW) |
| POST | `/api/instructor/grades/publish` | Publish grades + notify students |

### Attendance

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/instructor/attendance?sectionId=X` | Attendance sessions + summaries |
| POST | `/api/instructor/attendance/sessions/[sessionId]/records` | Record attendance (triggers AW recompute) |
| PATCH | `/api/instructor/attendance/records/[id]` | Update single record (triggers AW recompute) |

### Announcements

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/instructor/announcements` | Instructor's announcements |
| POST | `/api/instructor/announcements` | Create announcement |
| PATCH | `/api/instructor/announcements/[id]` | Update announcement |
| POST | `/api/instructor/announcements/[id]/publish` | Publish + notify students |

### Files

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/instructor/file-library` | Instructor's file library |
| POST | `/api/instructor/files/upload` | Upload file (multipart/form-data) |

---

## Response Patterns

### Success
```json
{ "courses": [...] }
```

### Error
```json
{ "error": "Not enrolled" }
```
HTTP status codes: 400 (validation), 401 (unauthenticated), 403 (unauthorized), 404 (not found), 500 (server error).

### Auth Response
```json
{ "user": { "id": "...", "firstName": "...", ... } }
```
Returns `{ "user": null }` when not authenticated.
