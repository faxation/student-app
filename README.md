# Student App

A modern, university-branded student dashboard for personal academic organization.

---

## Overview

Student App is a clean, focused web application designed for university students to organize their academic life — schedules, assignments, exams, courses, and finances — in one polished interface.

## Product Vision

Create a student-first dashboard that feels calm, formal, modern, and premium. Every screen should provide immediate value: what classes are today, what's due soon, when exams are, how finances look.

The interface draws visual identity from [ULS](https://www.uls.edu.lb/) — the same institutional tone, color family, and academic aesthetic, reinterpreted into a modern app UI.

## Current Scope

| Feature | Status | Data Source |
|---------|--------|-------------|
| Student login | ✅ Session-based auth | PostgreSQL |
| Instructor login | ✅ Session-based auth | PostgreSQL |
| App shell with sidebar | ✅ Collapsible, hover-expand | — |
| Home dashboard | ✅ Stats, events, deadlines | API |
| Calendar | ✅ Week view, event timeline | API |
| Assignments | ✅ Status tracking, due dates | API |
| Exams | ✅ Schedule with countdown | API |
| Courses | ✅ Enrollment, materials, grades | API |
| Finance | ✅ Tuition, payments (USD + LBP) | API |
| Attendance | ✅ Per-course tracking, AW logic | API |
| Instructor courses | ✅ Course and section management | API |
| Instructor assignments | ✅ Create, publish, archive | API |
| Instructor exams | ✅ Create, publish, archive | API |
| Instructor grades | ✅ Roster view, bulk save, publish | API |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Session-based (HTTP-only cookies, 5-min sliding window)
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Animation**: Framer Motion
- **Validation**: Zod
- **Password hashing**: bcryptjs

## Demo Credentials

### Student
| Field | Value |
|-------|-------|
| Student ID | `202300189` |
| Password | `std175593` |

### Instructor
| Field | Value |
|-------|-------|
| Username | `Adam` |
| Password | `Act3and4` |

> Credentials are stored in the database (hashed). Auth uses server-side sessions with HTTP-only cookies.

## Routes / Pages

### Student

| Route | Description |
|-------|-------------|
| `/login` | Student login page |
| `/home` | Dashboard with quick stats and today's overview |
| `/calendar` | Weekly schedule and upcoming events |
| `/assignments` | Assignment tracker with status indicators |
| `/exams` | Exam schedule with urgency and countdown |
| `/courses` | Enrolled courses with attendance and activity |
| `/courses/[courseId]` | Course detail: materials, participants, grades |
| `/finance` | Tuition overview, payments, dual currency (USD/LBP) |
| `/attendance` | Per-course attendance tracking with warning levels |

### Instructor

| Route | Description |
|-------|-------------|
| `/instructor/login` | Instructor login page |
| `/instructor/courses` | Assigned courses with section details |
| `/instructor/sections` | All sections with meeting times, enrollment |
| `/instructor/assignments` | Assignment management with create form |
| `/instructor/exams` | Exam management with create form |
| `/instructor/grades` | Grade entry: select section → view roster → enter grades |

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
│   ├── layout.tsx                  # Root layout with AuthProvider
│   ├── page.tsx                    # Root redirect
│   ├── globals.css                 # Global styles + Tailwind
│   ├── login/page.tsx              # Student login
│   ├── (dashboard)/                # Student dashboard (auth-guarded)
│   │   ├── layout.tsx
│   │   ├── home/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── assignments/page.tsx
│   │   ├── exams/page.tsx
│   │   ├── courses/page.tsx
│   │   ├── courses/[courseId]/page.tsx
│   │   ├── finance/page.tsx
│   │   └── attendance/page.tsx
│   ├── instructor/
│   │   ├── layout.tsx              # InstructorAuthProvider
│   │   ├── login/page.tsx          # Instructor login
│   │   └── (dashboard)/            # Instructor dashboard (auth-guarded)
│   │       ├── courses/page.tsx
│   │       ├── sections/page.tsx
│   │       ├── assignments/page.tsx
│   │       ├── exams/page.tsx
│   │       └── grades/page.tsx
│   └── api/
│       ├── student/                # ~15 student API routes
│       └── instructor/             # ~26 instructor API routes
├── components/
│   ├── layout/                     # Student layout components
│   ├── instructor/                 # Instructor layout components
│   └── ui/                         # Shared UI components
├── lib/
│   ├── types.ts                    # Student TypeScript interfaces
│   ├── instructor-types.ts         # Instructor TypeScript interfaces
│   ├── auth-context.tsx            # Student auth (API-backed)
│   ├── instructor-auth-context.tsx # Instructor auth (API-backed)
│   ├── use-api.ts                  # Generic data fetching hook
│   └── server/                     # Server-only code
│       ├── db.ts                   # Prisma client singleton
│       ├── auth/                   # Session, password, guards
│       ├── services/               # Business logic
│       └── storage/                # File storage adapter
├── prisma/
│   ├── schema.prisma               # 20 enums, 34 models
│   └── seed.ts                     # Seed script
├── data/
│   ├── mock-data.ts                # Student mock data (fallback)
│   └── instructor-mock-data.ts     # Instructor mock data (fallback)
├── docs/
│   ├── backend-architecture.md     # Backend architecture reference
│   ├── api-plan.md                 # API endpoint reference
│   ├── data-model.md               # Database schema reference
│   ├── context-log.md              # Project context
│   ├── product-brief.md            # Product direction
│   └── design-system.md            # Design system
└── public/
```

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/student_app"
SESSION_SECRET="your-random-secret-at-least-32-chars"
```

### Install & Run

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Database Commands

```bash
npm run db:migrate   # Run Prisma migrations
npm run db:push      # Push schema without migrations
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio GUI
npm run db:generate  # Regenerate Prisma client
npm run db:reset     # Reset database and re-seed
```

## Documentation

- [Backend Architecture](docs/backend-architecture.md) — auth, services, storage, guards
- [API Plan](docs/api-plan.md) — all ~45 endpoints with methods and descriptions
- [Data Model](docs/data-model.md) — 34 Prisma models, enums, relationships
- [Design System](docs/design-system.md) — colors, typography, components
- [Product Brief](docs/product-brief.md) — product direction and vision

## Future Roadmap

### Phase 2
- Assignment submission (student upload)
- Pearson grade sync
- Real-time notifications (WebSocket/SSE)
- File preview (PDF, images)

### Phase 3
- Absence report submission
- Detailed financial reporting
- Attendance analytics dashboards
- Push notifications

### Phase 4
- SIS integration
- Mobile-responsive refinements
- PWA capabilities
- Admin panel

## Limitations

- **5-minute session timeout**: Sessions expire after 5 minutes of inactivity (configurable)
- **Local file storage**: Files stored on disk; cloud storage adapter ready but not implemented
- **No real-time updates**: Polling-based; WebSocket support planned for Phase 2
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
<!-- Last synced: 2026-05-03T19:11:07.950Z -->

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
<!-- CONTEXT_LOG_END -->

---

Built as a first draft for a university student dashboard. Designed to evolve into a real product.
