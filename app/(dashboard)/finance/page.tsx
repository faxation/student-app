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
import { financeSummary, studentProfile } from "@/data/mock-data";
import { formatCurrency, formatLBP } from "@/lib/utils";

export default function FinancePage() {
  const completionPct = studentProfile.creditsCompleted && studentProfile.creditsRequired
    ? Math.round((studentProfile.creditsCompleted / studentProfile.creditsRequired) * 10000) / 100
    : 0;

  return (
    <PageWrapper title="Finance" subtitle="Tuition fees and payment history">
      {/* Overview Stats */}
      <div className="page-grid-4 mb-8">
        <StatCard
          label="LBP Remaining"
          value={formatLBP(financeSummary.totalLbpRemaining)}
          subtitle="All semesters"
          icon={<Landmark size={20} />}
          accent="brand"
        />
        <StatCard
          label="USD Remaining"
          value={formatCurrency(financeSummary.totalUsdRemaining)}
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
            subtitle={`${financeSummary.lbpFees.length} semesters`}
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
            {financeSummary.lbpFees.map((row) => (
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
              {formatLBP(financeSummary.lbpFees.reduce((s, r) => s + r.chargesFees + r.coursesTuition, 0))}
            </div>
            <div className="text-sm font-semibold text-emerald-600 text-right">
              {formatLBP(financeSummary.lbpFees.reduce((s, r) => s + r.lbpCollection, 0))}
            </div>
            <div className={`text-sm font-semibold text-right ${financeSummary.totalLbpRemaining > 0 ? "text-red-600" : "text-emerald-600"}`}>
              {formatLBP(financeSummary.totalLbpRemaining)}
            </div>
          </div>
        </Card>

        {/* USD Fee History */}
        <Card>
          <CardHeader
            title="USD Fees"
            subtitle={`${financeSummary.usdFees.length} semesters`}
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
            {financeSummary.usdFees.map((row) => (
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
              {formatCurrency(financeSummary.usdFees.reduce((s, r) => s + r.chargesFees + r.usdTuition, 0))}
            </div>
            <div className="text-sm font-semibold text-emerald-600 text-right">
              {formatCurrency(financeSummary.usdFees.reduce((s, r) => s + r.usdCollection + r.usdSponsors + r.scholarship, 0))}
            </div>
            <div className={`text-sm font-semibold text-right ${financeSummary.totalUsdRemaining > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              {formatCurrency(financeSummary.totalUsdRemaining)}
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
