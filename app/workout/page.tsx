"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ExerciseLogCard } from "@/components/ExerciseLogCard";
import { useStoresReady } from "@/hooks/useStoresReady";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { useProfileStore } from "@/store/useProfileStore";
import { getTemplateForDate } from "@/lib/plan";
import { toDateKey } from "@/lib/date";

export default function WorkoutPage() {
  const ready = useStoresReady();
  const router = useRouter();
  const profile = useProfileStore((s) => s);
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);
  const template = getTemplateForDate(today, profile);

  const startOrResumeWorkout = useWorkoutStore((s) => s.startOrResumeWorkout);
  const workouts = useWorkoutStore((s) => s.workouts);
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const toggleExerciseComplete = useWorkoutStore((s) => s.toggleExerciseComplete);
  const setExerciseNotes = useWorkoutStore((s) => s.setExerciseNotes);
  const completeWorkout = useWorkoutStore((s) => s.completeWorkout);
  const markSimpleComplete = useWorkoutStore((s) => s.markSimpleComplete);
  const getLastPerformance = useWorkoutStore((s) => s.getLastPerformance);

  const [duration, setDuration] = useState("");

  const workout = template
    ? workouts.find((w) => w.date === todayKey && w.templateId === template.id) ?? null
    : null;

  useEffect(() => {
    if (!ready || !template || workout) return;
    startOrResumeWorkout(template);
    // template is a freshly-resolved object each render (personalized from
    // profile), so key the effect on its stable id instead of its identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, template?.id, workout, startOrResumeWorkout]);

  if (!ready || (template && !workout)) {
    return <div className="animate-pulse text-muted">Loading workout…</div>;
  }

  if (!template) {
    return (
      <Card>
        <p className="text-lg font-semibold">Nothing scheduled today.</p>
        <p className="mt-1 text-muted">Take the day, or check the Progress tab for your weekly plan.</p>
      </Card>
    );
  }

  const isCardio = !template.exercises;
  const exercisesDone = workout?.exercises.filter((e) => e.completed).length ?? 0;
  const totalExercises = workout?.exercises.length ?? 0;
  const isComplete = !!workout?.completedAt;

  function handleFinish() {
    if (!workout) return;
    const mins = duration ? Number(duration) : undefined;
    if (isCardio) markSimpleComplete(workout.id, mins);
    else completeWorkout(workout.id, mins);
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div>
        <p className="text-sm text-muted">~{template.estimatedMinutes} min</p>
        <h1 className="text-2xl font-bold">{template.name}</h1>
      </div>

      {!isCardio && (
        <>
          <ProgressBar value={totalExercises ? (exercisesDone / totalExercises) * 100 : 0} />
          <p className="-mt-3 text-sm text-muted">
            {exercisesDone} of {totalExercises} exercises complete
          </p>
        </>
      )}

      {template.warmup && (
        <Card className="bg-surface-raised/60">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Warm-up</p>
          <ul className="list-inside list-disc text-sm text-muted">
            {template.warmup.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Card>
      )}

      {isCardio && (
        <Card className="flex flex-col gap-2">
          <p className="text-muted">{template.description}</p>
        </Card>
      )}

      {!isCardio &&
        workout?.exercises.map((ex) => (
          <ExerciseLogCard
            key={ex.exerciseId}
            exercise={ex}
            lastPerformance={getLastPerformance(ex.exerciseId, workout.id)}
            onUpdateSet={(i, patch) => updateSet(workout.id, ex.exerciseId, i, patch)}
            onToggleComplete={() => toggleExerciseComplete(workout.id, ex.exerciseId)}
            onNotesChange={(notes) => setExerciseNotes(workout.id, ex.exerciseId, notes)}
          />
        ))}

      {template.cooldown && (
        <Card className="bg-surface-raised/60">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Finish</p>
          <p className="mt-1 text-sm text-muted">{template.cooldown}</p>
        </Card>
      )}

      {!isComplete && (
        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-between rounded-xl bg-surface-raised border border-border px-3 py-2">
            <span className="text-sm text-muted">Duration (min, optional)</span>
            <input
              type="number"
              inputMode="numeric"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-16 bg-transparent text-right text-base font-semibold focus:outline-none"
            />
          </label>
          <Button onClick={handleFinish} className="w-full">
            Finish Workout
          </Button>
        </div>
      )}
      {isComplete && (
        <p className="text-center text-lg font-semibold text-accent-strong">Workout complete ✓</p>
      )}
    </div>
  );
}
