"use client";

import { useState, useRef, useCallback } from "react";
import { ClipboardList, ChevronDown, ExternalLink, Loader2, ShieldAlert } from "lucide-react";
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
      <PearsonPortalCard expanded={!assignmentsOpen} />
    </PageWrapper>
  );
}

// ─── Pearson Portal Card ─────────────────────────────────────────

type PortalState = "idle" | "loading" | "embedded" | "blocked";

function PearsonPortalCard({ expanded }: { expanded: boolean }) {
  const [state, setState] = useState<PortalState>("idle");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = useCallback(() => {
    // If the iframe loaded, try to detect if it was actually blocked.
    // Browsers block cross-origin access, so trying to read contentWindow
    // will throw if the page loaded but we can't confirm content.
    // If X-Frame-Options blocked it, the iframe shows a blank/error page.
    // We use a heuristic: set a short timeout after load to mark as embedded,
    // since a blocked frame often doesn't fire onload at all or fires with blank content.
    setState("embedded");
  }, []);

  const handleError = useCallback(() => {
    setState("blocked");
  }, []);

  const launchPortal = useCallback(() => {
    setState("loading");

    // Give the iframe a moment — if onload never fires or the frame is blank,
    // fall back after a timeout.
    const timeout = setTimeout(() => {
      setState((prev) => (prev === "loading" ? "blocked" : prev));
    }, 8000);

    // Store cleanup in ref-accessible scope
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.dataset.timeout = String(timeout);
    }

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Card className="mt-6">
      <CardHeader
        title="Pearson Portal"
        subtitle="Access your Pearson assignments and resources"
        action={
          state === "embedded" ? (
            <Badge variant="success">Connected</Badge>
          ) : state === "blocked" ? (
            <Badge variant="warning">Restricted</Badge>
          ) : null
        }
      />

      {state === "idle" && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
            <ExternalLink size={24} className="text-brand-500" />
          </div>
          <p className="text-sm text-ink-600 max-w-md mb-4">
            Load the Pearson sign-in portal directly inside the Assignments section.
          </p>
          <button
            onClick={launchPortal}
            className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Open Pearson Portal
          </button>
        </div>
      )}

      {state === "loading" && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Loader2 size={28} className="animate-spin text-brand-500 mb-3" />
          <p className="text-sm text-ink-500">Loading Pearson portal…</p>
        </div>
      )}

      {(state === "loading" || state === "embedded") && (
        <div
          className={`relative w-full overflow-hidden rounded-lg border border-surface-200 ${
            state === "loading" ? "h-0 opacity-0" : "opacity-100"
          }`}
          style={state === "embedded" ? { height: expanded ? "calc(100vh - 200px)" : "600px", minHeight: expanded ? "700px" : "600px" } : undefined}
        >
          <iframe
            ref={iframeRef}
            src={PEARSON_PORTAL_URL}
            title="Pearson Portal"
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      )}

      {state === "blocked" && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-surface-200 bg-surface-50 py-10 text-center">
          <ShieldAlert size={28} className="text-ink-400 mb-3" />
          <p className="text-sm font-medium text-ink-700 mb-1">
            Embedding Restricted
          </p>
          <p className="text-sm text-ink-500 max-w-md mb-5">
            Pearson&apos;s sign-in page cannot be displayed inline due to the site&apos;s
            security restrictions. You can open it manually below.
          </p>
          <a
            href={PEARSON_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            <ExternalLink size={14} />
            Open Pearson Sign-In
          </a>
        </div>
      )}
    </Card>
  );
}
