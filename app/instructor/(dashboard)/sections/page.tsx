"use client";

import { LayoutList, Users, Clock, BookOpen } from "lucide-react";
import { InstructorPageWrapper } from "@/components/instructor/page-wrapper";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { instructorSections } from "@/data/instructor-mock-data";

export default function InstructorSectionsPage() {
  const sections = instructorSections;
  const totalStudents = sections.reduce((s, sec) => s + sec.enrolledCount, 0);

  return (
    <InstructorPageWrapper title="Sections" subtitle="All sections you are teaching">
      {/* Stats */}
      <div className="page-grid-3 mb-8">
        <StatCard
          label="Total Sections"
          value={sections.length}
          subtitle="Spring 2026"
          icon={<LayoutList size={20} />}
          accent="brand"
        />
        <StatCard
          label="Total Students"
          value={totalStudents}
          subtitle="Across all sections"
          icon={<Users size={20} />}
          accent="blue"
        />
        <StatCard
          label="Avg Class Size"
          value={Math.round(totalStudents / sections.length)}
          subtitle="Students per section"
          icon={<Users size={20} />}
          accent="amber"
        />
      </div>

      {/* Sections Table */}
      <Card>
        <div className="mb-4">
          <h3 className="font-serif text-lg font-semibold text-ink-900">All Sections</h3>
          <p className="mt-0.5 text-sm text-ink-500">{sections.length} sections assigned</p>
        </div>

        {/* Table header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-ink-400 uppercase tracking-wider border-b border-surface-200">
          <div className="col-span-2">Section</div>
          <div className="col-span-3">Course</div>
          <div className="col-span-2">Code</div>
          <div className="col-span-3">Meeting Time</div>
          <div className="col-span-2 text-right">Enrolled</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-surface-100">
          {sections.map((section) => (
            <div
              key={section.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 items-center transition-colors hover:bg-surface-50"
            >
              <div className="md:col-span-2">
                <Badge variant="brand">{section.label}</Badge>
              </div>

              <div className="md:col-span-3">
                <p className="text-sm font-medium text-ink-900 truncate">
                  {section.courseName}
                </p>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-1.5 text-sm text-ink-600">
                  <BookOpen size={14} className="text-ink-400" />
                  <span>{section.courseCode}</span>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="flex items-center gap-1.5 text-sm text-ink-600">
                  <Clock size={14} className="text-ink-400" />
                  <span>{section.meetingTime}</span>
                </div>
              </div>

              <div className="md:col-span-2 md:text-right">
                <div className="flex items-center gap-1.5 md:justify-end text-sm text-ink-600">
                  <Users size={14} className="text-ink-400" />
                  <span>{section.enrolledCount} students</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </InstructorPageWrapper>
  );
}
