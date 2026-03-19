"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { DEMO_CREDENTIALS, studentProfile } from "@/data/mock-data";
import type { StudentProfile } from "@/lib/types";

const SESSION_KEY = "student-app-auth";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  student: StudentProfile | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

function getStoredAuth(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    if (getStoredAuth()) {
      setIsAuthenticated(true);
      setStudent(studentProfile);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (
      username === DEMO_CREDENTIALS.username &&
      password === DEMO_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      setStudent(studentProfile);
      sessionStorage.setItem(SESSION_KEY, "true");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setStudent(null);
    sessionStorage.removeItem(SESSION_KEY);
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
