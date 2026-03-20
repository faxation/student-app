"use client";

import { ClipboardCheck, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { useApi } from "@/lib/use-api";

interface AttendanceSummary {
  sectionId: string;
  courseCode: string;
  courseName: string;
  sectionNumber: string;
  totalSessions: number;
  present: number;
  late: number;
  excused: number;
  absent: number;
  warningLevel: string;
}

interface AttendanceResponse {
  summaries: AttendanceSummary[];
}

export default function AttendancePage() {
  const { data, loading, error } = useApi<AttendanceResponse>("/api/student/attendance");

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" /></div>;
  if (error) return <div className="p-6 text-red-600">Failed to load data.</div>;

  const summaries = data?.summaries ?? [];

  const totalPresent = summaries.reduce((s, r) => s + r.present, 0);
  const totalExcused = summaries.reduce((s, r) => s + r.excused, 0);
  const totalAbsent = summaries.reduce((s, r) => s + r.absent, 0);
  const totalSessions = summaries.reduce((s, r) => s + r.totalSessions, 0);
  const overallRate = totalSessions > 0 ? Math.round((totalPresent / totalSessions) * 1000) / 10 : 0;

  return (
    <PageWrapper title="Attendance" subtitle="Spring 2026 attendance report">
      {/* Stats */}
      <div className="page-grid-3 mb-8">
        <StatCard
          label="Overall Attendance"
          value={`${overallRate}%`}
          subtitle={`${totalPresent} of ${totalSessions} sessions`}
          icon={<ClipboardCheck size={20} />}
          accent="brand"
        />
        <StatCard
          label="Total Present"
          value={totalPresent}
          subtitle={`Across ${summaries.length} courses`}
          icon={<UserCheck size={20} />}
          accent="blue"
        />
        <StatCard
          label="Total Absences"
          value={totalExcused + totalAbsent}
          subtitle={totalExcused > 0 ? `${totalExcused} excused · ${totalAbsent} unexcused` : `${totalAbsent} unexcused`}
          icon={<XCircle size={20} />}
          accent="red"
        />
      </div>

      {/* Course Attendance Cards */}
      <div className="page-grid-2">
        {summaries.map((record) => {
          const pct = record.totalSessions > 0
            ? Math.round((record.present / record.totalSessions) * 1000) / 10
            : 0;

          return (
            <Card key={record.courseCode} hover>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-ink-900">
                    {record.courseName}
                  </h3>
                  <p className="text-sm text-ink-500 mt-0.5">
                    {record.courseCode} · Section {record.sectionNumber}
                  </p>
                </div>
                <Badge variant={pct >= 90 ? "success" : pct >= 75 ? "warning" : "danger"}>
                  {pct}%
                </Badge>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-2 w-full rounded-full bg-surface-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct >= 90
                        ? "bg-emerald-500"
                        : pct >= 75
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-emerald-600">{record.present}</p>
                  <p className="text-xs text-ink-500">Present</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-amber-600">{record.excused}</p>
                  <p className="text-xs text-ink-500">Excused</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-red-600">{record.absent}</p>
                  <p className="text-xs text-ink-500">Unexcused</p>
                </div>
              </div>

              {/* Session count + View details */}
              <div className="mt-4 pt-4 border-t border-surface-200 flex items-center justify-between">
                <span className="text-xs text-ink-400">
                  {record.totalSessions} total sessions
                </span>
                <span className="text-xs text-brand-500 font-medium">
                  View details
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </PageWrapper>
  );
}
