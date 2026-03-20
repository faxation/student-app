# Data Model

> V1 Prisma schema reference — 20 enums, 34 models.

---

## Entity Relationship Overview

```
User (1) ──── (0..1) StudentProfile
     (1) ──── (0..1) InstructorProfile
     (1) ──── (*) Session

StudentProfile (1) ──── (*) SectionEnrollment
               (1) ──── (*) AttendanceRecord
               (1) ──── (*) AttendanceSummary
               (1) ──── (*) GradeAttempt
               (1) ──── (0..1) FinanceAccount

InstructorProfile (1) ──── (*) Section

Faculty (1) ──── (*) Program
Program (1) ──── (*) StudentProfile
Faculty (1) ──── (*) StudentProfile

Term (1) ──── (*) Section
Course (1) ──── (*) Section
Section (1) ──── (*) SectionMeeting
        (1) ──── (*) SectionEnrollment
        (1) ──── (*) Assignment
        (1) ──── (*) Exam
        (1) ──── (*) Material
        (1) ──── (*) AttendanceSession
        (1) ──── (*) Announcement

Assignment (1) ──── (*) GradeAttempt
Exam (1) ──── (*) GradeAttempt
```

## Enums

| Enum | Values |
|------|--------|
| UserRole | STUDENT, INSTRUCTOR, ADMIN |
| EnrollmentStatus | ENROLLED, WITHDRAWN, ACADEMICALLY_WITHDRAWN, COMPLETED, ADDED_TO_CART |
| AssignmentStatus | DRAFT, PUBLISHED, ARCHIVED |
| ExamStatus | DRAFT, PUBLISHED, ARCHIVED |
| MaterialType | SYLLABUS, CHAPTER_MATERIAL, GENERAL_FILE |
| MaterialStatus | DRAFT, PUBLISHED, ARCHIVED |
| AttendanceValue | PRESENT, ABSENT |
| WarningLevel | NONE, WARNING_4, WARNING_5, LAST_WARNING_6, AW_7 |
| CalendarEventType | CLASS, ASSIGNMENT_DUE, EXAM, HOLIDAY, OTHER |
| AnnouncementScope | SECTION, COURSE, PROGRAM, UNIVERSITY |
| AnnouncementStatus | DRAFT, PUBLISHED, ARCHIVED |
| FinanceLedgerType | CHARGE, PAYMENT, SCHOLARSHIP, DISCOUNT, REFUND |
| FinanceStatus | PENDING, COMPLETED, REVERSED |
| Currency | USD, LBP |
| NotificationType | ASSIGNMENT, EXAM, GRADE, ATTENDANCE, ANNOUNCEMENT, SYSTEM |
| FileVisibility | PRIVATE, SECTION, PUBLIC |
| SectionStatus | ACTIVE, CANCELLED, COMPLETED |
| SectionModality | IN_PERSON, ONLINE, HYBRID |
| DayOfWeek | MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY |
| TermStatus | UPCOMING, ACTIVE, COMPLETED |

## Core Models

### Identity

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **User** | id, email, passwordHash, role, fullName, avatarInitials | Central identity, role-based |
| **StudentProfile** | studentId, gpa, creditsCompleted, creditsRequired | Linked to User, Faculty, Program |
| **InstructorProfile** | department, teachingRoleLabel | Linked to User |
| **Session** | token (UUID), userId, expiresAt | 5-min sliding window |

### Academic Structure

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **Faculty** | code, name | e.g., "SOB" — School of Business |
| **Program** | code, name, facultyId | e.g., "BBA" — Bachelor of Business Admin |
| **Term** | code, name, startDate, endDate, status | e.g., "SP2026" |
| **Course** | code, name, credits | e.g., "ACT 320" |
| **Section** | number, courseId, termId, instructorId, status, modality | e.g., Section 1 of ACT 320 |
| **SectionMeeting** | sectionId, dayOfWeek, startTime, endTime, room | Recurring class times |
| **SectionEnrollment** | studentId, sectionId, status | Unique per student-section pair |

### Assignments & Exams

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **Assignment** | title, sectionId, courseId, dueDate, weightPercent, status, assignmentNumber | Auto-incrementing number per course |
| **Exam** | title, sectionId, courseId, examDate, startTime, endTime, location, weightPercent, examType, status | |

### Materials & Files

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **Material** | title, sectionId, materialType, status | Linked to files via MaterialFile |
| **File** | originalName, storagePath, mimeType, sizeBytes, uploaderId | Uploaded via storage adapter |
| **MaterialFile** | materialId, fileId | Join table |

### Grades

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **GradeAttempt** | studentId, sectionId, assignmentId?, examId?, numericGrade, letterGrade, isPublished | Latest published = official |
| **GradeScale** | minScore, maxScore, letter | Configurable thresholds |

### Attendance

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **AttendanceSession** | sectionId, sessionDate, sessionNumber | One per class meeting |
| **AttendanceRecord** | sessionId, studentId, value (PRESENT/ABSENT), markedById | Individual record |
| **AttendanceSummary** | studentId, sectionId, totalSessions, present, absent, warningLevel | Recomputed on every record change |

### Finance

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **FinanceAccount** | studentId, balanceUsd, balanceLbp, currency | One per student |
| **FinanceLedgerEntry** | accountId, type, amountUsd, amountLbp, description, status | Full ledger history |

### Communication

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **Announcement** | title, body, sectionId?, scope, status, authorId | Section or university-wide |
| **CalendarEvent** | title, eventDate, startTime, endTime, location, eventType, courseId?, sectionId? | |
| **Notification** | userId, type, title, body, isRead, entityType?, entityId? | Per-user notifications |

### Audit

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **AuditLog** | actorId, entityType, entityId, action, oldValues?, newValues? | JSON fields for change tracking |

## Indexes

Key indexes for query performance:
- `Session.token` — unique, for cookie lookup
- `SectionEnrollment(studentId, sectionId)` — unique compound
- `AttendanceSummary(studentId, sectionId)` — unique compound
- `GradeAttempt(studentId, sectionId, assignmentId)` — for grade lookup
- `FinanceLedgerEntry.accountId` — for ledger queries
- `Notification.userId` — for notification list
- `AuditLog.actorId` — for audit trail

## Seed Data

The seed script (`prisma/seed.ts`) creates:
- 1 student user (Farid, 202300189) enrolled in 5 business sections
- 6 instructor users (Adam + 5 business faculty)
- 8 courses, 10 sections with meeting schedules
- 20 CS students in Adam's sections
- 11 assignments, 8 exams
- Attendance sessions, records, and summaries
- Grade scale (A through F)
- Finance account with 8 ledger entries (USD + LBP)
- 4 announcements, calendar events, notifications, materials
