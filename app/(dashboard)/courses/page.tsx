"use client";

import { BookOpen, Users, Clock, ExternalLink, Activity, BarChart3 } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { useMoodle } from "@/lib/moodle-context";
import { courses as mockCourses } from "@/data/mock-data";

export default function CoursesPage() {
  const { data: moodle, isSynced } = useMoodle();

  const courses = isSynced
    ? moodle!.courses
    : mockCourses.map((c) => ({
        id: c.id,
        title: c.name,
        shortCode: c.code,
        instructor: c.instructor,
        category: "",
        progress: null as number | null,
        link: "",
        lastAccess: null as string | null,
        source: "mock" as const,
      }));

  return (
    <PageWrapper title="Courses" subtitle={isSynced ? "Synced from Moodle" : "Your enrolled courses this semester"}>
      {/* Stats */}
      <div className="page-grid-3 mb-8">
        <StatCard
          label="Enrolled Courses"
          value={courses.length}
          subtitle={isSynced ? "From Moodle" : "Spring 2026"}
          icon={<BookOpen size={20} />}
          accent="brand"
        />
        <StatCard
          label="Data Source"
          value={isSynced ? "Moodle" : "Demo"}
          subtitle={isSynced ? `Synced ${new Date(moodle!.syncedAt).toLocaleTimeString()}` : "Click Sync to connect"}
          icon={<Activity size={20} />}
          accent="blue"
        />
        <StatCard
          label="With Progress"
          value={isSynced ? courses.filter((c) => c.progress !== null).length : "N/A"}
          subtitle="Courses with progress tracking"
          icon={<BarChart3 size={20} />}
          accent="amber"
        />
      </div>

      {/* Course Cards */}
      <div className="page-grid-2">
        {courses.map((course) => (
          <Card key={course.id} hover>
            <div className="flex items-start justify-between mb-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg font-semibold text-ink-900 truncate">
                  {course.title}
                </h3>
                <p className="text-sm text-ink-500 mt-0.5">{course.shortCode}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                {isSynced && course.link && (
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-1.5 text-brand-500 hover:bg-brand-50 transition-colors"
                    title="Open in Moodle"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {course.instructor && (
                <div className="flex items-center gap-2 text-sm text-ink-600">
                  <Users size={14} className="text-ink-400" />
                  <span>{course.instructor}</span>
                </div>
              )}

              {!isSynced && "schedule" in course && (
                <div className="flex items-center gap-2 text-sm text-ink-600">
                  <Clock size={14} className="text-ink-400" />
                  <span>{(course as { schedule: string }).schedule}</span>
                </div>
              )}

              {course.lastAccess && (
                <div className="flex items-center gap-2 text-sm text-ink-600">
                  <Clock size={14} className="text-ink-400" />
                  <span>Last accessed: {course.lastAccess}</span>
                </div>
              )}
            </div>

            {/* Progress bar (Moodle data) */}
            {course.progress !== null && (
              <div className="mt-5 pt-4 border-t border-surface-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-ink-500">Progress</span>
                  <span className="text-xs text-ink-600">{course.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      course.progress >= 80
                        ? "bg-emerald-500"
                        : course.progress >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Mock attendance (only shown for mock data) */}
            {!isSynced && "attendance" in course && (() => {
              const mc = course as unknown as { attendance: { present: number; total: number } };
              const pct = Math.round((mc.attendance.present / mc.attendance.total) * 100);
              return (
                <div className="mt-5 pt-4 border-t border-surface-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-ink-500">Attendance</span>
                    <span className="text-xs text-ink-600">{mc.attendance.present}/{mc.attendance.total} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-100">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-emerald-500" : pct >= 75 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Source badge */}
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface-50 px-3 py-2">
              <Activity size={12} className="text-brand-500" />
              <span className="text-xs text-ink-600">
                {isSynced ? "From Moodle" : (course as unknown as { latestActivity?: string }).latestActivity ?? "Demo data"}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
