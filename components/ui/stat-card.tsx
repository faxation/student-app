import { Card } from "./card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: "brand" | "amber" | "red" | "blue";
}

const accentStyles = {
  brand: "bg-brand-50 text-brand-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  blue: "bg-blue-50 text-blue-600",
};

export function StatCard({ label, value, subtitle, icon, accent = "brand" }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <div className={cn("rounded-lg p-2.5", accentStyles[accent])}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-ink-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-ink-900">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
