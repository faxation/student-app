"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useInstructorAuth } from "@/lib/instructor-auth-context";

export default function InstructorLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading } = useInstructorAuth();
  const router = useRouter();

  if (authLoading) return null;
  if (isAuthenticated) {
    router.replace("/instructor/courses");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 400));

    const success = login(username, password);
    if (success) {
      router.push("/instructor/courses");
    } else {
      setError("Invalid username or password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel – branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-brand-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <GraduationCap size={32} className="text-white" />
            </div>
          </div>

          <h1 className="font-serif text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Teach, Track,<br />Transform.
          </h1>

          <p className="text-lg text-brand-100 leading-relaxed max-w-md">
            A modern instructor dashboard for managing your courses, assignments,
            exams, and student grades — all in one streamlined workspace.
          </p>

          <div className="mt-12 flex gap-8 text-brand-100">
            <div>
              <p className="text-3xl font-semibold text-white">5</p>
              <p className="text-sm mt-1">Modules</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">1</p>
              <p className="text-sm mt-1">Dashboard</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">0</p>
              <p className="text-sm mt-1">Clutter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel – login form */}
      <div className="flex w-full lg:w-1/2 xl:w-[45%] items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-10 lg:hidden flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
              <GraduationCap size={22} />
            </div>
            <span className="font-serif text-xl font-semibold text-ink-900">
              Instructor Portal
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-ink-900">
              Instructor Sign In
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Sign in with your instructor credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                    <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username */}
            <div>
              <label
                htmlFor="instructor-username"
                className="block text-sm font-medium text-ink-700 mb-1.5"
              >
                Username
              </label>
              <input
                id="instructor-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
                className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="instructor-password"
                className="block text-sm font-medium text-ink-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="instructor-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 pr-11 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-8 rounded-lg border border-surface-200 bg-surface-50 p-4">
            <p className="text-xs font-medium text-ink-500 uppercase tracking-wide mb-2">
              Demo Credentials
            </p>
            <div className="space-y-1 text-sm text-ink-600">
              <p>
                <span className="text-ink-400">Username:</span>{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-xs font-mono border border-surface-200">
                  Adam
                </code>
              </p>
              <p>
                <span className="text-ink-400">Password:</span>{" "}
                <code className="rounded bg-white px-1.5 py-0.5 text-xs font-mono border border-surface-200">
                  Act3and4
                </code>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-ink-400">
            This is a demo application. No real authentication is performed.
          </p>
        </div>
      </div>
    </div>
  );
}
