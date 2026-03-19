"use client";

import { BookOpen, Users, Clock, Activity, BarChart3 } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { courses as mockCourses } from "@/data/mock-data";

export default function CoursesPage() {
  const courses = mockCourses;

  return (
    <PageWrapper title="Courses" subtitle="Your enrolled courses this semester">
      {/* Stats */}
      <div className="page-grid-3 mb-8">
        <StatCard
          label="Enrolled Courses"
          value={courses.length}
          subtitle="Spring 2026"
          icon={<BookOpen size={20} />}
          accent="brand"
        />
        <StatCard
          label="Total Credits"
          value={courses.reduce((s, c) => s + c.credits, 0)}
          subtitle="This semester"
          icon={<Activity size={20} />}
          accent="blue"
        />
        <StatCard
          label="Avg Attendance"
          value={`${Math.round(courses.reduce((s, c) => s + (c.attendance.present / c.attendance.total) * 100, 0) / courses.length)}%`}
          subtitle="Across all courses"
          icon={<BarChart3 size={20} />}
          accent="amber"
        />
      </div>

      {/* Course Cards */}
      <div className="page-grid-2">
        {courses.map((course) => {
          const attendancePct = Math.round((course.attendance.present / course.attendance.total) * 100);

          return (
            <Card key={course.id} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg font-semibold text-ink-900 truncate">
                    {course.name}
                  </h3>
                  <p className="text-sm text-ink-500 mt-0.5">{course.code}</p>
                </div>
              </div>

              <div className="space-y-3">
                {course.instructor && (
                  <div className="flex items-center gap-2 text-sm text-ink-600">
                    <Users size={14} className="text-ink-400" />
                    <span>{course.instructor}</span>
                  </div>
                )}

                {"schedule" in course && (
                  <div className="flex items-center gap-2 text-sm text-ink-600">
                    <Clock size={14} className="text-ink-400" />
                    <span>{course.schedule}</span>
                  </div>
                )}
              </div>

              {/* Attendance */}
              <div className="mt-5 pt-4 border-t border-surface-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-ink-500">Attendance</span>
                  <span className="text-xs text-ink-600">{course.attendance.present}/{course.attendance.total} ({attendancePct}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-100">
                  <div
                    className={`h-full rounded-full transition-all ${attendancePct >= 90 ? "bg-emerald-500" : attendancePct >= 75 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${attendancePct}%` }}
                  />
                </div>
              </div>

              {/* Activity */}
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface-50 px-3 py-2">
                <Activity size={12} className="text-brand-500" />
                <span className="text-xs text-ink-600">
                  {course.latestActivity ?? "No recent activity"}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </PageWrapper>
  );
}
