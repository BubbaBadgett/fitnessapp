import { WorkoutLog, WorkoutTemplate } from "@/types";
import { getProgramDay, getTemplateById } from "@/lib/program";
import { addDays, toDateKey } from "@/lib/date";

export type DayStatus = {
  date: Date;
  dateKey: string;
  template: WorkoutTemplate | null;
  countsTowardWeek: boolean;
  status: "done" | "missed" | "pending" | "rest" | "future";
  workout: WorkoutLog | null;
};

export function getDayStatus(date: Date, workouts: WorkoutLog[], today: Date = new Date()): DayStatus {
  const dateKey = toDateKey(date);
  const todayKey = toDateKey(today);
  const programDay = getProgramDay(date.getDay());
  const template = programDay.templateId ? getTemplateById(programDay.templateId) ?? null : null;
  const countsTowardWeek = !!template && template.type !== "recovery";
  const workout =
    workouts.find((w) => w.date === dateKey && w.templateId === programDay.templateId && w.completedAt) ?? null;

  let status: DayStatus["status"];
  if (!template) status = "rest";
  else if (workout) status = "done";
  else if (dateKey > todayKey) status = "future";
  else if (dateKey === todayKey) status = "pending";
  else status = "missed";

  return { date, dateKey, template, countsTowardWeek, status, workout };
}

export function weekSummary(weekDates: Date[], workouts: WorkoutLog[], today: Date = new Date()) {
  const days = weekDates.map((d) => getDayStatus(d, workouts, today));
  const counted = days.filter((d) => d.countsTowardWeek);
  const completed = counted.filter((d) => d.status === "done").length;
  return { days, completed, total: counted.length };
}

export function currentStreak(workouts: WorkoutLog[], today: Date = new Date()): number {
  let streak = 0;
  let cursor = new Date(today);
  const todayKey = toDateKey(today);

  for (let i = 0; i < 400; i++) {
    const day = getDayStatus(cursor, workouts, today);
    if (day.status === "rest") {
      cursor = addDays(cursor, -1);
      continue;
    }
    if (day.status === "done") {
      streak++;
      cursor = addDays(cursor, -1);
      continue;
    }
    if (day.dateKey === todayKey) {
      // Today's workout is still pending — don't break the streak over it yet.
      cursor = addDays(cursor, -1);
      continue;
    }
    break;
  }
  return streak;
}

export function consistency(workouts: WorkoutLog[], days: number, today: Date = new Date()): number {
  let counted = 0;
  let done = 0;
  for (let i = 0; i < days; i++) {
    const day = getDayStatus(addDays(today, -i), workouts, today);
    if (!day.countsTowardWeek) continue;
    if (day.status === "future" || day.status === "pending") continue;
    counted++;
    if (day.status === "done") done++;
  }
  return counted === 0 ? 0 : Math.round((done / counted) * 100);
}

export type ExerciseProgression = {
  exerciseId: string;
  name: string;
  first: number;
  latest: number;
  sessions: number;
};

export function exerciseProgressions(workouts: WorkoutLog[]): ExerciseProgression[] {
  const completed = [...workouts]
    .filter((w) => w.completedAt)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const byExercise = new Map<string, { name: string; topWeights: number[] }>();

  for (const workout of completed) {
    for (const ex of workout.exercises) {
      const weights = ex.sets.map((s) => s.weight).filter((w): w is number => w !== null && w > 0);
      if (weights.length === 0) continue;
      const topWeight = Math.max(...weights);
      const entry = byExercise.get(ex.exerciseId) ?? { name: ex.name, topWeights: [] };
      entry.topWeights.push(topWeight);
      byExercise.set(ex.exerciseId, entry);
    }
  }

  return Array.from(byExercise.entries())
    .filter(([, v]) => v.topWeights.length >= 2)
    .map(([exerciseId, v]) => ({
      exerciseId,
      name: v.name,
      first: v.topWeights[0],
      latest: v.topWeights[v.topWeights.length - 1],
      sessions: v.topWeights.length,
    }));
}
