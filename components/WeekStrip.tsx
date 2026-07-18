import { DayStatus } from "@/lib/stats";
import { WEEKDAY_SHORT } from "@/lib/date";

function styleFor(day: DayStatus): string {
  // Recovery/rest days aren't scored, so they never get a harsh "missed" look.
  if (!day.countsTowardWeek) {
    return day.status === "done"
      ? "bg-accent-strong/20 text-accent-strong border-accent-strong/40"
      : "bg-transparent text-muted border-border/60";
  }
  switch (day.status) {
    case "done":
      return "bg-accent-strong text-black border-accent-strong";
    case "missed":
      return "bg-danger/15 text-danger border-danger/40";
    case "pending":
      return "bg-surface-raised text-foreground border-border";
    default:
      return "bg-transparent text-muted border-border/60";
  }
}

function glyphFor(day: DayStatus): string {
  if (day.status === "done") return "✓";
  if (!day.countsTowardWeek) return day.template ? "☾" : "•";
  if (day.status === "missed") return "✕";
  return "";
}

export function WeekStrip({ days }: { days: DayStatus[] }) {
  return (
    <div className="flex justify-between gap-1.5">
      {days.map((day) => (
        <div key={day.dateKey} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-[10px] font-medium uppercase text-muted">
            {WEEKDAY_SHORT[day.date.getDay()]}
          </span>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold ${styleFor(day)}`}
          >
            {glyphFor(day)}
          </div>
        </div>
      ))}
    </div>
  );
}
