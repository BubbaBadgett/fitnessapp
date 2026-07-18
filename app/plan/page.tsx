"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useStoresReady } from "@/hooks/useStoresReady";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { useProfileStore } from "@/store/useProfileStore";
import { getTemplateForDate } from "@/lib/plan";
import { getExerciseById } from "@/lib/exercises";
import { addDays, formatShortDate, toDateKey, WEEKDAY_SHORT } from "@/lib/date";
import { WorkoutTemplateType } from "@/types";

const TYPE_LABEL: Record<WorkoutTemplateType, string> = {
  strength: "Strength",
  cardio: "Cardio",
  recovery: "Recovery",
};

export default function PlanPage() {
  const ready = useStoresReady();
  const workouts = useWorkoutStore((s) => s.workouts);
  const profile = useProfileStore((s) => s);
  const today = useMemo(() => new Date(), []);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(today, i)), [today]);

  if (!ready) {
    return <div className="animate-pulse text-muted">Loading…</div>;
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div>
        <Link href="/" className="text-sm text-muted">
          ‹ Home
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Coming Up</h1>
        <p className="text-sm text-muted">Your next 7 days, based on your training profile.</p>
      </div>

      {days.map((date) => {
        const dateKey = toDateKey(date);
        const isToday = dateKey === toDateKey(today);
        const template = getTemplateForDate(date, profile.completedIntake ? profile : null);
        const done = template
          ? workouts.some((w) => w.date === dateKey && w.templateId === template.id && w.completedAt)
          : false;
        const isOpen = expandedKey === dateKey;

        return (
          <Card key={dateKey} className="flex flex-col gap-2">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left"
              onClick={() => setExpandedKey(isOpen ? null : dateKey)}
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {WEEKDAY_SHORT[date.getDay()]} · {formatShortDate(date)}
                  {isToday ? " · Today" : ""}
                </p>
                <p className="text-lg font-bold">{template ? template.name : "Rest"}</p>
                {template && <p className="text-xs text-muted">{TYPE_LABEL[template.type]}</p>}
              </div>
              <div className="flex items-center gap-2">
                {done && <span className="text-xs font-semibold text-accent-strong">Done ✓</span>}
                {template && <span className="text-xs text-muted">~{template.estimatedMinutes} min</span>}
                {template && <span className="text-muted">{isOpen ? "▲" : "▼"}</span>}
              </div>
            </button>

            {isOpen && template && (
              <div className="border-t border-border pt-2">
                {template.exercises ? (
                  <ul className="flex flex-col gap-1 text-sm text-muted">
                    {template.exercises.map((te) => (
                      <li key={te.exerciseId} className="flex justify-between">
                        <span>{getExerciseById(te.exerciseId)?.name ?? te.exerciseId}</span>
                        <span>
                          {te.sets} × {te.reps}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">{template.description}</p>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
