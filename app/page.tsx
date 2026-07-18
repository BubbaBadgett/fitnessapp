"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { WeekStrip } from "@/components/WeekStrip";
import { useStoresReady } from "@/hooks/useStoresReady";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { useWeightStore } from "@/store/useWeightStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useProfileStore } from "@/store/useProfileStore";
import { getTemplateForDate } from "@/lib/plan";
import { getWeekDates, greeting, toDateKey } from "@/lib/date";
import { currentStreak, weekSummary } from "@/lib/stats";

export default function DashboardPage() {
  const ready = useStoresReady();
  const router = useRouter();

  const name = useSettingsStore((s) => s.name);
  const workouts = useWorkoutStore((s) => s.workouts);
  const startOrResumeWorkout = useWorkoutStore((s) => s.startOrResumeWorkout);
  const weightEntries = useWeightStore((s) => s.entries);
  const rollingAverage = useWeightStore((s) => s.rollingAverage);
  const trend = useWeightStore((s) => s.trend);
  const profile = useProfileStore((s) => s);

  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);
  const template = getTemplateForDate(today, profile);

  const todaysWorkout = template
    ? workouts.find((w) => w.date === todayKey && w.templateId === template.id) ?? null
    : null;

  const { days: weekDays, completed: weekCompleted, total: weekTotal } = weekSummary(
    getWeekDates(today),
    workouts,
    today
  );
  const streak = currentStreak(workouts, today);

  const todaysWeight = weightEntries.find((e) => e.date === todayKey);
  const avg = rollingAverage(todayKey, 7);
  const monthTrend = trend(30);

  const exerciseCount = todaysWorkout?.exercises.length ?? template?.exercises?.length ?? 0;
  const exercisesDone = todaysWorkout?.exercises.filter((e) => e.completed).length ?? 0;
  const isCardio = template && !template.exercises;
  const isComplete = !!todaysWorkout?.completedAt;

  function handleStart() {
    if (!template) return;
    startOrResumeWorkout(template);
    router.push("/workout");
  }

  if (!ready) {
    return <div className="animate-pulse text-muted">Loading IronPath…</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm text-muted">{greeting(today)}</p>
        <h1 className="text-2xl font-bold">{name ? name : "there"} 👋</h1>
      </div>

      <Link href="/weight">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Weight</p>
            {todaysWeight ? (
              <p className="text-2xl font-bold">{todaysWeight.weight} lbs</p>
            ) : (
              <p className="text-lg font-semibold text-accent-strong">Log today&apos;s weight</p>
            )}
            {monthTrend && (
              <p className="text-sm text-muted">
                {monthTrend.change <= 0 ? "▼" : "▲"} {Math.abs(monthTrend.change)} this month
              </p>
            )}
          </div>
          {avg && (
            <div className="text-right">
              <p className="text-xs text-muted">7-day avg</p>
              <p className="text-lg font-semibold">{avg}</p>
            </div>
          )}
        </Card>
      </Link>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Today&apos;s Workout</p>
          {template && <span className="text-xs text-muted">~{template.estimatedMinutes} min</span>}
        </div>
        {template ? (
          <>
            <p className="text-xl font-bold">{template.name}</p>
            {!isCardio && (
              <>
                <ProgressBar value={exerciseCount ? (exercisesDone / exerciseCount) * 100 : 0} />
                <p className="text-sm text-muted">
                  {exercisesDone} of {exerciseCount} exercises
                </p>
              </>
            )}
            {isCardio && <p className="text-sm text-muted">{template.description}</p>}
            <Button onClick={handleStart} disabled={isComplete} className="mt-1 w-full">
              {isComplete ? "Workout Complete ✓" : todaysWorkout ? "Continue Workout" : "Start Workout"}
            </Button>
          </>
        ) : (
          <p className="text-muted">Nothing scheduled today. Rest up.</p>
        )}
      </Card>

      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">This Week</p>
          <span className="text-sm font-semibold">
            {weekCompleted}/{weekTotal}
          </span>
        </div>
        <WeekStrip days={weekDays} />
        <Link href="/plan" className="text-sm text-accent-strong">
          See coming up →
        </Link>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Current Streak</p>
          <p className="text-2xl font-bold">{streak} workouts</p>
        </div>
        <span className="text-3xl">🔥</span>
      </Card>
    </div>
  );
}
