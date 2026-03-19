"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  ClipboardList,
  FileText,
  BookOpen,
  ClipboardCheck,
  DollarSign,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Assignments", href: "/assignments", icon: ClipboardList },
  { label: "Exams", href: "/exams", icon: FileText },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Attendance", href: "/attendance", icon: ClipboardCheck },
  { label: "Finance", href: "/finance", icon: DollarSign },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <motion.aside
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-surface-200 bg-white"
      initial={false}
      animate={{ width: isExpanded ? 256 : 72 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-surface-200 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
          <GraduationCap size={20} />
        </div>
        <motion.span
          className="whitespace-nowrap font-serif text-lg font-semibold text-ink-900 overflow-hidden"
          animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? "auto" : 0 }}
          transition={{ duration: 0.2, delay: isExpanded ? 0.1 : 0 }}
        >
          Student App
        </motion.span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex h-11 items-center gap-3 rounded-lg px-3 transition-colors duration-150",
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-ink-600 hover:bg-surface-100 hover:text-ink-900"
              )}
            >
              <Icon
                size={20}
                className={cn(
                  "shrink-0 transition-colors duration-150",
                  isActive ? "text-brand-500" : "text-ink-400 group-hover:text-ink-700"
                )}
              />
              <motion.span
                className="whitespace-nowrap text-sm font-medium overflow-hidden"
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  width: isExpanded ? "auto" : 0,
                }}
                transition={{ duration: 0.2, delay: isExpanded ? 0.08 : 0 }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-surface-200 px-3 py-4">
        <button
          onClick={logout}
          className="group flex h-11 w-full items-center gap-3 rounded-lg px-3 text-ink-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut
            size={20}
            className="shrink-0 text-ink-400 transition-colors duration-150 group-hover:text-red-500"
          />
          <motion.span
            className="whitespace-nowrap text-sm font-medium overflow-hidden"
            animate={{
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? "auto" : 0,
            }}
            transition={{ duration: 0.2, delay: isExpanded ? 0.08 : 0 }}
          >
            Sign Out
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
}
