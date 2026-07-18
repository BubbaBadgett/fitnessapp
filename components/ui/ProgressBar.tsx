export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2.5 w-full rounded-full bg-surface-raised overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-accent-strong transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
