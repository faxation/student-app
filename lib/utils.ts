/** Merge class names conditionally (lightweight alternative to clsx) */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Format a date string to a readable format */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format currency (USD) */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format Lebanese Pound amount */
export function formatLBP(amount: number): string {
  return `LL ${new Intl.NumberFormat("en-US").format(amount)}`;
}

/** Days until a given date */
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Get urgency level based on days remaining */
export function getUrgency(days: number): "critical" | "warning" | "normal" {
  if (days <= 1) return "critical";
  if (days <= 3) return "warning";
  return "normal";
}
