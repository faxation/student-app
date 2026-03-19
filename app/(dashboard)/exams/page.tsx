"use client";

import { FileText, Clock, MapPin, Monitor, AlertTriangle } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { exams as mockExams } from "@/data/mock-data";
import { formatDate, daysUntil, cn } from "@/lib/utils";

const typeConfig = {
  midterm: { label: "Midterm", variant: "warning" as const },
  final: { label: "Final", variant: "danger" as const },
  quiz: { label: "Quiz", variant: "info" as const },
  exam: { label: "Exam", variant: "danger" as const },
};

export default function ExamsPage() {
  const exams = mockExams;

  const sortedExams = [...exams].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sortedExams.filter((e) => daysUntil(e.date) >= 0);

  return (
    <PageWrapper title="Exams" subtitle="Upcoming examinations and quizzes">
      {/* Urgency banner */}
      {upcoming.length > 0 && (() => {
        const nearest = upcoming[0];
        const days = daysUntil(nearest.date);
        if (days > 7) return null;
        return (
          <div className={cn(
            "mb-6 flex items-start gap-3 rounded-lg border p-4",
            days <= 2 ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"
          )}>
            <AlertTriangle size={18} className={cn("mt-0.5 shrink-0", days <= 2 ? "text-red-500" : "text-amber-500")} />
            <div>
              <p className={cn("text-sm font-medium", days <= 2 ? "text-red-800" : "text-amber-800")}>
                {days === 0 ? "Exam today!" : days === 1 ? "Exam tomorrow!" : `Next exam in ${days} days`}
              </p>
              <p className={cn("mt-0.5 text-sm", days <= 2 ? "text-red-600" : "text-amber-600")}>
                {nearest.courseName} ({nearest.courseCode}) — {nearest.time}
              </p>
            </div>
          </div>
        );
      })()}

      {sortedExams.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText size={40} className="text-ink-300 mb-4" />
            <h3 className="font-serif text-lg font-semibold text-ink-700">No Exams Found</h3>
            <p className="mt-1 max-w-sm text-sm text-ink-500">
              No upcoming exams scheduled at this time.
            </p>
          </div>
        </Card>
      ) : (
        <div className="page-grid-2">
          {sortedExams.map((exam) => {
            const days = daysUntil(exam.date);
            const isPast = days < 0;
            const config = typeConfig[exam.type] ?? typeConfig.exam;

            return (
              <Card key={exam.id} hover className={isPast ? "opacity-60" : ""}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-ink-900">{exam.courseName || exam.courseCode || "Untitled"}</h3>
                    <p className="text-sm text-ink-500 mt-0.5">{exam.courseCode}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={config.variant}>{config.label}</Badge>
                    {!isPast && days <= 3 && (
                      <Badge variant="danger">
                        {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-ink-500">
                      <FileText size={14} className="text-ink-400" />
                      <span>{formatDate(exam.date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-ink-500">
                      <Clock size={14} className="text-ink-400" />
                      <span>{exam.time} ({exam.duration})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-ink-500">
                      {exam.format === "online" ? (
                        <Monitor size={14} className="text-ink-400" />
                      ) : (
                        <MapPin size={14} className="text-ink-400" />
                      )}
                      <span>{exam.room}</span>
                    </div>
                    <Badge variant={exam.format === "online" ? "info" : "default"}>
                      {exam.format === "online" ? "Online" : "In-Person"}
                    </Badge>
                  </div>
                </div>

                {!isPast && (
                  <div className="mt-4 pt-4 border-t border-surface-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-400">Countdown</span>
                      <span className={cn(
                        "text-sm font-semibold",
                        days <= 2 ? "text-red-600" : days <= 5 ? "text-amber-600" : "text-ink-700"
                      )}>
                        {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days away`}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-surface-100">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          days <= 2 ? "bg-red-500" : days <= 5 ? "bg-amber-500" : "bg-brand-500"
                        )}
                        style={{ width: `${Math.max(5, 100 - days * 6)}%` }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}
