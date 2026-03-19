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
- No loud gradients, no playful startup aesthetic
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

## Future Modules (Planned)

- Absence report
- Detailed financial report
- Pearson integration
- SIS integration
- Notifications
- Attendance analytics
- localStorage persistence for data

## Technical Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- lucide-react
- Framer Motion (subtle polish)

## Important Notes

- Automatic 10-minute sync from this conversation into the repo is **not natively possible** without an external process or API bridge.
- A local `sync:readme` script is provided to manually sync `docs/context-log.md` into `README.md`.
- A GitHub Actions workflow example is provided for potential automation.

---

*Last updated: 2026-03-19*
