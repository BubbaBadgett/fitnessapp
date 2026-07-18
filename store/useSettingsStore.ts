import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  name: string;
  remindersEnabled: boolean;
  lastWeightReminderDate: string | null;
  lastWorkoutReminderDate: string | null;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  setName: (name: string) => void;
  setRemindersEnabled: (v: boolean) => void;
  setLastWeightReminderDate: (date: string) => void;
  setLastWorkoutReminderDate: (date: string) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      name: "",
      remindersEnabled: false,
      lastWeightReminderDate: null,
      lastWorkoutReminderDate: null,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      setName: (name) => set({ name }),
      setRemindersEnabled: (v) => set({ remindersEnabled: v }),
      setLastWeightReminderDate: (date) => set({ lastWeightReminderDate: date }),
      setLastWorkoutReminderDate: (date) => set({ lastWorkoutReminderDate: date }),
    }),
    {
      name: "ironpath-settings",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
