"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { StudentProfile } from "@/lib/types";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  student: StudentProfile | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount via backend session API
  useEffect(() => {
    fetch("/api/student/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setIsAuthenticated(true);
          setStudent(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      try {
        const res = await fetch("/api/student/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setIsAuthenticated(true);
          setStudent(data.user);
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
    await fetch("/api/student/auth/logout", { method: "POST" }).catch(() => {});
    setIsAuthenticated(false);
    setStudent(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
