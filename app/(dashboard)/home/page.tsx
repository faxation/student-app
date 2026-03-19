"use client";

import {
  BookOpen,
  ClipboardList,
  FileText,
  TrendingUp,
  Clock,
  Megaphone,
  CloudOff,
} from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { useMoodle } from "@/lib/moodle-context";
import {
  announcements as mockAnnouncements,
  todayClasses,
  assignments as mockAssignments,
  exams as mockExams,
  courses as mockCourses,
} from "@/data/mock-data";
import { formatDate, daysUntil } from "@/lib/utils";

export default function HomePage() {
  const { student } = useAuth();
  const { data: moodle, isSynced } = useMoodle();

  // Use Moodle data if synced, otherwise fall back to mock
  const coursesCount = isSynced ? moodle!.courses.length : mockCourses.length;
  const assignments = isSynced
    ? moodle!.assignments.map((a) => ({
        id: a.id,
        title: a.title,
        courseCode: a.courseCode,
        courseName: a.courseName,
        dueDate: a.dueDate,
        status: a.status === "draft" || a.status === "unknown" ? ("pending" as const) : a.status,
        description: a.description,
      }))
    : mockAssignments;

  const examsCount = isSynced ? moodle!.exams.length : mockExams.filter((e) => daysUntil(e.date) >= 0).length;

  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const upcomingDeadlines = [...assignments]
    .filter((a) => a.status === "pending" && a.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  // Calendar events for "upcoming" panel
  const upcomingEvents = isSynced
    ? moodle!.calendarEvents
        .filter((e) => daysUntil(e.date) >= 0)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 4)
    : [];

  const displayName = isSynced && moodle!.profile
    ? moodle!.profile.firstName
    : student?.firstName;

  return (
    <PageWrapper
      title={`Welcome back, ${displayName}`}
      subtitle={isSynced ? `Synced from Moodle · ${new Date(moodle!.syncedAt).toLocaleTimeString()}` : `${student?.major} · ${student?.semester}`}
    >
      {/* Sync status banner */}
      {!isSynced && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-surface-200 bg-surface-50 p-4">
          <CloudOff size={18} className="mt-0.5 shrink-0 text-ink-400" />
          <div>
            <p className="text-sm font-medium text-ink-700">
              Showing demo data
            </p>
            <p className="mt-0.5 text-sm text-ink-500">
              Click &quot;Sync Moodle&quot; in the header to load your real courses and assignments.
            </p>
          </div>
        </div>
      )}

      {/* Moodle sync errors */}
      {isSynced && moodle!.errors.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <Megaphone size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-800">Partial sync</p>
            <p className="mt-0.5 text-sm text-amber-600">
              Some data could not be fetched: {moodle!.errors.join("; ")}
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="page-grid-4 mb-8">
        <StatCard
          label="Current GPA"
          value={student?.gpa.toFixed(2) ?? "—"}
          subtitle={student?.year}
          icon={<TrendingUp size={20} />}
          accent="brand"
        />
        <StatCard
          label="Active Courses"
          value={coursesCount}
          subtitle={isSynced ? "From Moodle" : `${mockCourses.reduce((s, c) => s + c.credits, 0)} credits`}
          icon={<BookOpen size={20} />}
          accent="blue"
        />
        <StatCard
          label="Pending Assignments"
          value={pendingAssignments.length}
          subtitle={isSynced ? "From Moodle" : "Due this month"}
          icon={<ClipboardList size={20} />}
          accent="amber"
        />
        <StatCard
          label="Upcoming Exams"
          value={examsCount}
          subtitle={isSynced ? "From Moodle" : "Next 2 weeks"}
          icon={<FileText size={20} />}
          accent="red"
        />
      </div>

      <div className="page-grid-2">
        {/* Today's Classes / Upcoming Events */}
        <Card>
          <CardHeader
            title={isSynced ? "Upcoming Events" : "Today's Classes"}
            subtitle={isSynced
              ? "From Moodle calendar"
              : new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
            }
          />
          <div className="space-y-3">
            {isSynced ? (
              upcomingEvents.length > 0 ? (
                upcomingEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-4 rounded-lg border border-surface-200 p-4 transition-colors hover:bg-surface-50"
                  >
                    <div className="flex h-12 w-16 flex-col items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <span className="text-xs font-medium">{ev.time ?? "—"}</span>
                      <span className="text-[10px] text-brand-400">{ev.date.slice(5)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{ev.title}</p>
                      <p className="text-xs text-ink-500">
                        {ev.relatedCourseCode ?? ev.type}
                      </p>
                    </div>
                    <Badge variant={ev.type === "assignment" ? "warning" : ev.type === "exam" || ev.type === "quiz" ? "danger" : "brand"}>
                      {ev.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-400 py-4 text-center">No upcoming events</p>
              )
            ) : (
              todayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-4 rounded-lg border border-surface-200 p-4 transition-colors hover:bg-surface-50"
                >
                  <div className="flex h-12 w-16 flex-col items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <span className="text-xs font-medium">{cls.time}</span>
                    <span className="text-[10px] text-brand-400">{cls.endTime}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{cls.courseName}</p>
                    <p className="text-xs text-ink-500">{cls.courseCode} · {cls.room}</p>
                  </div>
                  <p className="text-xs text-ink-400 shrink-0">{cls.instructor}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader title="Upcoming Deadlines" subtitle={isSynced ? "From Moodle" : "Assignments due soon"} />
          <div className="space-y-3">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((item) => {
                const days = item.dueDate ? daysUntil(item.dueDate) : 999;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-surface-200 p-4 transition-colors hover:bg-surface-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink-900 truncate">{item.title}</p>
                      <p className="text-xs text-ink-500">{item.courseCode}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs text-ink-500">{item.dueDate ? formatDate(item.dueDate) : "No date"}</p>
                      <Badge variant={days <= 1 ? "danger" : days <= 3 ? "warning" : "default"}>
                        {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : days > 0 ? `${days} days left` : "Overdue"}
                      </Badge>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-ink-400 py-4 text-center">No pending deadlines</p>
            )}
          </div>
        </Card>

        {/* Announcements */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Announcements"
            action={
              <div className="flex items-center gap-1 text-brand-500">
                <Megaphone size={16} />
              </div>
            }
          />
          {isSynced && moodle!.announcements.length === 0 ? (
            <div className="rounded-lg border border-surface-200 bg-surface-50 p-6 text-center">
              <p className="text-sm text-ink-500">
                Announcements are not yet available from Moodle. Forum-based announcements
                will be supported in a future update.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="rounded-lg border border-surface-200 p-4 transition-colors hover:bg-surface-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-ink-900">{ann.title}</h4>
                        <Badge
                          variant={ann.category === "academic" ? "brand" : ann.category === "event" ? "info" : "default"}
                        >
                          {ann.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-ink-600 line-clamp-2">{ann.body}</p>
                    </div>
                    <span className="shrink-0 text-xs text-ink-400 flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(ann.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}
