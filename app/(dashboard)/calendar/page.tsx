"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  FileText,
  Flag,
  Zap,
  ChevronDown,
} from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calendarEvents as mockCalendarEvents } from "@/data/mock-data";
import { formatDate, daysUntil } from "@/lib/utils";

// ─── Event type config ──────────────────────────────────────────
const eventTypeConfig: Record<
  string,
  { color: "brand" | "warning" | "danger" | "info"; icon: typeof BookOpen; label: string }
> = {
  class: { color: "brand", icon: BookOpen, label: "Class" },
  assignment: { color: "warning", icon: Flag, label: "Assignment" },
  exam: { color: "danger", icon: FileText, label: "Exam" },
  quiz: { color: "danger", icon: Zap, label: "Quiz" },
  deadline: { color: "warning", icon: Flag, label: "Deadline" },
  event: { color: "info", icon: CalendarIcon, label: "Event" },
};

// ─── Types ──────────────────────────────────────────────────────
interface CalEvent {
  id: string;
  title: string;
  date: string;
  time: string | null;
  type: string;
  courseCode: string | null;
}

// ─── Helpers ────────────────────────────────────────────────────
function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getWeekContaining(dateStr: string): Date[] {
  const d = new Date(dateStr + "T12:00:00");
  const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ...
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(d);
  monday.setDate(d.getDate() + mondayOffset);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    days.push(day);
  }
  return days;
}

function getMonthGrid(dateStr: string): { date: Date; isCurrentMonth: boolean }[] {
  const d = new Date(dateStr + "T12:00:00");
  const year = d.getFullYear();
  const month = d.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Start from Monday of the week containing the 1st
  const startDow = firstDay.getDay(); // 0=Sun
  const startOffset = startDow === 0 ? -6 : 1 - startDow;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() + startOffset);

  // End on Sunday of the week containing the last day
  const endDow = lastDay.getDay();
  const endOffset = endDow === 0 ? 0 : 7 - endDow;
  const gridEnd = new Date(lastDay);
  gridEnd.setDate(lastDay.getDate() + endOffset);

  const cells: { date: Date; isCurrentMonth: boolean }[] = [];
  const cursor = new Date(gridStart);
  while (cursor <= gridEnd) {
    cells.push({
      date: new Date(cursor),
      isCurrentMonth: cursor.getMonth() === month,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return cells;
}

function groupByDate(events: CalEvent[]) {
  const groups: Record<string, CalEvent[]> = {};
  events.forEach((ev) => {
    if (!groups[ev.date]) groups[ev.date] = [];
    groups[ev.date].push(ev);
  });
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

// ─── Event card renderer ────────────────────────────────────────
function EventCard({ ev }: { ev: CalEvent }) {
  const config = eventTypeConfig[ev.type] ?? eventTypeConfig.event;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-colors hover:bg-surface-50">
      <div
        className={`rounded-lg p-2 ${
          ev.type === "exam" || ev.type === "quiz"
            ? "bg-red-50 text-red-500"
            : ev.type === "assignment" || ev.type === "deadline"
            ? "bg-amber-50 text-amber-500"
            : ev.type === "event"
            ? "bg-blue-50 text-blue-500"
            : "bg-brand-50 text-brand-500"
        }`}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink-900 truncate">{ev.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {ev.time && (
            <span className="flex items-center gap-1 text-xs text-ink-500">
              <Clock size={10} />
              {ev.time}
            </span>
          )}
          {ev.courseCode && <span className="text-xs text-ink-400">{ev.courseCode}</span>}
        </div>
      </div>
      <Badge variant={config.color}>{config.label}</Badge>
    </div>
  );
}

