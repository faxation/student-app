"use client";

import {
  DollarSign,
  Landmark,
  GraduationCap,
  BarChart3,
  User,
} from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/lib/use-api";
import { formatCurrency, formatLBP } from "@/lib/utils";

interface FinanceEntry {
  id: string;
  date: string;
  description: string;
  type: string;
  amountUsd: number;
  amountLbp: number;
  status: string;
}

interface FinanceAccount {
  balanceUsd: number;
  balanceLbp: number;
  currency: string;
}

interface FinanceResponse {
  account: FinanceAccount;
  entries: FinanceEntry[];
  // Support legacy shape if API still returns it
  lbpFees?: { semester: string; chargesFees: number; coursesTuition: number; lbpCollection: number; remainingAmount: number }[];
  usdFees?: { semester: string; chargesFees: number; usdTuition: number; usdCollection: number; usdSponsors: number; scholarship: number; remainingAmount: number }[];
  totalLbpRemaining?: number;
  totalUsdRemaining?: number;
  studentProfile?: {
    program: string;
    faculty: string;
    advisor: string;
    gpa: number;
    creditsCompleted: number;
    creditsRequired: number;
  };
}

export default function FinancePage() {
  const { data, loading, error } = useApi<FinanceResponse>("/api/student/finance");

  if (loading) return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" /></div>;
  if (error) return <div className="p-6 text-red-600">Failed to load data.</div>;

  const account = data?.account ?? { balanceUsd: 0, balanceLbp: 0, currency: "USD" };
  const entries = data?.entries ?? [];
  const lbpFees = data?.lbpFees ?? [];
  const usdFees = data?.usdFees ?? [];
  const totalLbpRemaining = data?.totalLbpRemaining ?? account.balanceLbp;
  const totalUsdRemaining = data?.totalUsdRemaining ?? account.balanceUsd;
  const studentProfile = data?.studentProfile ?? { program: "", faculty: "", advisor: "", gpa: 0, creditsCompleted: 0, creditsRequired: 0 };

  const completionPct = studentProfile.creditsCompleted && studentProfile.creditsRequired
    ? Math.round((studentProfile.creditsCompleted / studentProfile.creditsRequired) * 10000) / 100
    : 0;

  return (
    <PageWrapper title="Finance" subtitle="Tuition fees and payment history">
      {/* Overview Stats */}
      <div className="page-grid-4 mb-8">
        <StatCard
          label="LBP Remaining"
          value={formatLBP(totalLbpRemaining)}
          subtitle="All semesters"
          icon={<Landmark size={20} />}
          accent="brand"
        />
        <StatCard
          label="USD Remaining"
          value={formatCurrency(totalUsdRemaining)}
          subtitle="All semesters"
          icon={<DollarSign size={20} />}
          accent="amber"
        />
        <StatCard
          label="Credits Completed"
          value={`${studentProfile.creditsCompleted ?? 0} / ${studentProfile.creditsRequired ?? 0}`}
          subtitle={`${completionPct}% of program`}
          icon={<GraduationCap size={20} />}
          accent="blue"
        />
        <StatCard
          label="Completion"
          value={`${completionPct}%`}
          subtitle={`${(studentProfile.creditsRequired ?? 0) - (studentProfile.creditsCompleted ?? 0)} credits remaining`}
          icon={<BarChart3 size={20} />}
          accent="brand"
        />
      </div>

      <div className="page-grid-2">
        {/* LBP Fee History */}
        <Card>
          <CardHeader
            title="LBP Fees"
            subtitle={`${lbpFees.length} semesters`}
          />
          {/* Table header */}
          <div className="grid grid-cols-4 gap-2 px-4 py-2 text-xs font-medium text-ink-400 uppercase tracking-wider border-b border-surface-200">
            <div>Semester</div>
            <div className="text-right">Charges</div>
            <div className="text-right">Collected</div>
            <div className="text-right">Balance</div>
          </div>
          {/* Rows */}
          <div className="divide-y divide-surface-100">
            {lbpFees.map((row) => (
              <div
                key={row.semester}
                className="grid grid-cols-4 gap-2 px-4 py-3 items-center hover:bg-surface-50 transition-colors"
              >
                <div className="text-sm font-medium text-ink-900">{row.semester}</div>
                <div className="text-sm text-ink-600 text-right">
                  {formatLBP(row.chargesFees + row.coursesTuition)}
                </div>
                <div className="text-sm text-emerald-600 text-right">
                  {formatLBP(row.lbpCollection)}
                </div>
                <div className={`text-sm font-medium text-right ${row.remainingAmount > 0 ? "text-red-600" : "text-ink-600"}`}>
                  {formatLBP(row.remainingAmount)}
                </div>
              </div>
            ))}
          </div>
          {/* Total row */}
          <div className="border-t-2 border-surface-300 grid grid-cols-4 gap-2 px-4 py-3">
            <div className="text-sm font-semibold text-ink-900">Total</div>
            <div className="text-sm font-semibold text-ink-900 text-right">
              {formatLBP(lbpFees.reduce((s, r) => s + r.chargesFees + r.coursesTuition, 0))}
            </div>
            <div className="text-sm font-semibold text-emerald-600 text-right">
              {formatLBP(lbpFees.reduce((s, r) => s + r.lbpCollection, 0))}
            </div>
            <div className={`text-sm font-semibold text-right ${totalLbpRemaining > 0 ? "text-red-600" : "text-emerald-600"}`}>
              {formatLBP(totalLbpRemaining)}
            </div>
          </div>
        </Card>

        {/* USD Fee History */}
        <Card>
          <CardHeader
            title="USD Fees"
            subtitle={`${usdFees.length} semesters`}
          />
          {/* Table header */}
          <div className="grid grid-cols-4 gap-2 px-4 py-2 text-xs font-medium text-ink-400 uppercase tracking-wider border-b border-surface-200">
            <div>Semester</div>
            <div className="text-right">Charges</div>
            <div className="text-right">Collected</div>
            <div className="text-right">Balance</div>
          </div>
          {/* Rows */}
          <div className="divide-y divide-surface-100">
            {usdFees.map((row) => (
              <div
                key={row.semester}
                className="grid grid-cols-4 gap-2 px-4 py-3 items-center hover:bg-surface-50 transition-colors"
              >
                <div className="text-sm font-medium text-ink-900">{row.semester}</div>
                <div className="text-sm text-ink-600 text-right">
                  {formatCurrency(row.chargesFees + row.usdTuition)}
                </div>
                <div className="text-sm text-emerald-600 text-right">
                  {formatCurrency(row.usdCollection + row.usdSponsors + row.scholarship)}
                </div>
                <div className={`text-sm font-medium text-right ${row.remainingAmount > 0 ? "text-red-600" : "text-ink-600"}`}>
                  {formatCurrency(row.remainingAmount)}
                </div>
              </div>
            ))}
          </div>
          {/* Total row */}
          <div className="border-t-2 border-surface-300 grid grid-cols-4 gap-2 px-4 py-3">
            <div className="text-sm font-semibold text-ink-900">Total</div>
            <div className="text-sm font-semibold text-ink-900 text-right">
              {formatCurrency(usdFees.reduce((s, r) => s + r.chargesFees + r.usdTuition, 0))}
            </div>
            <div className="text-sm font-semibold text-emerald-600 text-right">
              {formatCurrency(usdFees.reduce((s, r) => s + r.usdCollection + r.usdSponsors + r.scholarship, 0))}
            </div>
            <div className={`text-sm font-semibold text-right ${totalUsdRemaining > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              {formatCurrency(totalUsdRemaining)}
            </div>
          </div>
        </Card>

        {/* Advisor / Academic Progress */}
        <Card className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-brand-50 p-3">
              <User size={20} className="text-brand-500" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-ink-900">
                Academic Progress
              </h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-ink-500">Program:</span>
                  <span className="font-medium text-ink-900">{studentProfile.program}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ink-500">Faculty:</span>
                  <span className="font-medium text-ink-900">{studentProfile.faculty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ink-500">Advisor:</span>
                  <span className="font-medium text-ink-900">{studentProfile.advisor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-ink-500">GPA:</span>
                  <Badge variant="brand">{studentProfile.gpa.toFixed(2)}</Badge>
                </div>
              </div>
              {/* Credits progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-ink-500">Credits Progress</span>
                  <span className="text-xs text-ink-600">
                    {studentProfile.creditsCompleted} / {studentProfile.creditsRequired} ({completionPct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-100">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
