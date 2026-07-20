import { useWorkoutStore } from "@/store/useWorkoutStore";
import { useWeightStore } from "@/store/useWeightStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useProfileStore } from "@/store/useProfileStore";

export function useStoresReady(): boolean {
  const workoutReady = useWorkoutStore((s) => s.hasHydrated);
  const weightReady = useWeightStore((s) => s.hasHydrated);
  const settingsReady = useSettingsStore((s) => s.hasHydrated);
  const profileReady = useProfileStore((s) => s.hasHydrated);
  return workoutReady && weightReady && settingsReady && profileReady;
}
