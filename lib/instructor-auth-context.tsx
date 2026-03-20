"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { InstructorProfile } from "@/lib/instructor-types";

interface InstructorAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  instructor: InstructorProfile | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const InstructorAuthContext = createContext<InstructorAuthState | undefined>(
  undefined
);

export function InstructorAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [instructor, setInstructor] = useState<InstructorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructor/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setIsAuthenticated(true);
          setInstructor(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        const res = await fetch("/api/instructor/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setIsAuthenticated(true);
          setInstructor(data.user);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await fetch("/api/instructor/auth/logout", { method: "POST" }).catch(() => {});
    setIsAuthenticated(false);
    setInstructor(null);
  }, []);

  return (
    <InstructorAuthContext.Provider
      value={{ isAuthenticated, isLoading, instructor, login, logout }}
    >
      {children}
    </InstructorAuthContext.Provider>
  );
}

export function useInstructorAuth(): InstructorAuthState {
  const context = useContext(InstructorAuthContext);
  if (!context) {
    throw new Error(
      "useInstructorAuth must be used within an InstructorAuthProvider"
    );
  }
  return context;
}
