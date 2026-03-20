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
import { useApi } from "@/lib/use-api";

interface Exam {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  sectionNumber: string;
  sectionId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  weight: number;
  type: string;
  status: string;
}

interface ExamsResponse {
  exams: Exam[];
}

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

export default function InstructorExamsPage() {
  const { data, loading, error, refetch } = useApi<ExamsResponse>("/api/instructor/exams");
  const [showForm, setShowForm] = useState(false);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" /></div>;
  if (error) return <div className="p-6 text-red-600">Failed to load data.</div>;

  const exams = data?.exams ?? [];

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
          label="Upcoming"
          value={exams.filter((e) => e.status === "scheduled").length}
          subtitle="Scheduled exams"
          icon={<FileUp size={20} />}
          accent="blue"
        />
        <StatCard
          label="Courses Covered"
          value={new Set(exams.map((e) => e.courseCode)).size}
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
          onSave={() => {
            refetch();
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
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Type</div>
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
                    Section {exam.sectionNumber}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <span className="text-sm text-ink-600">
                    {formatDate(exam.date)}
                  </span>
                </div>

                <div className="md:col-span-2 md:text-right">
                  <Badge variant={exam.status === "scheduled" ? "success" : "warning"}>
                    {exam.type}
                  </Badge>
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
  onSave: () => void;
}) {
  const { data: sectionsData } = useApi<SectionsResponse>("/api/instructor/sections");
  const sections = sectionsData?.sections ?? [];

  const [title, setTitle] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [weight, setWeight] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/instructor/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          sectionId,
          date,
          startTime,
          endTime,
          location,
          weight: Number(weight),
          type,
        }),
      });
      if (!res.ok) throw new Error("Failed to create exam");
      onSave();
    } catch {
      alert("Failed to create exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

        {/* Section + Type row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Section
            </label>
            <select
              value={sectionId}
              onChange={(e) => setSectionId(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Select section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.courseCode} – Section {s.number} ({s.meetingTimes})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Exam Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Select type</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
        </div>

        {/* Date + Time row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Location + Weight row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Room 301"
              required
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Weight (% of final grade)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 25"
              required
              min="1"
              max="100"
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
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
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create Exam"}
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
