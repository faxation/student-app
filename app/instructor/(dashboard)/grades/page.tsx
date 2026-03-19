"use client";

import { useState, useCallback } from "react";
import { BarChart3, Save, CheckCircle, Users } from "lucide-react";
import { InstructorPageWrapper } from "@/components/instructor/page-wrapper";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import {
  instructorCourses,
  instructorSections,
  sectionRosters,
} from "@/data/instructor-mock-data";
import type { GradeEntry } from "@/lib/instructor-types";

export default function InstructorGradesPage() {
  const [courseId, setCourseId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [grades, setGrades] = useState<Record<string, Record<string, string>>>(
    {}
  );
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  const availableSections = courseId
    ? instructorSections.filter((s) => s.courseId === courseId)
    : [];

  const students = sectionId ? sectionRosters[sectionId] ?? [] : [];

  // Get current grades for this section
  const currentGrades = sectionId ? grades[sectionId] ?? {} : {};

  const handleGradeChange = useCallback(
    (studentId: string, value: string) => {
      if (!sectionId) return;
      setGrades((prev) => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          [studentId]: value,
        },
      }));
      setSaveStatus("idle");
    },
    [sectionId]
  );

  const handleSave = async () => {
    setSaveStatus("saving");
    // Simulate save delay
    await new Promise((r) => setTimeout(r, 600));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const filledCount = Object.values(currentGrades).filter(
    (g) => g.trim() !== ""
  ).length;

  return (
    <InstructorPageWrapper
      title="Grades"
      subtitle="Input and manage student grades"
    >
      {/* Stats */}
      <div className="page-grid-3 mb-8">
        <StatCard
          label="Courses"
          value={instructorCourses.length}
          subtitle="Available to grade"
          icon={<BarChart3 size={20} />}
          accent="brand"
        />
        <StatCard
          label="Sections"
          value={instructorSections.length}
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
          Select Course & Section
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Course
            </label>
            <select
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setSectionId("");
                setSaveStatus("idle");
              }}
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Select a course</option>
              {instructorCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>

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
              disabled={!courseId}
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-surface-100 disabled:text-ink-400"
            >
              <option value="">Select a section</option>
              {availableSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.meetingTime})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Grades Table */}
      {sectionId && students.length > 0 && (
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
            <div className="col-span-3">Student ID</div>
            <div className="col-span-5">Student Name</div>
            <div className="col-span-3 text-right">Grade</div>
          </div>

          {/* Student Rows */}
          <div className="divide-y divide-surface-100">
            {students.map((student, index) => (
              <div
                key={student.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 items-center transition-colors hover:bg-surface-50"
              >
                <div className="col-span-1">
                  <span className="text-sm text-ink-400">{index + 1}</span>
                </div>

                <div className="col-span-3">
                  <span className="text-sm font-mono text-ink-600">
                    {student.studentId}
                  </span>
                </div>

                <div className="col-span-5">
                  <span className="text-sm font-medium text-ink-900">
                    {student.name}
                  </span>
                </div>

                <div className="col-span-3 flex justify-end">
                  <input
                    type="text"
                    value={currentGrades[student.id] ?? ""}
                    onChange={(e) =>
                      handleGradeChange(student.id, e.target.value)
                    }
                    placeholder="—"
                    className="w-24 rounded-lg border border-surface-300 bg-white px-3 py-1.5 text-center text-sm text-ink-900 placeholder:text-ink-300 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>
            ))}
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
      {sectionId && students.length === 0 && (
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
              Select a course and section above to view and input student grades.
            </p>
          </div>
        </Card>
      )}
    </InstructorPageWrapper>
  );
}
