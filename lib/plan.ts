import { InjuryArea, Profile, TemplateExercise, WorkoutTemplate } from "@/types";
import { getProgramDay, getTemplateById } from "@/lib/program";

// Only these two slots have a "classic" (non-injury-specific) counterpart —
// Strength C and the cardio/recovery days are already sensible for anyone.
const CLASSIC_TRACK: Record<string, string> = {
  "strength-a": "classic-strength-a",
  "strength-b": "classic-strength-b",
};

// Per-injury spot substitutions, applied on top of whichever track is active.
const LOWER_BODY_SUB: Record<string, string> = {
  "back-squat": "leg-press",
  "goblet-squat": "leg-press",
  "split-squat": "leg-press",
  "step-ups": "leg-press",
  "hack-squat": "leg-press",
};
const SHOULDER_SUB: Record<string, string> = {
  "overhead-press": "machine-chest-press",
  "barbell-bench-press": "db-bench-press",
  "incline-db-press": "machine-chest-press",
};
const GRIP_SUB: Record<string, string> = {
  "barbell-bench-press": "db-bench-press",
  "bent-over-row": "chest-supported-row",
  "barbell-rdl": "rdl-dumbbell",
};

function substituteForInjuries(exercises: TemplateExercise[], injuries: InjuryArea[]): TemplateExercise[] {
  const lowerBody = injuries.includes("knee") || injuries.includes("hip");
  const shoulder = injuries.includes("shoulder");
  const gripSensitive = injuries.includes("wrist_elbow");

  return exercises.map((te) => {
    let exerciseId = te.exerciseId;
    if (lowerBody && LOWER_BODY_SUB[exerciseId]) exerciseId = LOWER_BODY_SUB[exerciseId];
    if (shoulder && SHOULDER_SUB[exerciseId]) exerciseId = SHOULDER_SUB[exerciseId];
    if (gripSensitive && GRIP_SUB[exerciseId]) exerciseId = GRIP_SUB[exerciseId];
    return exerciseId === te.exerciseId ? te : { ...te, exerciseId };
  });
}

// Resolves a base template id (e.g. "strength-a") to the content a given
// profile should actually see: the classic track if they've completed
// intake and have no back injury, then per-injury exercise swaps on top.
// The returned template keeps the BASE id so streak/week-status matching
// (which is keyed on base ids) is unaffected by personalization.
export function getEffectiveTemplate(
  baseTemplateId: string,
  profile: Profile | null
): WorkoutTemplate | undefined {
  const base = getTemplateById(baseTemplateId);
  if (!base) return undefined;

  const useClassic = !!profile?.completedIntake && !profile.injuries.includes("back");
  const classicId = useClassic ? CLASSIC_TRACK[baseTemplateId] : undefined;
  const contentSource = (classicId && getTemplateById(classicId)) || base;

  if (!contentSource.exercises) return { ...contentSource, id: base.id };

  const exercises = substituteForInjuries(contentSource.exercises, profile?.injuries ?? []);
  return { ...contentSource, id: base.id, exercises };
}

export function getTemplateForDate(date: Date, profile: Profile | null): WorkoutTemplate | undefined {
  const day = getProgramDay(date.getDay());
  return day.templateId ? getEffectiveTemplate(day.templateId, profile) : undefined;
}
