import { ProgramDay, WorkoutTemplate } from "@/types";

// The back-friendly strength + Zone 2 program, seeded from your plan.
export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: "strength-a",
    name: "Strength A",
    type: "strength",
    estimatedMinutes: 60,
    warmup: [
      "5 min treadmill walk (3-3.5 mph)",
      "Cat-Camel x10",
      "Bird Dog x8/side",
      "Glute Bridge x10",
      "Bodyweight Squat x10",
    ],
    exercises: [
      { exerciseId: "leg-press", sets: 3, reps: "10" },
      { exerciseId: "db-bench-press", sets: 3, reps: "8-10" },
      { exerciseId: "chest-supported-row", sets: 3, reps: "10" },
      { exerciseId: "rdl-dumbbell", sets: 3, reps: "8" },
      { exerciseId: "farmer-carry", sets: 4, reps: "40 yards" },
      { exerciseId: "plank", sets: 3, reps: "30-45 sec" },
    ],
    cooldown: "10 min easy bike",
  },
  {
    id: "strength-b",
    name: "Strength B",
    type: "strength",
    estimatedMinutes: 55,
    warmup: [
      "5 min treadmill walk",
      "Cat-Camel x10",
      "Bird Dog x8/side",
      "Band Pull-Apart x15",
    ],
    exercises: [
      { exerciseId: "goblet-squat", sets: 3, reps: "10" },
      { exerciseId: "lat-pulldown", sets: 3, reps: "10" },
      { exerciseId: "incline-db-press", sets: 3, reps: "10" },
      { exerciseId: "seated-cable-row", sets: 3, reps: "10" },
      { exerciseId: "split-squat", sets: 3, reps: "8/leg" },
      { exerciseId: "pallof-press", sets: 3, reps: "12" },
    ],
    cooldown: "10 min walk",
  },
  {
    id: "strength-c",
    name: "Strength C",
    type: "strength",
    estimatedMinutes: 55,
    warmup: [
      "5 min treadmill walk",
      "Glute Bridge x10",
      "Bodyweight Squat x10",
    ],
    exercises: [
      { exerciseId: "hack-squat", sets: 3, reps: "10" },
      { exerciseId: "machine-chest-press", sets: 3, reps: "10" },
      { exerciseId: "cable-row", sets: 3, reps: "10" },
      { exerciseId: "step-ups", sets: 3, reps: "10" },
      { exerciseId: "face-pulls", sets: 3, reps: "15" },
      { exerciseId: "suitcase-carry", sets: 3, reps: "1 trip/side" },
    ],
  },
  {
    id: "zone2",
    name: "Zone 2 Cardio",
    type: "cardio",
    estimatedMinutes: 50,
    description:
      "Incline treadmill, bike, or elliptical. Keep it conversational — you should be able to talk in full sentences the whole time. This should feel almost too easy.",
  },
  {
    id: "recovery-mobility",
    name: "Mobility + Core",
    type: "recovery",
    estimatedMinutes: 35,
    description:
      "Hips, thoracic spine, and shoulders. Bird Dogs, Side Planks, Dead Bugs, Pallof Press, Glute Bridges. Finish with a 20-minute walk.",
  },
  {
    id: "long-session",
    name: "Long Session",
    type: "cardio",
    estimatedMinutes: 75,
    description:
      "60-90 minutes of something you enjoy: long walk, bike ride, hike, kayak, swim. Time on your feet matters more than intensity today.",
  },
  {
    id: "recovery-sunday",
    name: "Recovery",
    type: "recovery",
    estimatedMinutes: 20,
    description: "Stretch, foam roll, easy walk. Nothing hard — let the week's work absorb.",
  },
];

// weekday: 0 = Sunday ... 6 = Saturday
export const weeklyProgram: ProgramDay[] = [
  { weekday: 1, label: "Strength A", templateId: "strength-a" },
  { weekday: 2, label: "Zone 2 Cardio", templateId: "zone2" },
  { weekday: 3, label: "Strength B", templateId: "strength-b" },
  { weekday: 4, label: "Mobility + Core", templateId: "recovery-mobility" },
  { weekday: 5, label: "Strength C", templateId: "strength-c" },
  { weekday: 6, label: "Long Session", templateId: "long-session" },
  { weekday: 0, label: "Recovery", templateId: "recovery-sunday" },
];

export function getTemplateById(id: string): WorkoutTemplate | undefined {
  return workoutTemplates.find((t) => t.id === id);
}

export function getProgramDay(weekday: number): ProgramDay {
  return weeklyProgram.find((d) => d.weekday === weekday) ?? weeklyProgram[0];
}

export function getTodaysTemplate(date: Date = new Date()): WorkoutTemplate | undefined {
  const day = getProgramDay(date.getDay());
  return day.templateId ? getTemplateById(day.templateId) : undefined;
}
