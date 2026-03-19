"use client";

import { InstructorAppShell } from "@/components/instructor/app-shell";

export default function InstructorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InstructorAppShell>{children}</InstructorAppShell>;
}
