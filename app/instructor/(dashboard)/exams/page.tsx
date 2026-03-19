"use client";

import { useState, useCallback, type FormEvent, type DragEvent } from "react";
import {
  FileText,
  Plus,
  X,
  Upload,
  FileUp,
  Trash2,
  Calendar,
} from "lucide-react";
import { InstructorPageWrapper } from "@/components/instructor/page-wrapper";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  instructorExams as initialExams,
  instructorCourses,
  instructorSections,
} from "@/data/instructor-mock-data";
import type { InstructorExam } from "@/lib/instructor-types";

export default function InstructorExamsPage() {
  const [exams, setExams] = useState<InstructorExam[]>(initialExams);
  const [showForm, setShowForm] = useState(false);

  return (
    <InstructorPageWrapper title="Exams" subtitle="Manage and create exam files">
      {/* Stats */}
      <div className="page-grid-3 mb-8">
        <StatCard
          label="Total Exams"
          value={exams.length}
          subtitle="All courses"
          icon={<FileText size={20} />}
          accent="brand"
        />
        <StatCard
          label="With Files"
          value={exams.filter((e) => e.hasFile).length}
          subtitle="Files attached"
          icon={<FileUp size={20} />}
          accent="blue"
        />
        <StatCard
          label="Courses Covered"
          value={new Set(exams.map((e) => e.courseId)).size}
          subtitle="Unique courses"
          icon={<Calendar size={20} />}
          accent="amber"
        />
      </div>

      {/* Create button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2"
        >
          <Plus size={16} />
          New Exam
        </button>
      )}

      {/* Create form */}
      {showForm && (
        <CreateExamForm
          onClose={() => setShowForm(false)}
          onSave={(exam) => {
            setExams((prev) => [...prev, exam]);
            setShowForm(false);
          }}
        />
      )}

      {/* Exams Table */}
      <Card>
        <div className="mb-4">
          <h3 className="font-serif text-lg font-semibold text-ink-900">
            All Exams
          </h3>
          <p className="mt-0.5 text-sm text-ink-500">{exams.length} total</p>
        </div>

        {/* Table header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-ink-400 uppercase tracking-wider border-b border-surface-200">
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Course</div>
          <div className="col-span-2">Section</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-2 text-right">File</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-surface-100">
          {exams.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-400">
              No exams yet. Create your first exam above.
            </div>
          ) : (
            exams.map((exam) => (
              <div
                key={exam.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 items-center transition-colors hover:bg-surface-50"
              >
                <div className="md:col-span-4">
                  <p className="text-sm font-medium text-ink-900 truncate">
                    {exam.title}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Badge variant="default">{exam.courseCode}</Badge>
                </div>

                <div className="md:col-span-2">
                  <span className="text-sm text-ink-600">
                    {exam.sectionLabel}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <span className="text-sm text-ink-600">
                    {formatDate(exam.createdDate)}
                  </span>
                </div>

                <div className="md:col-span-2 md:text-right">
                  {exam.hasFile ? (
                    <Badge variant="success">{exam.fileType}</Badge>
                  ) : (
                    <Badge variant="warning">No file</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </InstructorPageWrapper>
  );
}

// ─── Create Exam Form ──────────────────────────────────────────

function CreateExamForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (exam: InstructorExam) => void;
}) {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const availableSections = courseId
    ? instructorSections.filter((s) => s.courseId === courseId)
    : [];

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const course = instructorCourses.find((c) => c.id === courseId);
    const section = instructorSections.find((s) => s.id === sectionId);
    if (!course || !section) return;

    const fileExt = file
      ? file.name.split(".").pop()?.toUpperCase() || "FILE"
      : "";

    const newExam: InstructorExam = {
      id: `ie-${Date.now()}`,
      title,
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      sectionId: section.id,
      sectionLabel: section.label,
      hasFile: !!file,
      fileType: fileExt,
      createdDate: new Date().toISOString().split("T")[0],
    };

    onSave(newExam);
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-lg font-semibold text-ink-900">
          Create New Exam
        </h3>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-ink-400 hover:bg-surface-100 hover:text-ink-700 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">
            Exam Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Midterm Exam – Data Structures"
            required
            className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Course + Section row */}
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
              }}
              required
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Select course</option>
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
              onChange={(e) => setSectionId(e.target.value)}
              required
              disabled={!courseId}
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-surface-100 disabled:text-ink-400"
            >
              <option value="">Select section</option>
              {availableSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.meetingTime})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* File upload area */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1.5">
            Exam File
          </label>
          {file ? (
            <div className="flex items-center gap-3 rounded-lg border border-surface-200 bg-surface-50 p-4">
              <FileUp size={20} className="text-brand-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-ink-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-white hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                isDragOver
                  ? "border-brand-500 bg-brand-50"
                  : "border-surface-300 bg-surface-50"
              }`}
            >
              <Upload
                size={24}
                className={`mb-2 ${isDragOver ? "text-brand-500" : "text-ink-400"}`}
              />
              <p className="text-sm text-ink-600 mb-1">
                Drag & drop a file here, or
              </p>
              <label className="cursor-pointer text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
                browse files
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFile(f);
                  }}
                />
              </label>
              <p className="mt-2 text-xs text-ink-400">
                PDF, DOCX, or any file type
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2"
          >
            Create Exam
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-surface-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
}
