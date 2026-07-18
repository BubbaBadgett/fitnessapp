import { WeightEntry } from "@/types";

export function computeRollingAverage(
  entries: WeightEntry[],
  dateKey: string,
  windowDays = 7
): number | null {
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? -1 : 1));
  const idx = sorted.findIndex((e) => e.date === dateKey);
  if (idx === -1) return null;
  const windowSlice = sorted.slice(Math.max(0, idx - (windowDays - 1)), idx + 1);
  if (windowSlice.length === 0) return null;
  const sum = windowSlice.reduce((acc, e) => acc + e.weight, 0);
  return Math.round((sum / windowSlice.length) * 10) / 10;
}
