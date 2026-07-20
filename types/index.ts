// Core data model. Kept intentionally storage-agnostic so the persistence
// layer can move from localStorage to a backend (e.g. Supabase) later
// without changing these shapes.

export type SetLog = {
  weight: number | null;
  reps: number | null;
  completed: boolean;
};

export type TemplateExercise = {
  exerciseId: string;
  sets: number;
  reps: string; // display string, e.g. "8-10", "30-45 sec", "4 x 40 yards"
};

export type ExerciseLog = {
  exerciseId: string;
  name: string;
  targetSets: number;
  targetReps: string;
  sets: SetLog[];
  notes: string;
  completed: boolean;
};

export type WorkoutTemplateType = "strength" | "cardio" | "recovery";

export type WorkoutTemplate = {
  id: string;
  name: string;
  type: WorkoutTemplateType;
  estimatedMinutes: number;
  description?: string;
  warmup?: string[];
  exercises?: TemplateExercise[];
  cooldown?: string;
};

export type WorkoutLog = {
  id: string;
  date: string; // yyyy-mm-dd
  templateId: string;
  name: string;
  type: WorkoutTemplateType;
  exercises: ExerciseLog[];
  durationMin: number | null;
  startedAt: string; // ISO timestamp
  completedAt: string | null;
};

export type WeightEntry = {
  date: string; // yyyy-mm-dd
  weight: number;
};

export type ExerciseCategory = "warmup" | "strength" | "core" | "carry" | "cardio";

export type Exercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscles: string[];
  equipment: string;
  cues: string[];
  mistakes: string[];
  backFriendlyAlternativeId: string | null;
  backFriendlyNote?: string;
};

export type ProgramDay = {
  weekday: number; // 0 = Sunday ... 6 = Saturday
  label: string;
  templateId: string | null;
};

export type ExperienceLevel = "new" | "some" | "regular" | "advanced";
export type InjuryArea = "back" | "knee" | "shoulder" | "hip" | "wrist_elbow";
export type Goal =
  | "lose_fat"
  | "build_strength"
  | "build_muscle"
  | "improve_cardio"
  | "general_health"
  | "sport_performance";
export type EquipmentAccess = "full_gym" | "home_dumbbells" | "bodyweight";

export type Profile = {
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
};
