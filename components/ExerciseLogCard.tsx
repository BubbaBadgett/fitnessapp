"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { NumberField } from "@/components/ui/NumberField";
import { ExerciseLog, SetLog } from "@/types";
import { getExerciseById } from "@/lib/exercises";

export function ExerciseLogCard({
  exercise,
  lastPerformance,
  onUpdateSet,
  onToggleComplete,
  onNotesChange,
}: {
  exercise: ExerciseLog;
  lastPerformance: SetLog[] | null;
  onUpdateSet: (setIndex: number, patch: Partial<SetLog>) => void;
  onToggleComplete: () => void;
  onNotesChange: (notes: string) => void;
}) {
  const [showNotes, setShowNotes] = useState(!!exercise.notes);
  const meta = getExerciseById(exercise.exerciseId);

  return (
    <Card className={`flex flex-col gap-3 ${exercise.completed ? "border-accent-strong/50" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/exercises/${exercise.exerciseId}`} className="text-lg font-bold underline-offset-4 hover:underline">
            {exercise.name}
          </Link>
          <p className="text-sm text-muted">
            {exercise.targetSets} × {exercise.targetReps}
          </p>
        </div>
        <Checkbox checked={exercise.completed} onChange={onToggleComplete} size="lg" />
      </div>

      {lastPerformance && (
        <div className="rounded-xl bg-surface-raised px-3 py-2 text-sm text-muted">
          <span className="font-medium text-foreground">Last time: </span>
          {lastPerformance
            .filter((s) => s.weight !== null || s.reps !== null)
            .map((s) => `${s.weight ?? "-"}×${s.reps ?? "-"}`)
            .join(", ") || "—"}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {exercise.sets.map((set, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-12 shrink-0 text-sm text-muted">Set {i + 1}</span>
            <NumberField
              value={set.weight}
              onChange={(v) => onUpdateSet(i, { weight: v })}
              placeholder="lbs"
              className="text-base"
            />
            <NumberField
              value={set.reps}
              onChange={(v) => onUpdateSet(i, { reps: v })}
              placeholder="reps"
              className="text-base"
            />
            <Checkbox checked={set.completed} onChange={() => onUpdateSet(i, { completed: !set.completed })} />
          </div>
        ))}
      </div>

      {meta?.backFriendlyNote && (
        <p className="rounded-xl bg-warn/10 px-3 py-2 text-xs text-warn">
          Back tip: {meta.backFriendlyNote}
        </p>
      )}

      {showNotes ? (
        <textarea
          value={exercise.notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Notes for this exercise…"
          rows={2}
          className="w-full rounded-xl bg-surface-raised border border-border px-3 py-2 text-sm focus:outline-none focus:border-accent-strong"
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowNotes(true)}
          className="self-start text-sm text-muted underline underline-offset-4"
        >
          + Add note
        </button>
      )}
    </Card>
  );
}
