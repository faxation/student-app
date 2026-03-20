"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Users,
  BarChart3,
  BookOpen,
  Presentation,
  ClipboardList,
  StickyNote,
  BookMarked,
  FileSpreadsheet,
  Mail,
} from "lucide-react";
import { useApi } from "@/lib/use-api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Material {
  id: string;
  category: string;
  title: string;
  description: string | null;
  fileType: string;
  date: string | null;
}

interface Participant {
  id: string;
  name: string;
  role: "Instructor" | "Student";
  email: string;
  initials: string;
}

interface GradeItem {
  id: string;
  title: string;
  earnedScore: number;
  maxScore: number;
  weight: number;
}

interface CourseDetail {
  courseId: string;
  courseName: string;
  courseCode: string;
  materials: Material[];
  participants: Participant[];
  grades: GradeItem[];
  totalGrade: number;
  letterGrade: string;
}

type Tab = "materials" | "participants" | "grades";

const tabConfig: { key: Tab; label: string; icon: typeof FileText }[] = [
  { key: "materials", label: "Materials", icon: FileText },
  { key: "participants", label: "Participants", icon: Users },
  { key: "grades", label: "Grades", icon: BarChart3 },
];

const categoryIcon: Record<string, typeof FileText> = {
  syllabus: BookOpen,
  chapter: BookMarked,
  slides: Presentation,
  assignment: ClipboardList,
  reading: FileSpreadsheet,
  notes: StickyNote,
};

const categoryLabel: Record<string, string> = {
  syllabus: "Syllabus",
  chapter: "Chapter",
  slides: "Slides",
  assignment: "Assignment",
  reading: "Reading",
  notes: "Notes",
};

