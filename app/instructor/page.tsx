"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInstructorAuth } from "@/lib/instructor-auth-context";

export default function InstructorRootPage() {
  const { isAuthenticated } = useInstructorAuth();
  const router = useRouter();

  useEffect(() => {
    router.replace(isAuthenticated ? "/instructor/courses" : "/instructor/login");
  }, [isAuthenticated, router]);

  return null;
}
