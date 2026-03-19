"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { MoodleSyncData } from "@/lib/domain/types";

type SyncStatus = "idle" | "syncing" | "success" | "error";

interface MoodleState {
  data: MoodleSyncData | null;
  status: SyncStatus;
  error: string | null;
  sync: () => Promise<void>;
  isSynced: boolean;
}

const MoodleContext = createContext<MoodleState | undefined>(undefined);

export function MoodleProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<MoodleSyncData | null>(null);
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const sync = useCallback(async () => {
    setStatus("syncing");
    setError(null);

    try {
      const res = await fetch("/api/moodle/sync", { method: "POST" });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? `Sync failed (HTTP ${res.status})`);
      }

      setData(json.data as MoodleSyncData);
      setStatus("success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown sync error";
      setError(msg);
      setStatus("error");
    }
  }, []);

  return (
    <MoodleContext.Provider
      value={{
        data,
        status,
        error,
        sync,
        isSynced: data !== null,
      }}
    >
      {children}
    </MoodleContext.Provider>
  );
}

export function useMoodle(): MoodleState {
  const ctx = useContext(MoodleContext);
  if (!ctx) {
    throw new Error("useMoodle must be used within a MoodleProvider");
  }
  return ctx;
}
