"use client";

import { Calendar as CalendarIcon, Clock, BookOpen, FileText, Flag, Zap } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMoodle } from "@/lib/moodle-context";
import { calendarEvents as mockCalendarEvents } from "@/data/mock-data";
import { formatDate, daysUntil } from "@/lib/utils";

const eventTypeConfig: Record<string, { color: "brand" | "warning" | "danger" | "info"; icon: typeof BookOpen; label: string }> = {
  class: { color: "brand", icon: BookOpen, label: "Class" },
  assignment: { color: "warning", icon: Flag, label: "Assignment" },
  exam: { color: "danger", icon: FileText, label: "Exam" },
  quiz: { color: "danger", icon: Zap, label: "Quiz" },
  deadline: { color: "warning", icon: Flag, label: "Deadline" },
  event: { color: "info", icon: CalendarIcon, label: "Event" },
};

interface CalEvent {
  id: string;
  title: string;
  date: string;
  time: string | null;
  type: string;
  courseCode: string | null;
}

function groupByDate(events: CalEvent[]) {
  const groups: Record<string, CalEvent[]> = {};
  events.forEach((ev) => {
    if (!groups[ev.date]) groups[ev.date] = [];
    groups[ev.date].push(ev);
  });
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

function getWeekDays() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() + 1);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function CalendarPage() {
  const { data: moodle, isSynced } = useMoodle();

  const events: CalEvent[] = isSynced
    ? moodle!.calendarEvents.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        time: e.time,
        type: e.type,
        courseCode: e.relatedCourseCode,
      }))
    : mockCalendarEvents.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        time: e.time ?? null,
        type: e.type,
        courseCode: e.courseCode ?? null,
      }));

  const grouped = groupByDate(events);
  const weekDays = getWeekDays();
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <PageWrapper title="Calendar" subtitle={isSynced ? "Synced from Moodle" : "Your academic schedule at a glance"}>
      {/* Week Strip */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-ink-900">This Week</h3>
          <Badge variant="brand">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </Badge>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dateStr = day.toISOString().split("T")[0];
            const isToday = dateStr === todayStr;
            const dayEvents = events.filter((e) => e.date === dateStr);

            return (
              <div
                key={dateStr}
                className={`flex flex-col items-center rounded-xl p-3 transition-colors ${
                  isToday ? "bg-brand-500 text-white" : "bg-surface-50 hover:bg-surface-100"
                }`}
              >
                <span className={`text-xs font-medium ${isToday ? "text-brand-100" : "text-ink-400"}`}>
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className={`text-xl font-semibold mt-1 ${isToday ? "text-white" : "text-ink-900"}`}>
                  {day.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-2">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <span
                        key={ev.id}
                        className={`h-1.5 w-1.5 rounded-full ${
                          isToday ? "bg-white/70"
                            : ev.type === "exam" || ev.type === "quiz" ? "bg-accent-red"
                            : ev.type === "assignment" || ev.type === "deadline" ? "bg-accent-amber"
                            : "bg-brand-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHeader title="Upcoming Events" subtitle={isSynced ? "From Moodle" : "Next 3 weeks"} />
        <div className="space-y-6">
          {grouped.map(([date, dayEvents]) => {
            const days = daysUntil(date);
            if (days < 0) return null;

            return (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={14} className="text-ink-400" />
                    <span className="text-sm font-medium text-ink-900">{formatDate(date)}</span>
                  </div>
                  <Badge variant={days === 0 ? "danger" : days <= 3 ? "warning" : "default"}>
                    {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`}
                  </Badge>
                </div>

                <div className="ml-5 border-l-2 border-surface-200 pl-5 space-y-2">
                  {dayEvents.map((ev) => {
                    const config = eventTypeConfig[ev.type] ?? eventTypeConfig.event;
                    const Icon = config.icon;

                    return (
                      <div
                        key={ev.id}
                        className="flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-colors hover:bg-surface-50"
                      >
                        <div className={`rounded-lg p-2 ${
                          ev.type === "exam" || ev.type === "quiz" ? "bg-red-50 text-red-500" :
                          ev.type === "assignment" || ev.type === "deadline" ? "bg-amber-50 text-amber-500" :
                          ev.type === "event" ? "bg-blue-50 text-blue-500" :
                          "bg-brand-50 text-brand-500"
                        }`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink-900 truncate">{ev.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {ev.time && (
                              <span className="flex items-center gap-1 text-xs text-ink-500">
                                <Clock size={10} />{ev.time}
                              </span>
                            )}
                            {ev.courseCode && (
                              <span className="text-xs text-ink-400">{ev.courseCode}</span>
                            )}
                          </div>
                        </div>
                        <Badge variant={config.color}>{config.label}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {grouped.filter(([date]) => daysUntil(date) >= 0).length === 0 && (
            <p className="text-sm text-ink-400 text-center py-8">No upcoming events</p>
          )}
        </div>
      </Card>
    </PageWrapper>
  );
}
