"use client";

import { Calendar as CalendarIcon, Clock, BookOpen, FileText, Flag } from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calendarEvents } from "@/data/mock-data";
import { formatDate, daysUntil } from "@/lib/utils";

const eventTypeConfig = {
  class: { color: "brand" as const, icon: BookOpen, label: "Class" },
  assignment: { color: "warning" as const, icon: Flag, label: "Assignment" },
  exam: { color: "danger" as const, icon: FileText, label: "Exam" },
  event: { color: "info" as const, icon: CalendarIcon, label: "Event" },
};

// Group events by date
function groupByDate(events: typeof calendarEvents) {
  const groups: Record<string, typeof calendarEvents> = {};
  events.forEach((ev) => {
    if (!groups[ev.date]) groups[ev.date] = [];
    groups[ev.date].push(ev);
  });
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

// Generate simple week view
function getWeekDays() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() + 1); // Monday
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function CalendarPage() {
  const grouped = groupByDate(calendarEvents);
  const weekDays = getWeekDays();
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <PageWrapper title="Calendar" subtitle="Your academic schedule at a glance">
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
            const dayEvents = calendarEvents.filter((e) => e.date === dateStr);

            return (
              <div
                key={dateStr}
                className={`flex flex-col items-center rounded-xl p-3 transition-colors ${
                  isToday
                    ? "bg-brand-500 text-white"
                    : "bg-surface-50 hover:bg-surface-100"
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
                          isToday
                            ? "bg-white/70"
                            : ev.type === "exam"
                            ? "bg-accent-red"
                            : ev.type === "assignment"
                            ? "bg-accent-amber"
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

      <div className="page-grid-2">
        {/* Upcoming Events Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader title="Upcoming Events" subtitle="Next 3 weeks" />
          <div className="space-y-6">
            {grouped.map(([date, events]) => {
              const days = daysUntil(date);
              if (days < 0) return null;

              return (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={14} className="text-ink-400" />
                      <span className="text-sm font-medium text-ink-900">
                        {formatDate(date)}
                      </span>
                    </div>
                    <Badge
                      variant={
                        days === 0 ? "danger" : days <= 3 ? "warning" : "default"
                      }
                    >
                      {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`}
                    </Badge>
                  </div>

                  <div className="ml-5 border-l-2 border-surface-200 pl-5 space-y-2">
                    {events.map((ev) => {
                      const config = eventTypeConfig[ev.type];
                      const Icon = config.icon;

                      return (
                        <div
                          key={ev.id}
                          className="flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-colors hover:bg-surface-50"
                        >
                          <div className={`rounded-lg p-2 ${
                            ev.type === "exam" ? "bg-red-50 text-red-500" :
                            ev.type === "assignment" ? "bg-amber-50 text-amber-500" :
                            ev.type === "event" ? "bg-blue-50 text-blue-500" :
                            "bg-brand-50 text-brand-500"
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink-900 truncate">
                              {ev.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {ev.time && (
                                <span className="flex items-center gap-1 text-xs text-ink-500">
                                  <Clock size={10} />
                                  {ev.time}
                                </span>
                              )}
                              {ev.courseCode && (
                                <span className="text-xs text-ink-400">
                                  {ev.courseCode}
                                </span>
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
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
