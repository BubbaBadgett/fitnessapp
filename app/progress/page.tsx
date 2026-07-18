"use client";

import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/Card";
import { useStoresReady } from "@/hooks/useStoresReady";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { useWeightStore } from "@/store/useWeightStore";
import { addDays, formatShortDate, toDateKey } from "@/lib/date";
import { consistency, currentStreak, exerciseProgressions } from "@/lib/stats";
import { computeRollingAverage } from "@/lib/weight";

export default function ProgressPage() {
  const ready = useStoresReady();
  const workouts = useWorkoutStore((s) => s.workouts);
  const entries = useWeightStore((s) => s.entries);

  const today = useMemo(() => new Date(), []);

  const completedWorkouts = useMemo(
    () => [...workouts].filter((w) => w.completedAt).sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1)),
    [workouts]
  );

  const streak = currentStreak(workouts, today);
  const consistency30 = consistency(workouts, 30, today);
  const progressions = useMemo(() => exerciseProgressions(workouts), [workouts]);

  const weightChartData = useMemo(() => {
    const days = Array.from({ length: 90 }, (_, i) => addDays(today, -(89 - i)));
    return days.map((d) => {
      const key = toDateKey(d);
      return { label: formatShortDate(d), average: computeRollingAverage(entries, key, 7) };
    });
  }, [today, entries]);

  if (!ready) {
    return <div className="animate-pulse text-muted">Loading…</div>;
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <h1 className="text-2xl font-bold">Progress</h1>

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold">{completedWorkouts.length}</p>
          <p className="text-xs text-muted">Total Workouts</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold">{streak}</p>
          <p className="text-xs text-muted">Streak</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold">{consistency30}%</p>
          <p className="text-xs text-muted">30-Day Consistency</p>
        </Card>
      </div>

      <Card>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Weight Trend (90 days)</p>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightChartData} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#262b3a" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#8b90a0", fontSize: 10 }} interval={17} axisLine={false} tickLine={false} />
              <YAxis
                domain={["dataMin - 3", "dataMax + 3"]}
                tick={{ fill: "#8b90a0", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(v: number) => v.toFixed(0)}
              />
              <Tooltip contentStyle={{ background: "#171b27", border: "1px solid #262b3a", borderRadius: 12 }} labelStyle={{ color: "#8b90a0" }} />
              <Line type="monotone" dataKey="average" stroke="#34d399" strokeWidth={2.5} dot={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {progressions.length > 0 && (
        <Card className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">You&apos;re Getting Stronger</p>
          {progressions.map((p) => (
            <div key={p.exerciseId} className="flex items-center justify-between">
              <span className="text-sm">{p.name}</span>
              <span className="font-semibold">
                {p.first} <span className="text-muted">→</span> {p.latest} lb
              </span>
            </div>
          ))}
        </Card>
      )}

      <Card className="flex flex-col gap-1">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Workout History</p>
        {completedWorkouts.length === 0 && <p className="text-sm text-muted">No completed workouts yet.</p>}
        <div className="flex flex-col divide-y divide-border">
          {completedWorkouts.slice(0, 20).map((w) => (
            <div key={w.id} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{w.name}</p>
                <p className="text-xs text-muted">{formatShortDate(new Date(w.date + "T00:00:00"))}</p>
              </div>
              {w.durationMin && <span className="text-sm text-muted">{w.durationMin} min</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
