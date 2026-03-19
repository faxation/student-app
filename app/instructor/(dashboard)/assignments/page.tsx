"use client";

import { useState, useCallback, type FormEvent, type DragEvent } from "react";
import {
  ClipboardList,
  Plus,
  X,
  Upload,
  FileUp,
  FileText,
  Trash2,
} from "lucide-react";
import { InstructorPageWrapper } from "@/components/instructor/page-wrapper";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  instructorAssignments as initialAssignments,
  instructorCourses,
  instructorSections,
} from "@/data/instructor-mock-data";
import type { InstructorAssignment } from "@/lib/instructor-types";

export default function InstructorAssignmentsPage() {
  const [assignments, setAssignments] =
    useState<InstructorAssignment[]>(initialAssignments);
  const [showForm, setShowForm] = useState(false);

  const published = assignments.filter((a) => a.status === "published");
  const drafts = assignments.filter((a) => a.status === "draft");

  return (
    <InstructorPageWrapper
      title="Assignments"
      subtitle="Manage and create course assignments"
    >
      {/* Stats */}
      <div className="page-grid-3 mb-8">
        <StatCard
          label="Total Assignments"
          value={assignments.length}
          subtitle="All courses"
          icon={<ClipboardList size={20} />}
          accent="brand"
        />
        <StatCard
          label="Published"
          value={published.length}
          subtitle="Visible to students"
          icon={<ClipboardList size={20} />}
          accent="blue"
        />
        <StatCard
          label="Drafts"
          value={drafts.length}
          subtitle="Not yet published"
          icon={<ClipboardList size={20} />}
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
          New Assignment
        </button>
      )}

      {/* Create form */}
      {showForm && (
        <CreateAssignmentForm
          onClose={() => setShowForm(false)}
          onSave={(a) => {
            setAssignments((prev) => [...prev, a]);
            setShowForm(false);
          }}
        />
      )}

      {/* Assignments Table */}
      <Card>
        <div className="mb-4">
          <h3 className="font-serif text-lg font-semibold text-ink-900">
            All Assignments
          </h3>
          <p className="mt-0.5 text-sm text-ink-500">
            {assignments.length} total
          </p>
        </div>

        {/* Table header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-ink-400 uppercase tracking-wider border-b border-surface-200">
          <div className="col-span-3">Title</div>
          <div className="col-span-2">Course</div>
          <div className="col-span-2">Section</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1">Weight</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-surface-100">
          {assignments.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-400">
              No assignments yet. Create your first assignment above.
            </div>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 items-center transition-colors hover:bg-surface-50"
              >
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2">
                    {assignment.hasFile && (
                      <FileText size={14} className="text-ink-400 shrink-0" />
                    )}
                    <p className="text-sm font-medium text-ink-900 truncate">
                      {assignment.title}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Badge variant="default">{assignment.courseCode}</Badge>
                </div>

                <div className="md:col-span-2">
                  <span className="text-sm text-ink-600">
                    {assignment.sectionLabel}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <span className="text-sm text-ink-600">
                    {formatDate(assignment.dueDate)}
                  </span>
                </div>

                <div className="md:col-span-1">
                  <span className="text-sm text-ink-600">
                    {assignment.weight}%
                  </span>
                </div>

                <div className="md:col-span-2 md:text-right">
                  <Badge
                    variant={
                      assignment.status === "published" ? "success" : "warning"
                    }
                  >
                    {assignment.status === "published"
                      ? "Published"
                      : "Draft"}
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

// ─── Create Assignment Form ────────────────────────────────────

function CreateAssignmentForm({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (assignment: InstructorAssignment) => void;
}) {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [weight, setWeight] = useState("");
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

    const newAssignment: InstructorAssignment = {
      id: `ia-${Date.now()}`,
      title,
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      sectionId: section.id,
      sectionLabel: section.label,
      dueDate,
      weight: Number(weight),
      hasFile: !!file,
      status: "published",
    };

    onSave(newAssignment);
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-lg font-semibold text-ink-900">
          Create New Assignment
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
            Assignment Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Binary Search Tree Implementation"
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

        {/* Due Date + Weight row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
              placeholder="e.g. 15"
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
            Assignment Instructions (file)
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
            Create Assignment
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
