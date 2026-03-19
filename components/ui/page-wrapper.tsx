"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageWrapper({ title, subtitle, children }: PageWrapperProps) {
  return (
    <>
      <Header title={title} subtitle={subtitle} />
      <div className="p-8">{children}</div>
    </>
  );
}
