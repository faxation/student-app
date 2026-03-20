"use client";

import { useState, useCallback } from "react";
import { BarChart3, Save, CheckCircle, Users } from "lucide-react";
import { InstructorPageWrapper } from "@/components/instructor/page-wrapper";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { useApi } from "@/lib/use-api";
import { getLetterGrade } from "@/lib/grade-utils";

interface Section {
  id: string;
  number: string;
  courseCode: string;
  courseName: string;
  status: string;
  modality: string;
  meetingTimes: string;
  enrollmentCount: number;
  maxCapacity: number;
}

interface SectionsResponse {
  sections: Section[];
}

interface RosterStudent {
  id: string;
  name: string;
  studentNumber: string;
  currentGrade: number | null;
  letterGrade: string | null;
}

interface RosterResponse {
  roster: RosterStudent[];
}

export default function InstructorGradesPage() {
  const [sectionId, setSectionId] = useState("");
  const [grades, setGrades] = useState<Record<string, Record<string, string>>>(
    {}
  );
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  const { data: sectionsData, loading: sectionsLoading, error: sectionsError } =
    useApi<SectionsResponse>("/api/instructor/sections");

  const { data: rosterData, loading: rosterLoading } =
    useApi<RosterResponse>(sectionId ? `/api/instructor/grades/roster?sectionId=${sectionId}` : null);

  if (sectionsLoading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" /></div>;
  if (sectionsError) return <div className="p-6 text-red-600">Failed to load data.</div>;

  const sections = sectionsData?.sections ?? [];
  const students = rosterData?.roster ?? [];

  // Get current grades for this section
  const currentGrades = sectionId ? grades[sectionId] ?? {} : {};

  const handleGradeChange = (studentId: string, value: string) => {
    if (!sectionId) return;
    setGrades((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [studentId]: value,
      },
    }));
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    if (!sectionId) return;
    setSaveStatus("saving");
    try {
      const gradeEntries = Object.entries(currentGrades)
        .filter(([, g]) => g.trim() !== "")
        .map(([studentId, numericGrade]) => ({
          studentId,
          numericGrade: Number(numericGrade),
        }));

      const res = await fetch("/api/instructor/grades/bulk-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, grades: gradeEntries }),
      });
      if (!res.ok) throw new Error("Failed to save grades");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      alert("Failed to save grades. Please try again.");
      setSaveStatus("idle");
    }
  };

  const filledCount = Object.values(currentGrades).filter(
    (g) => g.trim() !== ""
  ).length;

  // Group sections by course for the dropdown
  const courseMap = new Map<string, { code: string; name: string }>();
  for (const s of sections) {
    if (!courseMap.has(s.courseCode)) {
      courseMap.set(s.courseCode, { code: s.courseCode, name: s.courseName });
    }
  }
  const courses = Array.from(courseMap.values());

  return (
    <InstructorPageWrapper
      title="Grades"
      subtitle="Input and manage student grades"
    >
      {/* Stats */}
      <div className="page-grid-3 mb-8">
        <StatCard
          label="Courses"
          value={courses.length}
          subtitle="Available to grade"
          icon={<BarChart3 size={20} />}
          accent="brand"
        />
        <StatCard
          label="Sections"
          value={sections.length}
          subtitle="Total sections"
          icon={<Users size={20} />}
          accent="blue"
        />
        <StatCard
          label="Graded"
          value={
            Object.values(grades).reduce(
              (sum, sectionGrades) =>
                sum +
                Object.values(sectionGrades).filter((g) => g.trim() !== "")
                  .length,
              0
            )
          }
          subtitle="Students graded (session)"
          icon={<CheckCircle size={20} />}
          accent="amber"
        />
      </div>

      {/* Selection Controls */}
      <Card className="mb-6">
        <h3 className="font-serif text-lg font-semibold text-ink-900 mb-4">
          Select Section
        </h3>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">
            Section
          </label>
          <select
            value={sectionId}
            onChange={(e) => {
              setSectionId(e.target.value);
              setSaveStatus("idle");
            }}
            className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Select a section</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.courseCode} – Section {s.number} ({s.meetingTimes})
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Grades Table */}
      {sectionId && rosterLoading && (
        <div className="flex items-center justify-center h-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      )}

      {sectionId && !rosterLoading && students.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg font-semibold text-ink-900">
                Student Grades
              </h3>
              <p className="mt-0.5 text-sm text-ink-500">
                {students.length} students &middot; {filledCount} graded
              </p>
            </div>
            {saveStatus === "saved" && (
              <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                <CheckCircle size={16} />
                <span>Saved</span>
              </div>
            )}
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-ink-400 uppercase tracking-wider border-b border-surface-200">
            <div className="col-span-1">#</div>
            <div className="col-span-2">Student ID</div>
            <div className="col-span-4">Student Name</div>
            <div className="col-span-3 text-right">Grade</div>
            <div className="col-span-2 text-right">Letter Grade</div>
          </div>

          {/* Student Rows */}
          <div className="divide-y divide-surface-100">
            {students.map((student, index) => {
              const rawValue = currentGrades[student.id] ?? (student.currentGrade != null ? String(student.currentGrade) : "");
              const numericValue = rawValue.trim() !== "" ? Number(rawValue) : null;
              const letter = numericValue != null && !isNaN(numericValue) ? getLetterGrade(numericValue) : "";

              return (
                <div
                  key={student.id}
                  className="grid grid-cols-12 gap-4 px-4 py-3 items-center transition-colors hover:bg-surface-50"
                >
                  <div className="col-span-1">
                    <span className="text-sm text-ink-400">{index + 1}</span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-sm font-mono text-ink-600">
                      {student.studentNumber}
                    </span>
                  </div>

                  <div className="col-span-4">
                    <span className="text-sm font-medium text-ink-900">
                      {student.name}
                    </span>
                  </div>

                  <div className="col-span-3 flex justify-end">
                    <input
                      type="text"
                      value={rawValue}
                      onChange={(e) =>
                        handleGradeChange(student.id, e.target.value)
                      }
                      placeholder="—"
                      className="w-24 rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-center text-sm text-ink-900 placeholder:text-ink-300 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <span className={`inline-flex h-8 w-10 items-center justify-center rounded-lg text-sm font-semibold ${
                      letter === "A" ? "bg-emerald-50 text-emerald-700"
                        : letter === "B" ? "bg-blue-50 text-blue-700"
                        : letter === "C" ? "bg-amber-50 text-amber-700"
                        : letter === "D" ? "bg-orange-50 text-orange-700"
                        : letter === "F" ? "bg-red-50 text-red-700"
                        : "text-ink-300"
                    }`}>
                      {letter || "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save Button */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-surface-200 pt-4">
            <button
              onClick={handleSave}
              disabled={saveStatus === "saving"}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saveStatus === "saving" ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Grades
                </>
              )}
            </button>
          </div>
        </Card>
      )}

      {/* Empty state */}
      {sectionId && !rosterLoading && students.length === 0 && (
        <Card>
          <div className="py-12 text-center">
            <Users size={32} className="mx-auto mb-3 text-ink-300" />
            <p className="text-sm text-ink-500">
              No students found for this section.
            </p>
          </div>
        </Card>
      )}

      {!sectionId && (
        <Card>
          <div className="py-12 text-center">
            <BarChart3 size={32} className="mx-auto mb-3 text-ink-300" />
            <p className="text-sm text-ink-500">
              Select a section above to view and input student grades.
            </p>
          </div>
        </Card>
      )}
    </InstructorPageWrapper>
  );
}
