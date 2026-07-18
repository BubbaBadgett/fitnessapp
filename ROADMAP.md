# IronPath Roadmap

A back-friendly strength + Zone 2 training PWA. Started from a ChatGPT planning
session, built out here as a real, working app.

## Milestone 1 — MVP (shipped)

- [x] Next.js 16 + TypeScript + Tailwind CSS 4 project, dark-first design system
- [x] Installable PWA: manifest, generated icons, offline-capable service worker
- [x] Dashboard: greeting, today's weight, today's workout progress, weekly strip, streak
- [x] Workout tracker: per-set weight/reps logging, "last time" reference, auto-save,
      resume in-progress workout, back-friendly coaching tips, warm-up/cooldown
- [x] Daily weigh-in with 7-day rolling average and 30-day trend chart
- [x] Progress tab: total workouts, streak, 30-day consistency, 90-day weight trend,
      per-exercise strength progression, workout history
- [x] Exercise library: cues, muscles worked, common mistakes, back-friendly
      alternatives, link to search for a demo video
- [x] Settings: name, install prompt, best-effort local reminders, data export/reset
- [x] Seeded with the actual back-friendly program discussed (Strength A/B/C,
      Zone 2 cardio, mobility, long session, recovery)
- [x] All data local-first (localStorage via Zustand `persist`) — no account needed

## Milestone 2 — Make it feel alive

- [ ] Rest timer between sets
- [ ] Personal records tracking + celebratory moment when you hit one
- [ ] Editable/custom workout templates (swap exercises, adjust sets/reps)
- [ ] Body measurements + progress photos
- [ ] Real push notifications (needs a small notification server — a plain PWA
      can't wake up once fully closed)

## Milestone 3 — Cloud + multi-device

- [ ] Account + Supabase (or similar) sync, so the local-first store can push/pull
- [ ] Import the JSON export from Settings during migration

## Milestone 4 — AI Coach

- [ ] "My back hurts today" → auto-swap today's workout for back-friendly substitutes
- [ ] Weight/strength-trend-aware coaching notes ("increase Leg Press by 10 lb")
- [ ] Natural-language adjustments ("only have 30 minutes", "gym is packed")

## Later ideas

- Apple Health / Google Fit / watch integration (steps, heart rate, sleep)
- Nutrition guidance (protein target, water, meal check-ins) — no calorie counting
- Pattern recognition ("you've skipped cardio for two weeks — want a 30-min version?")
