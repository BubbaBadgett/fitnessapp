"use client";

import { Card } from "@/components/ui/Card";
import { useStoresReady } from "@/hooks/useStoresReady";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { formatShortDate, parseDateKey } from "@/lib/date";
import { SetLog } from "@/types";

function formatSets(sets: SetLog[]): string {
  const parts = sets
    .filter((s) => s.weight !== null || s.reps !== null)
    .map((s) => `${s.weight ?? "-"}×${s.reps ?? "-"}`);
  return parts.length ? parts.join(", ") : "—";
}

export function ExerciseHistory({ exerciseId }: { exerciseId: string }) {
  const ready = useStoresReady();
  const getExerciseHistory = useWorkoutStore((s) => s.getExerciseHistory);
  const getPersonalBest = useWorkoutStore((s) => s.getPersonalBest);

  if (!ready) {
    return (
      <Card>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Your History</p>
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-surface-raised" />
      </Card>
    );
  }

  const history = getExerciseHistory(exerciseId, 6);
  const best = getPersonalBest(exerciseId);

  if (history.length === 0) {
    return (
      <Card>
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">Your History</p>
        <p className="text-sm text-muted">
          You haven&apos;t logged this exercise yet — it&apos;ll show up here after your first workout.
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Your History</p>
      {best?.weight != null && (
        <div className="rounded-xl bg-surface-raised px-3 py-2">
          <p className="text-xs text-muted">Personal Best</p>
          <p className="text-lg font-bold text-accent-strong">
            {best.weight} lbs × {best.reps ?? "-"}
          </p>
        </div>
      )}
      <ul className="flex flex-col gap-2">
        {history.map((h) => (
          <li key={h.date} className="flex items-center justify-between text-sm">
            <span className="text-muted">{formatShortDate(parseDateKey(h.date))}</span>
            <span className="font-medium">{formatSets(h.sets)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
