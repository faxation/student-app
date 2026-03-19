"use client";

import {
  BookOpen,
  ClipboardList,
  FileText,
  TrendingUp,
  Clock,
  Megaphone,
} from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import {
  announcements as mockAnnouncements,
  weeklySchedule,
  assignments as mockAssignments,
  exams as mockExams,
  courses as mockCourses,
} from "@/data/mock-data";
import { formatDate, daysUntil } from "@/lib/utils";

export default function HomePage() {
  const { student } = useAuth();

  const coursesCount = mockCourses.length;
  const assignments = mockAssignments;
  const examsCount = mockExams.filter((e) => daysUntil(e.date) >= 0).length;

  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const upcomingDeadlines = [...assignments]
    .filter((a) => a.status === "pending" && a.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  // Today's classes from weekly schedule
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayClasses = weeklySchedule[dayName] ?? [];

  return (
    <PageWrapper
      title={`Welcome back, ${student?.firstName}`}
      subtitle={`${student?.major} · ${student?.semester}`}
    >
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
          subtitle={`${mockCourses.reduce((s, c) => s + c.credits, 0)} credits`}
          icon={<BookOpen size={20} />}
          accent="blue"
        />
        <StatCard
          label="Pending Assignments"
          value={pendingAssignments.length}
          subtitle="Due this month"
          icon={<ClipboardList size={20} />}
          accent="amber"
        />
        <StatCard
          label="Upcoming Exams"
          value={examsCount}
          subtitle="Next 2 weeks"
          icon={<FileText size={20} />}
          accent="red"
        />
      </div>

      <div className="page-grid-2">
        {/* Today's Classes */}
        <Card>
          <CardHeader
            title="Today's Classes"
            subtitle={new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          />
          <div className="space-y-3">
            {todayClasses.length > 0 ? (
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
                    <p className="text-xs text-ink-500">{cls.courseCode}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-ink-400 py-4 text-center">No classes today</p>
            )}
          </div>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader title="Upcoming Deadlines" subtitle="Assignments due soon" />
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
        </Card>
      </div>
    </PageWrapper>
  );
}
