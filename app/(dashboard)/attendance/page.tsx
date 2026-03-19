"use client";

import { ClipboardCheck, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { attendanceRecords } from "@/data/mock-data";

export default function AttendancePage() {
  const totalPresent = attendanceRecords.reduce((s, r) => s + r.present, 0);
  const totalExcused = attendanceRecords.reduce((s, r) => s + r.excusedAbsences, 0);
  const totalUnexcused = attendanceRecords.reduce((s, r) => s + r.unexcusedAbsences, 0);
  const totalSessions = attendanceRecords.reduce((s, r) => s + r.totalSessions, 0);
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
          subtitle={`Across ${attendanceRecords.length} courses`}
          icon={<UserCheck size={20} />}
          accent="blue"
        />
        <StatCard
          label="Total Absences"
          value={totalExcused + totalUnexcused}
          subtitle={totalExcused > 0 ? `${totalExcused} excused · ${totalUnexcused} unexcused` : `${totalUnexcused} unexcused`}
          icon={<XCircle size={20} />}
          accent="red"
        />
      </div>

      {/* Course Attendance Cards */}
      <div className="page-grid-2">
        {attendanceRecords.map((record) => {
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
                    {record.courseCode} · Section {record.section}
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
                  <p className="text-lg font-semibold text-amber-600">{record.excusedAbsences}</p>
                  <p className="text-xs text-ink-500">Excused</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-red-600">{record.unexcusedAbsences}</p>
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
