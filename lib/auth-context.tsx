"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { DEMO_CREDENTIALS, studentProfile } from "@/data/mock-data";
import type { StudentProfile } from "@/lib/types";

interface AuthState {
  isAuthenticated: boolean;
  student: StudentProfile | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState<StudentProfile | null>(null);

  const login = useCallback((username: string, password: string): boolean => {
    if (
      username === DEMO_CREDENTIALS.username &&
      password === DEMO_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      setStudent(studentProfile);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setStudent(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, student, login, logout }}>
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
