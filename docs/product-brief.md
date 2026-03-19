# Product Brief — Student App

## Product Goal

Build a modern, personal student dashboard that serves as a clean organizational layer for academic life. This is **not** a Moodle replacement — it is an entirely new product focused on student experience, clarity, and personal academic management.

## The Non-Moodle Direction

Moodle handles course management, grading, and institutional workflows. This app fills a different need:

| Moodle | Student App |
|--------|-------------|
| Institutional LMS | Personal academic dashboard |
| Feature-dense, admin-oriented | Clean, student-focused |
| Content delivery platform | Organization & planning tool |
| Cluttered UI | Calm, premium interface |

The Student App is designed to be a **student-first layer** that may eventually pull data from Moodle and Pearson, but presents it in a fundamentally better way.

## First Release Scope (v0.1)

### Included
- Login page (demo credentials only)
- Main app shell with collapsible sidebar
- Home dashboard with quick stats, today's classes, upcoming deadlines, announcements
- Calendar page with weekly view and event timeline
- Assignments page with status tracking (pending, submitted, late)
- Exams page with urgency indicators and countdown
- Courses page with enrollment details and attendance
- Finance page with tuition overview, transactions, and payment progress

### Not Included (Yet)
- Real authentication
- Backend API
- Database
- Moodle/Pearson integration
- Absence reporting
- Detailed financial reports
- Notifications system

## Future Roadmap

### Phase 2 — Data Layer
- Local storage persistence
- Moodle API integration (read-only)
- Pearson grade sync

### Phase 3 — Enhanced Features
- Absence report submission
- Detailed financial reporting
- Push notifications
- Attendance analytics dashboard

### Phase 4 — Platform
- SIS integration
- Multi-student support (if needed)
- Mobile-responsive refinements
- PWA capabilities

## UX Direction

- **Calm**: No visual noise. Every element earns its space.
- **Formal**: University-appropriate tone and language.
- **Premium**: Feels like a product, not a prototype.
- **Student-friendly**: Information hierarchy optimized for student workflows.
- **Scannable**: Important info visible at a glance — deadlines, schedules, balances.

## Brand Direction

The visual identity draws from [ULS](https://www.uls.edu.lb/):

- **Primary color**: `#00896a` (university green)
- **Typography**: Playfair Display (serif headings) + Inter (sans-serif body)
- **Surfaces**: White and light gray with subtle borders
- **Shadows**: Soft and minimal
- **Motion**: Restrained, purposeful transitions (Framer Motion)

The goal is to feel institutionally credible while being modern and usable.

## Target User Value

A student should open this app and immediately:
1. Know what classes they have today
2. See their upcoming deadlines
3. Understand their exam schedule
4. Track their course attendance
5. Check their financial balance

Everything a student needs for daily academic organization, in one clean interface.
