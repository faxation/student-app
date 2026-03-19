"use client";

import { Bell, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useMoodle } from "@/lib/moodle-context";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { student } = useAuth();
  const { status, sync, isSynced, error } = useMoodle();

  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-200 bg-white px-8">
      <div>
        <h1 className="font-serif text-xl font-semibold text-ink-900">{title}</h1>
        {subtitle && (
          <p className="text-sm text-ink-500">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Moodle sync button */}
        <button
          onClick={sync}
          disabled={status === "syncing"}
          title={
            status === "syncing"
              ? "Syncing with Moodle…"
              : error
              ? `Sync failed: ${error}`
              : isSynced
              ? "Re-sync from Moodle"
              : "Sync from Moodle"
          }
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            status === "syncing"
              ? "cursor-wait bg-brand-50 text-brand-600"
              : status === "error"
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : isSynced
              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              : "bg-surface-100 text-ink-600 hover:bg-surface-200"
          )}
        >
          {status === "syncing" ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : status === "error" ? (
            <AlertCircle size={14} />
          ) : isSynced ? (
            <CheckCircle2 size={14} />
          ) : (
            <RefreshCw size={14} />
          )}
          <span className="hidden sm:inline">
            {status === "syncing"
              ? "Syncing…"
              : status === "error"
              ? "Retry Sync"
              : isSynced
              ? "Synced"
              : "Sync Moodle"}
          </span>
        </button>

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
