# Student App

A modern, university-branded student dashboard for personal academic organization.

---

## Overview

Student App is a clean, focused web application designed for university students to organize their academic life — schedules, assignments, exams, courses, and finances — in one polished interface.

This is **not** a Moodle replacement. It is a completely new student experience layer that may eventually integrate with existing platforms (Moodle, Pearson, SIS) but presents information in a fundamentally better way.

## Product Vision

Create a student-first dashboard that feels calm, formal, modern, and premium. Every screen should provide immediate value: what classes are today, what's due soon, when exams are, how finances look.

The interface draws visual identity from [ULS](https://www.uls.edu.lb/) — the same institutional tone, color family, and academic aesthetic, reinterpreted into a modern app UI.

## Current Scope (v0.1)

| Feature | Status |
|---------|--------|
| Login page | ✅ Demo credentials |
| App shell with sidebar | ✅ Collapsible, hover-expand |
| Home dashboard | ✅ Stats, classes, deadlines, announcements |
| Calendar | ✅ Week view, event timeline |
| Assignments | ✅ Status tracking, due dates |
| Exams | ✅ Countdown, urgency indicators |
| Courses | ✅ Enrollment, attendance, activity |
| Finance | ✅ Tuition, payments, transactions |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Animation**: Framer Motion
- **Data**: Local mock data (no backend)

## Demo Credentials

| Field | Value |
|-------|-------|
| Student ID | `202300189` |
| Password | `std175593` |

> These are hardcoded demo credentials. No real authentication is performed.

## Routes / Pages

| Route | Description |
|-------|-------------|
| `/login` | Login page |
| `/home` | Student dashboard with quick stats and today's overview |
| `/calendar` | Weekly schedule and upcoming events |
| `/assignments` | Assignment tracker with status indicators |
| `/exams` | Exam schedule with urgency and countdown |
| `/courses` | Enrolled courses with attendance and activity |
| `/finance` | Tuition overview, payment progress, transactions |

## Design Direction

- **Brand color**: `#00896a` (university green)
- **Typography**: Playfair Display (headings) + Inter (body)
- **Aesthetic**: Calm, formal, premium, university-branded
- **Layout**: Clean cards, subtle borders, soft shadows, white space
- **Motion**: Restrained transitions (sidebar expand, error states)

See [docs/design-system.md](docs/design-system.md) for the complete design system documentation.

## Project Structure

```
Student App/
├── app/
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Root redirect
│   ├── globals.css             # Global styles + Tailwind
│   ├── login/page.tsx          # Login page
│   └── (dashboard)/
│       ├── layout.tsx          # Dashboard shell with sidebar
│       ├── home/page.tsx
│       ├── calendar/page.tsx
│       ├── assignments/page.tsx
│       ├── exams/page.tsx
│       ├── courses/page.tsx
│       └── finance/page.tsx
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx         # Collapsible sidebar navigation
│   │   ├── header.tsx          # Page header with user info
│   │   └── app-shell.tsx       # Auth-guarded shell wrapper
│   └── ui/
│       ├── card.tsx            # Card + CardHeader
│       ├── badge.tsx           # Status badges
│       ├── stat-card.tsx       # Metric display cards
│       ├── page-wrapper.tsx    # Standard page layout
│       └── empty-state.tsx     # Empty state placeholder
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── auth-context.tsx        # Authentication context
│   └── utils.ts                # Utility functions
├── data/
│   └── mock-data.ts            # All mock data (typed)
├── docs/
│   ├── context-log.md          # Project context source of truth
│   ├── product-brief.md        # Product direction document
│   └── design-system.md        # Design system documentation
├── scripts/
│   └── sync-readme-context.mjs # README context sync script
├── .github/
│   └── workflows/
│       └── sync-readme.yml     # Example GitHub Actions workflow
└── public/
```

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Sync context log into README
npm run sync:readme
```

The app will be available at `http://localhost:3000`.

## Mock Data

All mock data lives in [`data/mock-data.ts`](data/mock-data.ts). It includes:

- Student profile
- Demo credentials
- Announcements
- Today's classes
- Assignments (with statuses)
- Exams (with formats and types)
- Courses (with attendance)
- Finance summary and transactions
- Calendar events

All data is typed via interfaces in [`lib/types.ts`](lib/types.ts).

## Future Roadmap

### Phase 2 — Data Layer
- Local storage persistence
- Moodle API integration (read-only)
- Pearson grade sync

### Phase 3 — Enhanced Features
- Absence report submission
- Detailed financial reporting
- Push notifications
- Attendance analytics

### Phase 4 — Platform
- SIS integration
- Mobile-responsive refinements
- PWA capabilities

### Planned Modules
- Absence reporting
- Financial reports
- Moodle integration
- Pearson integration
- SIS integration
- Notifications system
- Attendance analytics

## Limitations

- **No backend**: All data is mocked locally
- **No auth**: Login is hardcoded demo only
- **No persistence**: State resets on refresh
- **No integrations**: Moodle/Pearson/SIS connections are planned for future versions
- **Desktop-first**: Basic responsiveness included, but optimized for desktop

## README Context Sync

This README includes a synced context section below. It is updated by running:

```bash
npm run sync:readme
```

This reads `docs/context-log.md` and injects its content between the `CONTEXT_LOG_START` and `CONTEXT_LOG_END` markers below.

### How it works
- The script `scripts/sync-readme-context.mjs` reads the context log
- It replaces content between the HTML comment markers in this file
- Run manually or automate via GitHub Actions (see `.github/workflows/sync-readme.yml`)

### Automation note
Automatic 10-minute sync from an external conversation is **not natively possible** without an external process or API bridge. Options for automation:
- **GitHub Actions**: Use the provided workflow on a cron schedule
- **Local cron**: Set up a system cron job to run `npm run sync:readme`
- **Git hooks**: Run sync on pre-commit

## Synced Context

<!-- CONTEXT_LOG_START -->
<!-- This section is auto-synced from docs/context-log.md -->
<!-- Last synced: 2026-03-19T20:29:46.475Z -->

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

## Future Modules (Planned)

- Absence report
- Detailed financial report
- Moodle integration
- Pearson integration
- SIS integration
- Notifications
- Attendance analytics

## Technical Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- lucide-react
- Framer Motion (subtle polish)
- Local mock data only

## Important Notes

- Automatic 10-minute sync from this conversation into the repo is **not natively possible** without an external process or API bridge.
- A local `sync:readme` script is provided to manually sync `docs/context-log.md` into `README.md`.
- A GitHub Actions workflow example is provided for potential automation.

---

*Last updated: 2026-03-19 — Initial bootstrap*
<!-- CONTEXT_LOG_END -->

---

Built as a first draft for a university student dashboard. Designed to evolve into a real product.
