"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useInstructorAuth } from "@/lib/instructor-auth-context";
import { InstructorSidebar } from "./sidebar";

interface InstructorAppShellProps {
  children: ReactNode;
}

export function InstructorAppShell({ children }: InstructorAppShellProps) {
  const { isAuthenticated, isLoading } = useInstructorAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/instructor/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-surface-50">
      <InstructorSidebar />
      <main className="ml-[72px] min-h-screen">{children}</main>
    </div>
  );
}
