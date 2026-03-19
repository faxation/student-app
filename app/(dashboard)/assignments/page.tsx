"use client";

import { ClipboardList } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { assignments as mockAssignments } from "@/data/mock-data";
import { formatDate, daysUntil } from "@/lib/utils";

const statusConfig = {
  pending: { label: "Pending", variant: "warning" as const },
  submitted: { label: "Submitted", variant: "success" as const },
  late: { label: "Late", variant: "danger" as const },
  draft: { label: "Draft", variant: "info" as const },
  unknown: { label: "Unknown", variant: "default" as const },
};

export default function AssignmentsPage() {
  const assignments = mockAssignments;

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
          subtitle="Completed"
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

        {/* Rows */}
        <div className="divide-y divide-surface-100">
          {assignments.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-400">
              No assignments found.
            </div>
          ) : (
            assignments.map((assignment) => {
              const days = assignment.dueDate ? daysUntil(assignment.dueDate) : 999;
              const config = statusConfig[assignment.status] ?? statusConfig.unknown;

              return (
                <div
                  key={assignment.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 items-center transition-colors hover:bg-surface-50"
                >
                  <div className="md:col-span-4">
                    <p className="text-sm font-medium text-ink-900 truncate">
                      {assignment.title}
                    </p>
                    <p className="text-xs text-ink-500 mt-0.5 line-clamp-1 md:hidden">
                      {assignment.courseName}
                    </p>
                  </div>

                  <div className="hidden md:block md:col-span-2">
                    <Badge variant="default">{assignment.courseCode}</Badge>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-ink-600">
                      {assignment.dueDate ? formatDate(assignment.dueDate) : "No due date"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    {assignment.status === "pending" && assignment.dueDate && (
                      <span
                        className={`text-sm font-medium ${
                          days <= 1 ? "text-red-600" : days <= 3 ? "text-amber-600" : "text-ink-600"
                        }`}
                      >
                        {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : days > 0 ? `${days} days` : "Overdue"}
                      </span>
                    )}
                    {assignment.status === "submitted" && (
                      <span className="text-sm text-ink-400">—</span>
                    )}
                    {assignment.status === "late" && (
                      <span className="text-sm text-red-600 font-medium">Overdue</span>
                    )}
                  </div>

                  <div className="md:col-span-2 md:text-right">
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </PageWrapper>
  );
}
