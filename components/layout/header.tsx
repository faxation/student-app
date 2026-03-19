"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { student } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-200 bg-white px-8">
      <div>
        <h1 className="font-serif text-xl font-semibold text-ink-900">{title}</h1>
        {subtitle && (
          <p className="text-sm text-ink-500">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <button className="relative rounded-lg p-2 text-ink-400 transition-colors hover:bg-surface-100 hover:text-ink-700">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-red" />
        </button>

        {/* Avatar */}
        {student && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {student.avatarInitials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-ink-900">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-xs text-ink-500">{student.studentId}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
