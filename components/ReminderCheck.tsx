"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useWeightStore } from "@/store/useWeightStore";
import { useWorkoutStore } from "@/store/useWorkoutStore";
import { getTodaysTemplate } from "@/lib/program";
import { toDateKey } from "@/lib/date";

// Best-effort local reminders: fires while the app is open, since a plain
// PWA without a push server can't wake up once fully closed.
export function ReminderCheck() {
  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const lastWeightReminderDate = useSettingsStore((s) => s.lastWeightReminderDate);
  const lastWorkoutReminderDate = useSettingsStore((s) => s.lastWorkoutReminderDate);
  const setLastWeightReminderDate = useSettingsStore((s) => s.setLastWeightReminderDate);
  const setLastWorkoutReminderDate = useSettingsStore((s) => s.setLastWorkoutReminderDate);
  const weightEntries = useWeightStore((s) => s.entries);
  const workouts = useWorkoutStore((s) => s.workouts);

  useEffect(() => {
    if (!remindersEnabled) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const today = new Date();
    const todayKey = toDateKey(today);
    const hour = today.getHours();

    if (hour >= 7 && lastWeightReminderDate !== todayKey) {
      const loggedToday = weightEntries.some((e) => e.date === todayKey);
      if (!loggedToday) {
        new Notification("Good morning", { body: "Step on the scale and log today's weight." });
        setLastWeightReminderDate(todayKey);
      }
    }

    if (hour >= 17 && lastWorkoutReminderDate !== todayKey) {
      const template = getTodaysTemplate(today);
      if (template) {
        const done = workouts.some(
          (w) => w.date === todayKey && w.templateId === template.id && w.completedAt
        );
        if (!done) {
          new Notification("IronPath", {
            body: `${template.name} is still on the board today (~${template.estimatedMinutes} min).`,
          });
          setLastWorkoutReminderDate(todayKey);
        }
      }
    }
  }, [
    remindersEnabled,
    lastWeightReminderDate,
    lastWorkoutReminderDate,
    weightEntries,
    workouts,
    setLastWeightReminderDate,
    setLastWorkoutReminderDate,
  ]);

  return null;
}
