"use client";

import { useState } from "react";
import { ClipboardList, ChevronDown, ExternalLink, ShieldAlert, Copy, Check, ChevronRight, Info } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { assignments as mockAssignments } from "@/data/mock-data";
import { formatDate, daysUntil } from "@/lib/utils";

const PEARSON_PORTAL_URL = "https://login.pearson.com/v1/piapi/iesui/signin";

const statusConfig = {
  pending: { label: "Pending", variant: "warning" as const },
  submitted: { label: "Submitted", variant: "success" as const },
  late: { label: "Late", variant: "danger" as const },
  draft: { label: "Draft", variant: "info" as const },
  unknown: { label: "Unknown", variant: "default" as const },
};

export default function AssignmentsPage() {
  const [assignmentsOpen, setAssignmentsOpen] = useState(true);
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

      {/* Assignment List — Collapsible */}
      <Card>
        <button
          onClick={() => setAssignmentsOpen(!assignmentsOpen)}
          className="flex w-full items-center justify-between"
        >
          <div>
            <h3 className="font-serif text-lg font-semibold text-ink-900">All Assignments</h3>
            <p className="mt-0.5 text-sm text-ink-500">{assignments.length} total</p>
          </div>
          <ChevronDown
            size={20}
            className={`text-ink-400 transition-transform duration-200 ${
              assignmentsOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {assignmentsOpen && (
          <div className="mt-4">
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
          </div>
        )}
      </Card>

      {/* Pearson Portal */}
      <PearsonPortalCard />
    </PageWrapper>
  );
}

// ─── Pearson Portal Card ─────────────────────────────────────────

function PearsonPortalCard() {
  const [copied, setCopied] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(PEARSON_PORTAL_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader
        title="Pearson Portal"
        subtitle="Access your Pearson assignments and resources"
        action={<Badge variant="info">External</Badge>}
      />

      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
          <ShieldAlert size={24} className="text-amber-500" />
        </div>

        <p className="text-sm text-ink-600 max-w-md mb-6">
          Pearson blocks in-app framed browsing after sign-in, so it must be
          opened in a separate browser tab.
        </p>

        {/* Primary action */}
        <a
          href={PEARSON_PORTAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2"
        >
          Open Pearson Portal
          <ExternalLink size={15} />
        </a>

        {/* Secondary: copy link */}
        <button
          onClick={copyLink}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-ink-600 transition-colors"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Link copied!" : "Copy link"}
        </button>

        <p className="mt-5 text-xs text-ink-400">
          After using Pearson, return to this Student App tab.
        </p>

        {/* Expandable "Why?" note */}
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          className="mt-3 inline-flex items-center gap-1 text-xs text-ink-400 hover:text-ink-600 transition-colors"
        >
          <Info size={12} />
          Why can&apos;t this load inline?
          <ChevronRight
            size={12}
            className={`transition-transform duration-200 ${whyOpen ? "rotate-90" : ""}`}
          />
        </button>

        {whyOpen && (
          <div className="mt-3 max-w-md rounded-lg border border-surface-200 bg-surface-50 p-3 text-left">
            <p className="text-xs text-ink-500 leading-relaxed">
              Pearson&apos;s servers set security headers (X-Frame-Options /
              Content-Security-Policy) that prevent their pages from being
              displayed inside another application. This is a standard security
              measure to protect your credentials. Opening in a new tab ensures
              full functionality and security.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