const categoryBadge: Record<string, "brand" | "info" | "warning" | "success" | "danger" | "default"> = {
  syllabus: "brand",
  chapter: "info",
  slides: "warning",
  assignment: "danger",
  reading: "default",
  notes: "success",
};

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("materials");

  const { data, loading, error } = useApi<CourseDetail>(
    courseId ? `/api/student/courses/${courseId}` : null
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-xl font-semibold text-ink-900">Course not found</p>
          <button
            onClick={() => router.push("/courses")}
            className="mt-4 text-sm text-brand-500 hover:text-brand-600"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const { materials, participants, grades, totalGrade, letterGrade } = data;

  return (
    <div className="min-h-screen">
      {/* Header bar */}
      <div className="border-b border-surface-200 bg-white px-8">
        <div className="flex h-16 items-center gap-4">
          <button
            onClick={() => router.push("/courses")}
            className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-surface-100 hover:text-ink-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-xl font-semibold text-ink-900 truncate">
              {data.courseName}
            </h1>
            <p className="text-sm text-ink-500">{data.courseCode} &middot; {participants.find((p) => p.role === "Instructor")?.name ?? "TBD"}</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 -mb-px">
          {tabConfig.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-ink-500 hover:text-ink-700 hover:border-surface-300"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="p-8">
        {activeTab === "materials" && <MaterialsTab materials={materials} />}
        {activeTab === "participants" && <ParticipantsTab participants={participants} />}
        {activeTab === "grades" && (
          <GradesTab
            grades={grades}
            totalGrade={totalGrade}
            letterGrade={letterGrade}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Materials Tab ─────────────────────────────────────────────── */
function MaterialsTab({ materials }: { materials: Material[] }) {
  const grouped = materials.reduce<Record<string, typeof materials>>((acc, m) => {
    const cat = m.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});

  const order = ["syllabus", "chapter", "slides", "assignment", "reading", "notes"];
  const sortedCategories = order.filter((c) => grouped[c]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-ink-900">
          Course Materials
        </h2>
        <span className="text-sm text-ink-500">{materials.length} items</span>
      </div>

      {sortedCategories.map((cat) => {
        const Icon = categoryIcon[cat] ?? FileText;
        const items = grouped[cat];
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} className="text-ink-400" />
              <h3 className="text-sm font-semibold text-ink-700 uppercase tracking-wide">
                {categoryLabel[cat] ?? cat}
              </h3>
              <span className="text-xs text-ink-400">({items.length})</span>
            </div>
            <div className="space-y-2">
              {items.map((m) => (
                <Card key={m.id} className="!p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-ink-900">{m.title}</p>
                        {m.fileType && (
                          <Badge variant={categoryBadge[m.category] ?? "default"}>
                            {m.fileType}
                          </Badge>
                        )}
                      </div>
                      {m.description && (
                        <p className="mt-1 text-sm text-ink-500">{m.description}</p>
                      )}
                    </div>
                    {m.date && (
                      <span className="shrink-0 text-xs text-ink-400">
                        {new Date(m.date + "T00:00:00").toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Participants Tab ──────────────────────────────────────────── */
function ParticipantsTab({ participants }: { participants: Participant[] }) {
  const instructor = participants.find((p) => p.role === "Instructor");
  const students = participants.filter((p) => p.role === "Student");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-ink-900">
          Participants
        </h2>
        <span className="text-sm text-ink-500">{participants.length} people</span>
      </div>

      {/* Instructor */}
      {instructor && (
        <div>
          <h3 className="text-sm font-semibold text-ink-700 uppercase tracking-wide mb-3">
            Instructor
          </h3>
          <Card className="!p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                {instructor.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-900">{instructor.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Mail size={12} className="text-ink-400" />
                  <p className="text-sm text-ink-500 truncate">{instructor.email}</p>
                </div>
              </div>
              <Badge variant="brand">Instructor</Badge>
            </div>
          </Card>
        </div>
      )}

      {/* Students */}
      <div>
        <h3 className="text-sm font-semibold text-ink-700 uppercase tracking-wide mb-3">
          Students ({students.length})
        </h3>
        <div className="grid gap-2">
          {students.map((s) => (
            <Card key={s.id} className="!p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-100 text-xs font-semibold text-ink-600">
                  {s.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-900">{s.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Mail size={12} className="text-ink-400" />
                    <p className="text-xs text-ink-500 truncate">{s.email}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Grades Tab ────────────────────────────────────────────────── */
function GradesTab({
  grades,
  totalGrade,
  letterGrade,
}: {
  grades: GradeItem[];
  totalGrade: number;
  letterGrade: string;
}) {
  const gradeColor =
    totalGrade >= 90
      ? "text-emerald-600"
      : totalGrade >= 80
        ? "text-blue-600"
        : totalGrade >= 70
          ? "text-amber-600"
          : totalGrade >= 60
            ? "text-orange-600"
            : "text-red-600";

  const letterColor =
    letterGrade === "N/A"
      ? "bg-surface-100 text-ink-500"
      : totalGrade >= 90
        ? "bg-emerald-50 text-emerald-700"
        : totalGrade >= 80
          ? "bg-blue-50 text-blue-700"
          : totalGrade >= 70
            ? "bg-amber-50 text-amber-700"
            : totalGrade >= 60
              ? "bg-orange-50 text-orange-700"
              : "bg-red-50 text-red-700";

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <Card className="!p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-500 mb-1">Current Grade</p>
            <div className="flex items-baseline gap-3">
              <span className={`font-serif text-3xl font-bold ${gradeColor}`}>
                {letterGrade === "N/A" ? "—" : `${totalGrade.toFixed(1)}%`}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${letterColor}`}
              >
                {letterGrade}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink-500 mb-1">Graded Items</p>
            <p className="font-serif text-2xl font-semibold text-ink-900">
              {grades.filter((g) => g.earnedScore > 0).length}
              <span className="text-ink-400 text-lg">/{grades.length}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Grade items */}
      <div>
        <h2 className="font-serif text-lg font-semibold text-ink-900 mb-4">
          Grade Breakdown
        </h2>
        <div className="space-y-2">
          {grades.map((g) => {
            const pct = g.earnedScore > 0 ? (g.earnedScore / g.maxScore) * 100 : 0;
            const isGraded = g.earnedScore > 0;
            const barColor =
              !isGraded
                ? "bg-surface-200"
                : pct >= 90
                  ? "bg-emerald-500"
                  : pct >= 80
                    ? "bg-blue-500"
                    : pct >= 70
                      ? "bg-amber-500"
                      : pct >= 60
                        ? "bg-orange-500"
                        : "bg-red-500";

            return (
              <Card key={g.id} className="!p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-900">{g.title}</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      Weight: {g.weight}%
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {isGraded ? (
                      <p className="text-sm font-semibold text-ink-900">
                        {g.earnedScore}/{g.maxScore}
                        <span className="ml-1.5 text-xs text-ink-400">
                          ({pct.toFixed(0)}%)
                        </span>
                      </p>
                    ) : (
                      <Badge variant="default">Not graded</Badge>
                    )}
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-100">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