// ─── Day indicator dots ─────────────────────────────────────────
function DayIndicators({
  dayEvents,
  isHighlighted,
}: {
  dayEvents: CalEvent[];
  isHighlighted: boolean;
}) {
  const hasClass = dayEvents.some((e) => e.type === "class");
  const hasAssignment = dayEvents.some(
    (e) => e.type === "assignment" || e.type === "deadline"
  );
  const hasExam = dayEvents.some((e) => e.type === "exam" || e.type === "quiz");

  if (!hasClass && !hasAssignment && !hasExam) return null;

  return (
    <div className="flex gap-1 mt-1.5">
      {hasClass && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isHighlighted ? "bg-white/80" : "bg-emerald-500"
          }`}
        />
      )}
      {hasAssignment && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isHighlighted ? "bg-white/80" : "bg-amber-500"
          }`}
        />
      )}
      {hasExam && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isHighlighted ? "bg-white/80" : "bg-red-500"
          }`}
        />
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────
export default function CalendarPage() {
  const todayStr = toDateStr(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [upcomingOpen, setUpcomingOpen] = useState(true);

  // ─── Normalize events ───────────────────────────────────────
  const events: CalEvent[] = mockCalendarEvents.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time ?? null,
    type: e.type,
    courseCode: e.courseCode ?? null,
  }));

  // ─── Derived data ───────────────────────────────────────────
  const weekDays = getWeekContaining(selectedDate);
  const monthGrid = getMonthGrid(selectedDate);

  const selectedDayEvents = events
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));

  const upcomingEvents = events.filter((e) => e.date > selectedDate);
  const upcomingGrouped = groupByDate(upcomingEvents);

  // ─── Click handlers ─────────────────────────────────────────
  function handleDayClick(dateStr: string) {
    setSelectedDate(dateStr);
    if (viewMode === "month") {
      setViewMode("week");
    }
  }

  // ─── Month label ────────────────────────────────────────────
  const selectedDateObj = new Date(selectedDate + "T12:00:00");
  const monthLabel = selectedDateObj.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <PageWrapper
      title="Calendar"
      subtitle="Your academic schedule at a glance"
    >
      {/* Calendar Card */}
      <Card className="mb-6">
        {/* Header: View toggle + month label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex rounded-lg overflow-hidden border border-surface-200">
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "week"
                  ? "bg-brand-500 text-white"
                  : "bg-surface-50 text-ink-600 hover:bg-surface-100"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                viewMode === "month"
                  ? "bg-brand-500 text-white"
                  : "bg-surface-50 text-ink-600 hover:bg-surface-100"
              }`}
            >
              This Month
            </button>
          </div>
          <Badge variant="brand">{monthLabel}</Badge>
        </div>

        {/* Week View */}
        {viewMode === "week" && (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dateStr = toDateStr(day);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const dayEvents = events.filter((e) => e.date === dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => handleDayClick(dateStr)}
                  className={`flex flex-col items-center rounded-xl p-3 cursor-pointer transition-all ${
                    isSelected && isToday
                      ? "bg-brand-500 text-white ring-2 ring-brand-500 ring-offset-2"
                      : isSelected
                      ? "bg-brand-50 ring-2 ring-brand-500 ring-offset-2"
                      : isToday
                      ? "bg-brand-500 text-white"
                      : "bg-surface-50 hover:bg-surface-100"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isSelected && isToday
                        ? "text-brand-100"
                        : isSelected
                        ? "text-brand-600"
                        : isToday
                        ? "text-brand-100"
                        : "text-ink-400"
                    }`}
                  >
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span
                    className={`text-xl font-semibold mt-1 ${
                      isSelected && isToday
                        ? "text-white"
                        : isSelected
                        ? "text-brand-700"
                        : isToday
                        ? "text-white"
                        : "text-ink-900"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <DayIndicators
                    dayEvents={dayEvents}
                    isHighlighted={isToday && (!isSelected || isSelected)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Month View */}
        {viewMode === "month" && (
          <div>
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-medium text-ink-400 py-1"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {monthGrid.map(({ date, isCurrentMonth }) => {
                const dateStr = toDateStr(date);
                const isToday = dateStr === todayStr;
                const dayEvents = events.filter((e) => e.date === dateStr);

                return (
                  <div
                    key={dateStr}
                    onClick={() => handleDayClick(dateStr)}
                    className={`flex flex-col items-center rounded-lg p-2 cursor-pointer transition-all ${
                      isToday
                        ? "bg-brand-500 text-white"
                        : isCurrentMonth
                        ? "bg-surface-50 hover:bg-surface-100"
                        : "bg-white hover:bg-surface-50"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isToday
                          ? "text-white"
                          : isCurrentMonth
                          ? "text-ink-900"
                          : "text-ink-300"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    <DayIndicators dayEvents={dayEvents} isHighlighted={isToday} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Selected Day Events */}
      <Card className="mb-6">
        <CardHeader
          title={formatDate(selectedDate)}
          subtitle={
            selectedDate === todayStr
              ? "Today"
              : `${Math.abs(daysUntil(selectedDate))} day${Math.abs(daysUntil(selectedDate)) !== 1 ? "s" : ""} ${daysUntil(selectedDate) >= 0 ? "from now" : "ago"}`
          }
        />
        {selectedDayEvents.length > 0 ? (
          <div className="space-y-2">
            {selectedDayEvents.map((ev) => (
              <EventCard key={ev.id} ev={ev} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink-400 text-center py-6">
            No events for this day
          </p>
        )}
      </Card>

      {/* Upcoming Events (collapsible) */}
      <Card>
        <button
          onClick={() => setUpcomingOpen(!upcomingOpen)}
          className="flex items-center justify-between w-full mb-2"
        >
          <div>
            <h3 className="font-serif text-lg font-semibold text-ink-900">
              Upcoming Events
            </h3>
            <p className="text-sm text-ink-500 mt-0.5">
              {upcomingGrouped.length > 0
                ? `${upcomingEvents.length} events after ${formatDate(selectedDate)}`
                : "No upcoming events"}
            </p>
          </div>
          <ChevronDown
            size={20}
            className={`text-ink-400 transition-transform duration-200 ${
              upcomingOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {upcomingOpen && (
          <div className="space-y-6 pt-2">
            {upcomingGrouped.map(([date, dayEvents]) => {
              const days = daysUntil(date);
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
                        days === 0
                          ? "danger"
                          : days <= 3
                          ? "warning"
                          : "default"
                      }
                    >
                      {days === 0
                        ? "Today"
                        : days === 1
                        ? "Tomorrow"
                        : `In ${days} days`}
                    </Badge>
                  </div>

                  <div className="ml-5 border-l-2 border-surface-200 pl-5 space-y-2">
                    {dayEvents.map((ev) => (
                      <EventCard key={ev.id} ev={ev} />
                    ))}
                  </div>
                </div>
              );
            })}

            {upcomingGrouped.length === 0 && (
              <p className="text-sm text-ink-400 text-center py-6">
                No upcoming events
              </p>
            )}
          </div>
        )}
      </Card>
    </PageWrapper>
  );
}
