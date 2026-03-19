"use client";

import {
  DollarSign,
  CreditCard,
  Award,
  CalendarClock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Card, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { useMoodle } from "@/lib/moodle-context";
import { financeSummary, transactions } from "@/data/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const txTypeConfig = {
  charge: { icon: ArrowDownRight, color: "text-red-500", bg: "bg-red-50" },
  payment: { icon: ArrowUpRight, color: "text-emerald-500", bg: "bg-emerald-50" },
  scholarship: { icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50" },
};

export default function FinancePage() {
  const { isSynced } = useMoodle();
  const paidPercent = Math.round(
    (financeSummary.totalPaid / financeSummary.totalTuition) * 100
  );

  return (
    <PageWrapper title="Finance" subtitle="Tuition, payments, and financial overview">
      {/* Moodle notice */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-surface-200 bg-surface-50 p-4">
        <HelpCircle size={18} className="mt-0.5 shrink-0 text-ink-400" />
        <div>
          <p className="text-sm font-medium text-ink-700">Finance is not sourced from Moodle</p>
          <p className="mt-0.5 text-sm text-ink-500">
            Moodle does not provide financial data. This page shows placeholder information.
            Future versions may integrate with the university&apos;s SIS for real tuition data.
          </p>
        </div>
      </div>
      {/* Overview Stats */}
      <div className="page-grid-4 mb-8">
        <StatCard
          label="Total Tuition"
          value={formatCurrency(financeSummary.totalTuition)}
          subtitle="Spring 2026"
          icon={<DollarSign size={20} />}
          accent="brand"
        />
        <StatCard
          label="Total Paid"
          value={formatCurrency(financeSummary.totalPaid)}
          subtitle={`${paidPercent}% of tuition`}
          icon={<CreditCard size={20} />}
          accent="blue"
        />
        <StatCard
          label="Outstanding Balance"
          value={formatCurrency(financeSummary.balance)}
          subtitle={`Due ${formatDate(financeSummary.nextPaymentDue)}`}
          icon={<CalendarClock size={20} />}
          accent="amber"
        />
        <StatCard
          label="Scholarship"
          value={formatCurrency(financeSummary.scholarshipAmount)}
          subtitle="Academic Merit"
          icon={<Award size={20} />}
          accent="brand"
        />
      </div>

      <div className="page-grid-2">
        {/* Payment Progress */}
        <Card>
          <CardHeader title="Payment Progress" subtitle="Spring 2026 tuition" />
          <div className="space-y-4">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-ink-500">
                  {formatCurrency(financeSummary.totalPaid)} of{" "}
                  {formatCurrency(financeSummary.totalTuition)}
                </span>
                <span className="text-sm font-semibold text-brand-600">
                  {paidPercent}%
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-surface-100">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${paidPercent}%` }}
                />
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Tuition Charges</span>
                <span className="font-medium text-ink-900">
                  {formatCurrency(financeSummary.totalTuition)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Scholarship Applied</span>
                <span className="font-medium text-emerald-600">
                  −{formatCurrency(financeSummary.scholarshipAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Payments Made</span>
                <span className="font-medium text-emerald-600">
                  −{formatCurrency(financeSummary.totalPaid - financeSummary.scholarshipAmount)}
                </span>
              </div>
              <div className="border-t border-surface-200 pt-3 flex items-center justify-between text-sm">
                <span className="font-medium text-ink-900">Remaining Balance</span>
                <span className="text-lg font-semibold text-amber-600">
                  {formatCurrency(financeSummary.balance)}
                </span>
              </div>
            </div>

            {/* Next payment */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
              <div className="flex items-center gap-2 mb-1">
                <CalendarClock size={14} className="text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  Next Payment Due
                </span>
              </div>
              <p className="text-sm text-amber-700">
                {formatCurrency(financeSummary.nextPaymentAmount)} due on{" "}
                {formatDate(financeSummary.nextPaymentDue)}
              </p>
            </div>
          </div>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader title="Transaction History" subtitle="Recent activity" />
          <div className="space-y-2">
            {transactions.map((tx) => {
              const config = txTypeConfig[tx.type];
              const Icon = config.icon;

              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-colors hover:bg-surface-50"
                >
                  <div className={`rounded-lg p-2 ${config.bg}`}>
                    <Icon size={16} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">
                      {tx.description}
                    </p>
                    <p className="text-xs text-ink-500">{formatDate(tx.date)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-semibold ${
                        tx.amount > 0 ? "text-emerald-600" : "text-ink-900"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {formatCurrency(Math.abs(tx.amount))}
                    </p>
                    <Badge
                      variant={tx.status === "completed" ? "success" : "warning"}
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Support placeholder */}
        <Card className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-brand-50 p-3">
              <HelpCircle size={20} className="text-brand-500" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-ink-900">
                Financial Aid & Support
              </h3>
              <p className="mt-1 text-sm text-ink-600">
                Need help with tuition payments or scholarship applications? Contact the
                Financial Aid Office for assistance with payment plans, emergency funding,
                or scholarship opportunities.
              </p>
              <p className="mt-3 text-sm text-ink-400">
                This section will expand in future versions with direct links to
                financial aid resources and detailed reporting.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
