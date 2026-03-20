# Backend Architecture

> V1 foundation — session-based auth, PostgreSQL via Prisma, Next.js API routes.

---

## Stack

| Layer | Technology |
|-------|------------|
| Runtime | Next.js 14 API Route Handlers |
| Database | PostgreSQL |
| ORM | Prisma (schema-first, migrations) |
| Auth | Session-based with HTTP-only cookies |
| Password hashing | bcryptjs (12 rounds) |
| Validation | Zod |
| File storage | Local adapter (cloud-ready interface) |

## Directory Layout

```
lib/server/
├── db.ts                    # Prisma client singleton
├── auth/
│   ├── password.ts          # hash / verify (bcryptjs)
│   ├── session.ts           # create, validate, extend, destroy sessions
│   └── guards.ts            # requireStudent(), requireInstructor()
├── services/
│   ├── audit.ts             # createAuditLog()
│   ├── grades.ts            # computeLetterGrade, validateTotalWeight
│   ├── attendance.ts        # recomputeAttendanceSummary (AW logic)
│   └── notifications.ts    # createNotification, notifySectionStudents
└── storage/
    └── index.ts             # StorageAdapter interface + LocalStorageAdapter

app/api/
├── student/
│   ├── auth/{login,logout,session}/route.ts
│   ├── home/route.ts
│   ├── courses/route.ts
│   ├── courses/[sectionId]/route.ts
│   ├── assignments/route.ts
│   ├── assignments/[id]/route.ts
│   ├── exams/route.ts
│   ├── exams/[id]/route.ts
│   ├── attendance/route.ts
│   ├── attendance/[sectionId]/route.ts
│   ├── grades/route.ts
│   ├── grades/[sectionId]/route.ts
│   ├── finance/route.ts
│   ├── calendar/route.ts
│   ├── notifications/route.ts
│   └── notifications/[id]/read/route.ts
└── instructor/
    ├── auth/{login,logout,session}/route.ts
    ├── courses/route.ts
    ├── courses/[sectionId]/route.ts
    ├── sections/route.ts
    ├── sections/[sectionId]/route.ts
    ├── assignments/route.ts  (GET + POST)
    ├── assignments/[id]/route.ts  (GET + PATCH)
    ├── assignments/[id]/{publish,archive}/route.ts
    ├── exams/route.ts  (GET + POST)
    ├── exams/[id]/route.ts  (GET + PATCH)
    ├── exams/[id]/{publish,archive}/route.ts
    ├── materials/route.ts  (GET + POST)
    ├── materials/[id]/route.ts  (PATCH + DELETE)
    ├── materials/[id]/publish/route.ts
    ├── grades/{roster,bulk-save,publish}/route.ts
    ├── attendance/route.ts
    ├── attendance/sessions/[sessionId]/records/route.ts
    ├── attendance/records/[id]/route.ts
    ├── announcements/route.ts  (GET + POST)
    ├── announcements/[id]/route.ts  (PATCH)
    ├── announcements/[id]/publish/route.ts
    ├── file-library/route.ts
    └── files/upload/route.ts
```

## Authentication

### Session Model

- Login creates a `Session` row with a UUID token and `expiresAt = now + 5 minutes`.
- Token is stored in an HTTP-only, secure, SameSite=lax cookie (`session_token`).
- Every validated request slides the expiration window forward by 5 minutes.
- Logout deletes the session row and clears the cookie.
- A `purgeExpiredSessions()` utility exists for cleanup.

### Guards

```typescript
const { session, error } = await requireStudent();
if (error) return error; // Returns 401/403 NextResponse
// session.user is now available
```

- `getAuthenticatedUser()` — reads cookie, validates session, returns user
- `requireRole(...roles)` — checks user.role
- `requireStudent()` — shorthand for requireRole("STUDENT")
- `requireInstructor()` — shorthand for requireRole("INSTRUCTOR")

## Business Rules

### Attendance → Academic Withdrawal

- 4 absences → WARNING_4 notification
- 5 absences → WARNING_5 notification
- 6 absences → LAST_WARNING_6 notification
- 7 absences → AW_7: enrollment status set to ACADEMICALLY_WITHDRAWN, student notified, audit log created

### Weight Validation

- Total assignment + exam weights per section must not exceed 90%.
- Enforced on create and update of assignments and exams.

### Grade Computation

- Letter grade derived from GradeScale table (configurable thresholds).
- Default scale: A (90+), A- (87+), B+ (83+), B (80+), B- (77+), C+ (73+), C (70+), C- (67+), D+ (63+), D (60+), F (<60).

### Soft Deletion

- Models with `deletedAt` field use soft deletion pattern.
- Queries filter by `deletedAt: null` by default.

### Audit Logging

- All instructor write operations create an audit log entry with actor, entity, action, and old/new values.

## File Storage

```typescript
interface StorageAdapter {
  put(key: string, buffer: Buffer, contentType: string): Promise<string>;
  get(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}
```

V1 uses `LocalStorageAdapter` writing to `./uploads/`. The interface is designed for easy swap to S3/GCS in future.

## Frontend Integration

- Auth contexts (`auth-context.tsx`, `instructor-auth-context.tsx`) call backend API endpoints.
- Dashboard pages use `useApi<T>(url)` hook for data fetching.
- Login pages call POST endpoints and redirect on success.
- The `useApi` hook provides `{ data, loading, error, refetch }`.
