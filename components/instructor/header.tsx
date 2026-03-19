"use client";

import { Bell } from "lucide-react";
import { useInstructorAuth } from "@/lib/instructor-auth-context";

interface InstructorHeaderProps {
  title: string;
  subtitle?: string;
}

export function InstructorHeader({ title, subtitle }: InstructorHeaderProps) {
  const { instructor } = useInstructorAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-200 bg-white px-8">
      <div>
        <h1 className="font-serif text-xl font-semibold text-ink-900">{title}</h1>
        {subtitle && (
          <p className="text-sm text-ink-500">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-ink-400 transition-colors hover:bg-surface-100 hover:text-ink-700">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-red" />
        </button>

        {instructor && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {instructor.avatarInitials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-ink-900">
                {instructor.firstName} {instructor.lastName}
              </p>
              <p className="text-xs text-ink-500">{instructor.title}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
