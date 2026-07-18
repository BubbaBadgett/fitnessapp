import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WeightEntry } from "@/types";
import { addDays, toDateKey } from "@/lib/date";

type WeightState = {
  entries: WeightEntry[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  logWeight: (weight: number, date?: Date) => void;
  getEntry: (dateKey: string) => WeightEntry | undefined;
  sortedEntries: () => WeightEntry[];
  rollingAverage: (dateKey: string, windowDays?: number) => number | null;
  trend: (days: number) => { change: number; from: number; to: number } | null;
};

export const useWeightStore = create<WeightState>()(
  persist(
    (set, get) => ({
      entries: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      logWeight: (weight, date = new Date()) => {
        const dateKey = toDateKey(date);
        set((s) => {
          const withoutToday = s.entries.filter((e) => e.date !== dateKey);
          return { entries: [...withoutToday, { date: dateKey, weight }] };
        });
      },

      getEntry: (dateKey) => get().entries.find((e) => e.date === dateKey),

      sortedEntries: () => [...get().entries].sort((a, b) => (a.date < b.date ? -1 : 1)),

      rollingAverage: (dateKey, windowDays = 7) => {
        const all = get().sortedEntries();
        const idx = all.findIndex((e) => e.date === dateKey);
        if (idx === -1) return null;
        const windowSlice = all.slice(Math.max(0, idx - (windowDays - 1)), idx + 1);
        if (windowSlice.length === 0) return null;
        const sum = windowSlice.reduce((acc, e) => acc + e.weight, 0);
        return Math.round((sum / windowSlice.length) * 10) / 10;
      },

      trend: (days) => {
        const all = get().sortedEntries();
        if (all.length < 2) return null;
        const latest = all[all.length - 1];
        const cutoffKey = toDateKey(addDays(new Date(latest.date), -days));
        const earlier = [...all].reverse().find((e) => e.date <= cutoffKey) ?? all[0];
        return {
          change: Math.round((latest.weight - earlier.weight) * 10) / 10,
          from: earlier.weight,
          to: latest.weight,
        };
      },
    }),
    {
      name: "ironpath-weight",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
