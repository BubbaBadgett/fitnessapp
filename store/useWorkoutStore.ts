import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExerciseLog, SetLog, WorkoutLog, WorkoutTemplate } from "@/types";
import { getExerciseById } from "@/lib/exercises";
import { toDateKey } from "@/lib/date";

function buildExerciseLogs(template: WorkoutTemplate): ExerciseLog[] {
  if (!template.exercises) return [];
  return template.exercises.map((te) => {
    const exercise = getExerciseById(te.exerciseId);
    const emptySet: SetLog = { weight: null, reps: null, completed: false };
    return {
      exerciseId: te.exerciseId,
      name: exercise?.name ?? te.exerciseId,
      targetSets: te.sets,
      targetReps: te.reps,
      sets: Array.from({ length: te.sets }, () => ({ ...emptySet })),
      notes: "",
      completed: false,
    };
  });
}

type WorkoutState = {
  workouts: WorkoutLog[];
  activeWorkoutId: string | null;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  startOrResumeWorkout: (template: WorkoutTemplate, date?: Date) => string;
  updateSet: (workoutId: string, exerciseId: string, setIndex: number, patch: Partial<SetLog>) => void;
  toggleExerciseComplete: (workoutId: string, exerciseId: string) => void;
  setExerciseNotes: (workoutId: string, exerciseId: string, notes: string) => void;
  markSimpleComplete: (workoutId: string, durationMin?: number) => void;
  completeWorkout: (workoutId: string, durationMin?: number) => void;
  abandonActiveWorkout: () => void;

  getWorkout: (id: string) => WorkoutLog | undefined;
  getLastPerformance: (exerciseId: string, beforeWorkoutId?: string) => SetLog[] | null;
};

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],
      activeWorkoutId: null,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      startOrResumeWorkout: (template, date = new Date()) => {
        const dateKey = toDateKey(date);
        const existing = get().workouts.find(
          (w) => w.date === dateKey && w.templateId === template.id && !w.completedAt
        );
        if (existing) {
          set({ activeWorkoutId: existing.id });
          return existing.id;
        }
        const id = `${dateKey}-${template.id}-${Date.now()}`;
        const log: WorkoutLog = {
          id,
          date: dateKey,
          templateId: template.id,
          name: template.name,
          type: template.type,
          exercises: buildExerciseLogs(template),
          durationMin: null,
          startedAt: new Date().toISOString(),
          completedAt: null,
        };
        set((s) => ({ workouts: [...s.workouts, log], activeWorkoutId: id }));
        return id;
      },

      updateSet: (workoutId, exerciseId, setIndex, patch) => {
        set((s) => ({
          workouts: s.workouts.map((w) => {
            if (w.id !== workoutId) return w;
            return {
              ...w,
              exercises: w.exercises.map((ex) => {
                if (ex.exerciseId !== exerciseId) return ex;
                const sets = ex.sets.map((st, i) => (i === setIndex ? { ...st, ...patch } : st));
                const completed = sets.every((st) => st.completed);
                return { ...ex, sets, completed };
              }),
            };
          }),
        }));
      },

      toggleExerciseComplete: (workoutId, exerciseId) => {
        set((s) => ({
          workouts: s.workouts.map((w) => {
            if (w.id !== workoutId) return w;
            return {
              ...w,
              exercises: w.exercises.map((ex) => {
                if (ex.exerciseId !== exerciseId) return ex;
                const completed = !ex.completed;
                return {
                  ...ex,
                  completed,
                  sets: ex.sets.map((st) => ({ ...st, completed })),
                };
              }),
            };
          }),
        }));
      },

      setExerciseNotes: (workoutId, exerciseId, notes) => {
        set((s) => ({
          workouts: s.workouts.map((w) => {
            if (w.id !== workoutId) return w;
            return {
              ...w,
              exercises: w.exercises.map((ex) => (ex.exerciseId === exerciseId ? { ...ex, notes } : ex)),
            };
          }),
        }));
      },

      markSimpleComplete: (workoutId, durationMin) => {
        set((s) => ({
          workouts: s.workouts.map((w) =>
            w.id === workoutId
              ? { ...w, completedAt: new Date().toISOString(), durationMin: durationMin ?? w.durationMin }
              : w
          ),
          activeWorkoutId: s.activeWorkoutId === workoutId ? null : s.activeWorkoutId,
        }));
      },

      completeWorkout: (workoutId, durationMin) => {
        set((s) => ({
          workouts: s.workouts.map((w) =>
            w.id === workoutId
              ? { ...w, completedAt: new Date().toISOString(), durationMin: durationMin ?? w.durationMin }
              : w
          ),
          activeWorkoutId: s.activeWorkoutId === workoutId ? null : s.activeWorkoutId,
        }));
      },

      abandonActiveWorkout: () => set({ activeWorkoutId: null }),

      getWorkout: (id) => get().workouts.find((w) => w.id === id),

      getLastPerformance: (exerciseId, beforeWorkoutId) => {
        const beforeWorkout = beforeWorkoutId ? get().workouts.find((w) => w.id === beforeWorkoutId) : undefined;
        const cutoff = beforeWorkout?.startedAt ?? new Date().toISOString();
        const candidates = get()
          .workouts.filter(
            (w) => w.completedAt && w.startedAt < cutoff && w.exercises.some((e) => e.exerciseId === exerciseId)
          )
          .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
        const match = candidates[0]?.exercises.find((e) => e.exerciseId === exerciseId);
        return match ? match.sets : null;
      },
    }),
    {
      name: "ironpath-workouts",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
