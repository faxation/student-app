import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-ink-300">{icon}</div>
      <h3 className="font-serif text-lg font-semibold text-ink-700">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>
    </div>
  );
}
