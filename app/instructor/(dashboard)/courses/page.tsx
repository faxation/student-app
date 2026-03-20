"use client";

import { BookOpen, Users, Calendar, CreditCard } from "lucide-react";
import { InstructorPageWrapper } from "@/components/instructor/page-wrapper";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/lib/use-api";

interface Section {
  id: string;
  number: string;
  status: string;
  enrollmentCount: number;
  meetingTimes: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  sections: Section[];
}

interface CoursesResponse {
  courses: Course[];
}

export default function InstructorCoursesPage() {
  const { data, loading, error } = useApi<CoursesResponse>("/api/instructor/courses");

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" /></div>;
  if (error) return <div className="p-6 text-red-600">Failed to load data.</div>;

  const courses = data?.courses ?? [];
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  const totalSections = courses.reduce((s, c) => s + c.sections.length, 0);

  return (
    <InstructorPageWrapper title="Courses" subtitle="Courses you are teaching this term">
      {/* Stats */}
      <div className="page-grid-3 mb-8">
        <StatCard
          label="Courses"
          value={courses.length}
          subtitle="Spring 2026"
          icon={<BookOpen size={20} />}
          accent="brand"
        />
        <StatCard
          label="Total Credits"
          value={totalCredits}
          subtitle="This semester"
          icon={<CreditCard size={20} />}
          accent="blue"
        />
        <StatCard
          label="Total Sections"
          value={totalSections}
          subtitle="Across all courses"
          icon={<Users size={20} />}
          accent="amber"
        />
      </div>

      {/* Course Cards */}
      <div className="page-grid-3">
        {courses.map((course) => {
          const sections = course.sections;
          const totalEnrolled = sections.reduce((s, sec) => s + sec.enrollmentCount, 0);

          return (
            <Card key={course.id} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-lg font-semibold text-ink-900 truncate">
                    {course.name}
                  </h3>
                  <p className="text-sm text-ink-500 mt-0.5">{course.code}</p>
                </div>
                <Badge variant="brand">Spring 2026</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-ink-600">
                  <CreditCard size={14} className="text-ink-400" />
                  <span>{course.credits} credits</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-600">
                  <Users size={14} className="text-ink-400" />
                  <span>{sections.length} section{sections.length > 1 ? "s" : ""} &middot; {totalEnrolled} students</span>
                </div>
              </div>

              {/* Section times */}
              <div className="mt-5 pt-4 border-t border-surface-200 space-y-2">
                {sections.map((sec) => (
                  <div key={sec.id} className="flex items-center gap-2 rounded-lg bg-surface-50 px-3 py-2">
                    <Calendar size={12} className="text-brand-500" />
                    <span className="text-xs text-ink-600">
                      Section {sec.number}: {sec.meetingTimes}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </InstructorPageWrapper>
  );
}
