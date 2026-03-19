"use client";

import type { ReactNode } from "react";
import { InstructorHeader } from "./header";

interface InstructorPageWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function InstructorPageWrapper({ title, subtitle, children }: InstructorPageWrapperProps) {
  return (
    <>
      <InstructorHeader title={title} subtitle={subtitle} />
      <div className="p-8">{children}</div>
    </>
  );
}
