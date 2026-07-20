import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EquipmentAccess, ExperienceLevel, Goal, InjuryArea } from "@/types";

type ProfileState = {
  completedIntake: boolean;
  age: number | null;
  heightFeet: number | null;
  heightInches: number | null;
  weightLb: number | null;
  experience: ExperienceLevel | null;
  injuries: InjuryArea[];
  healthNotes: string;
  goals: Goal[];
  equipment: EquipmentAccess | null;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  setAge: (age: number | null) => void;
  setHeight: (feet: number | null, inches: number | null) => void;
  setWeightLb: (weight: number | null) => void;
  setExperience: (level: ExperienceLevel) => void;
  toggleInjury: (injury: InjuryArea) => void;
  clearInjuries: () => void;
  setHealthNotes: (notes: string) => void;
  toggleGoal: (goal: Goal) => void;
  setEquipment: (equipment: EquipmentAccess) => void;
  completeIntake: () => void;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      completedIntake: false,
      age: null,
      heightFeet: null,
      heightInches: null,
      weightLb: null,
      experience: null,
      injuries: [],
      healthNotes: "",
      goals: [],
      equipment: null,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      setAge: (age) => set({ age }),
      setHeight: (heightFeet, heightInches) => set({ heightFeet, heightInches }),
      setWeightLb: (weightLb) => set({ weightLb }),
      setExperience: (experience) => set({ experience }),
      toggleInjury: (injury) =>
        set((s) => ({
          injuries: s.injuries.includes(injury)
            ? s.injuries.filter((i) => i !== injury)
            : [...s.injuries, injury],
        })),
      clearInjuries: () => set({ injuries: [] }),
      setHealthNotes: (healthNotes) => set({ healthNotes }),
      toggleGoal: (goal) =>
        set((s) => ({
          goals: s.goals.includes(goal) ? s.goals.filter((g) => g !== goal) : [...s.goals, goal],
        })),
      setEquipment: (equipment) => set({ equipment }),
      completeIntake: () => set({ completedIntake: true }),
    }),
    {
      name: "ironpath-profile",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
