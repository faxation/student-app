"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  INSTRUCTOR_CREDENTIALS,
  instructorProfile,
} from "@/data/instructor-mock-data";
import type { InstructorProfile } from "@/lib/instructor-types";

const SESSION_KEY = "instructor-app-auth";

interface InstructorAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  instructor: InstructorProfile | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const InstructorAuthContext = createContext<InstructorAuthState | undefined>(
  undefined
);

function getStoredAuth(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function InstructorAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [instructor, setInstructor] = useState<InstructorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (getStoredAuth()) {
      setIsAuthenticated(true);
      setInstructor(instructorProfile);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (username: string, password: string): boolean => {
      if (
        username === INSTRUCTOR_CREDENTIALS.username &&
        password === INSTRUCTOR_CREDENTIALS.password
      ) {
        setIsAuthenticated(true);
        setInstructor(instructorProfile);
        sessionStorage.setItem(SESSION_KEY, "true");
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setInstructor(null);
    sessionStorage.removeItem(SESSION_KEY);
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
