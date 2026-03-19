# Context Log

> This file preserves the full project context provided during the initial bootstrap conversation. It is used as a source of truth for README sync and future development continuity.

---

## User Goal

Create a personal student app for academic organization.

## Existing Ecosystem Context

- Assignments are listed on **Moodle**.
- Moodle is connected to **Pearson**.
- This app is **not** a Moodle replacement.
- This app is a completely new student experience layer.

## Product Direction

Create a completely new university student app for organizing:

- Schedules
- Assignment due dates
- Exam dates
- Courses
- Finance
- Future absence reporting
- Future financial reporting

## Brand Reference

- Website: https://www.uls.edu.lb/
- Follow the same colors, fonts, and brand identity feel
- Primary accent: `#00896a` (university green)
- Formal, calm, premium, university-branded aesthetic
- Reinterpret the brand into a modern app UI — do not literally copy the website

## Visual Direction

- Clean cards with subtle borders and soft shadows
- Lots of white space
- Restrained motion and smooth hover interactions
- Polished navigation
- No loud gradients, no playful startup aesthetic, no Moodle-like clutter
- Typography: elegant serif for headings, clean sans-serif for UI/body

## First Build Scope

- Login page (username + password only)
- One demo profile:
  - Username: `202300189`
  - Password: `std175593`
- Interactive left sidebar:
  - Hidden/collapsed by default with icons only
  - Extends smoothly on hover
- Sections: Home, Calendar, Assignments, Exams, Courses, Finance
- All pages use realistic mock data
- No backend, no external auth, no real integrations

## Moodle Integration (v0.2)

Implemented a first-pass Moodle integration using the **Moodle Web Services REST API** (`moodle_mobile_ws`).

### What's connected:
- **Authentication**: Token-based via `/login/token.php`
- **Courses**: Enrolled courses with progress tracking
- **Assignments**: Full list with real submission statuses (pending/submitted/late/draft)
- **Calendar**: Action events (deadlines, quizzes, course events)
- **Exams**: Inferred from quiz modules and exam-keyword calendar events

### What's NOT connected:
- **Finance**: Moodle has no financial data (needs SIS)
- **Announcements**: Requires per-course forum fetching (future)
- **Instructor names**: Not returned by course list API (future)
- **GPA/Attendance**: Not available from Moodle (needs SIS)

### Security:
- Credentials stored in `.env.local` only (gitignored)
- All Moodle calls are server-side (API route)
- Token is transient, never persisted to disk

## Future Modules (Planned)

- Absence report
- Detailed financial report
- ~~Moodle integration~~ ✅ Implemented (v0.2)
- Pearson integration
- SIS integration
- Notifications
- Attendance analytics
- Announcement extraction from Moodle forums
- Instructor name resolution
- localStorage persistence for sync data

## Technical Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- lucide-react
- Framer Motion (subtle polish)
- Moodle Web Services REST API (for data ingestion)

## Important Notes

- Automatic 10-minute sync from this conversation into the repo is **not natively possible** without an external process or API bridge.
- A local `sync:readme` script is provided to manually sync `docs/context-log.md` into `README.md`.
- A GitHub Actions workflow example is provided for potential automation.
- Moodle credentials must NEVER be committed to the repository.

---

*Last updated: 2026-03-19 — Moodle integration (v0.2)*
