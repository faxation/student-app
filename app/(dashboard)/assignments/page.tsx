"use client";

import { ClipboardList, Info } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { assignments } from "@/data/mock-data";
import { formatDate, daysUntil } from "@/lib/utils";

const statusConfig = {
  pending: { label: "Pending", variant: "warning" as const },
  submitted: { label: "Submitted", variant: "success" as const },
  late: { label: "Late", variant: "danger" as const },
};

export default function AssignmentsPage() {
  const pending = assignments.filter((a) => a.status === "pending");
  const submitted = assignments.filter((a) => a.status === "submitted");
  const late = assignments.filter((a) => a.status === "late");

  return (
    <PageWrapper title="Assignments" subtitle="Track and manage your coursework">
      {/* Stats */}
      <div className="page-grid-3 mb-8">
        <StatCard
          label="Pending"
          value={pending.length}
          subtitle="Awaiting submission"
          icon={<ClipboardList size={20} />}
          accent="amber"
        />
        <StatCard
          label="Submitted"
          value={submitted.length}
          subtitle="Completed on time"
          icon={<ClipboardList size={20} />}
          accent="brand"
        />
        <StatCard
          label="Late"
          value={late.length}
          subtitle="Past due date"
          icon={<ClipboardList size={20} />}
          accent="red"
        />
      </div>

      {/* Integration note */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-blue-500" />
        <div>
          <p className="text-sm font-medium text-blue-800">
            Moodle & Pearson Integration Coming Soon
          </p>
          <p className="mt-0.5 text-sm text-blue-600">
            Future versions will sync assignments directly from Moodle and Pearson.
            Currently showing demo data.
          </p>
        </div>
      </div>

      {/* Assignment List */}
      <Card>
        <CardHeader title="All Assignments" subtitle={`${assignments.length} total`} />

        {/* Table header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-ink-400 uppercase tracking-wider border-b border-surface-200">
          <div className="col-span-4">Assignment</div>
          <div className="col-span-2">Course</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-2">Time Left</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Assignment rows */}
        <div className="divide-y divide-surface-100">
          {assignments.map((assignment) => {
            const days = daysUntil(assignment.dueDate);
            const config = statusConfig[assignment.status];

            return (
              <div
                key={assignment.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 items-center transition-colors hover:bg-surface-50"
              >
                {/* Title */}
                <div className="md:col-span-4">
                  <p className="text-sm font-medium text-ink-900">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-ink-500 mt-0.5 line-clamp-1 md:hidden">
                    {assignment.courseName}
                  </p>
                </div>

                {/* Course */}
                <div className="hidden md:block md:col-span-2">
                  <Badge variant="default">{assignment.courseCode}</Badge>
                </div>

                {/* Due Date */}
                <div className="md:col-span-2">
                  <p className="text-sm text-ink-600">{formatDate(assignment.dueDate)}</p>
                </div>

                {/* Time Left */}
                <div className="md:col-span-2">
                  {assignment.status === "pending" && (
                    <span
                      className={`text-sm font-medium ${
                        days <= 1
                          ? "text-red-600"
                          : days <= 3
                          ? "text-amber-600"
                          : "text-ink-600"
                      }`}
                    >
                      {days === 0
                        ? "Due today"
                        : days === 1
                        ? "Due tomorrow"
                        : days > 0
                        ? `${days} days`
                        : "Overdue"}
                    </span>
                  )}
                  {assignment.status === "submitted" && (
                    <span className="text-sm text-ink-400">—</span>
                  )}
                  {assignment.status === "late" && (
                    <span className="text-sm text-red-600 font-medium">Overdue</span>
                  )}
                </div>

                {/* Status */}
                <div className="md:col-span-2 md:text-right">
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </PageWrapper>
  );
}
