"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useStoresReady } from "@/hooks/useStoresReady";
import { useProfileStore } from "@/store/useProfileStore";
import { EquipmentAccess, ExperienceLevel, Goal, InjuryArea } from "@/types";

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "new", label: "New to structured exercise" },
  { value: "some", label: "Some experience" },
  { value: "regular", label: "Train regularly" },
  { value: "advanced", label: "Very experienced / athlete" },
];

const INJURY_OPTIONS: { value: InjuryArea; label: string }[] = [
  { value: "back", label: "Back / Spine" },
  { value: "knee", label: "Knee" },
  { value: "shoulder", label: "Shoulder" },
  { value: "hip", label: "Hip" },
  { value: "wrist_elbow", label: "Wrist / Elbow" },
];

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: "lose_fat", label: "Lose fat" },
  { value: "build_strength", label: "Build strength" },
  { value: "build_muscle", label: "Build muscle" },
  { value: "improve_cardio", label: "Improve cardio fitness" },
  { value: "general_health", label: "General health & longevity" },
  { value: "sport_performance", label: "Sport-specific performance" },
];

const EQUIPMENT_OPTIONS: { value: EquipmentAccess; label: string }[] = [
  { value: "full_gym", label: "Full gym" },
  { value: "home_dumbbells", label: "Home with dumbbells" },
  { value: "bodyweight", label: "Bodyweight only" },
];

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left text-base font-medium transition ${
        selected
          ? "border-accent-strong bg-accent-strong/15 text-accent-strong"
          : "border-border bg-surface-raised text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

const TOTAL_STEPS = 6;

export default function TrainingProfilePage() {
  const ready = useStoresReady();
  const router = useRouter();
  const profile = useProfileStore((s) => s);

  const [step, setStep] = useState(0);

  if (!ready) {
    return <div className="animate-pulse text-muted">Loading…</div>;
  }

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function handleSave() {
    profile.completeIntake();
    router.push("/settings");
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div>
        <Link href="/settings" className="text-sm text-muted">
          ‹ Settings
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Training Profile</h1>
      </div>

      {step > 0 && <ProgressBar value={(step / TOTAL_STEPS) * 100} />}

      {step === 0 && (
        <Card className="flex flex-col gap-3">
          <p className="text-lg font-semibold">Let&apos;s build you a plan that fits.</p>
          <p className="text-muted">
            Answer a few quick questions about your body, history, and goals — about a minute — and
            IronPath will pick the right exercises for you. You can update this any time.
          </p>
          <Button onClick={next} className="mt-2 w-full">
            Get Started
          </Button>
        </Card>
      )}

      {step === 1 && (
        <Card className="flex flex-col gap-4">
          <p className="text-lg font-semibold">About You</p>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Age</span>
            <input
              type="number"
              inputMode="numeric"
              value={profile.age ?? ""}
              onChange={(e) => profile.setAge(e.target.value === "" ? null : Number(e.target.value))}
              className="rounded-xl bg-surface-raised border border-border px-3 py-2.5 text-lg focus:outline-none focus:border-accent-strong"
            />
          </label>
          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Height (ft)</span>
              <input
                type="number"
                inputMode="numeric"
                value={profile.heightFeet ?? ""}
                onChange={(e) =>
                  profile.setHeight(e.target.value === "" ? null : Number(e.target.value), profile.heightInches)
                }
                className="rounded-xl bg-surface-raised border border-border px-3 py-2.5 text-lg focus:outline-none focus:border-accent-strong"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Height (in)</span>
              <input
                type="number"
                inputMode="numeric"
                value={profile.heightInches ?? ""}
                onChange={(e) =>
                  profile.setHeight(profile.heightFeet, e.target.value === "" ? null : Number(e.target.value))
                }
                className="rounded-xl bg-surface-raised border border-border px-3 py-2.5 text-lg focus:outline-none focus:border-accent-strong"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Weight (lbs)</span>
            <input
              type="number"
              inputMode="decimal"
              value={profile.weightLb ?? ""}
              onChange={(e) => profile.setWeightLb(e.target.value === "" ? null : Number(e.target.value))}
              className="rounded-xl bg-surface-raised border border-border px-3 py-2.5 text-lg focus:outline-none focus:border-accent-strong"
            />
          </label>
        </Card>
      )}

      {step === 2 && (
        <Card className="flex flex-col gap-3">
          <p className="text-lg font-semibold">Fitness Experience</p>
          <div className="flex flex-col gap-2">
            {EXPERIENCE_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                selected={profile.experience === opt.value}
                onClick={() => profile.setExperience(opt.value)}
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="flex flex-col gap-4">
          <div>
            <p className="text-lg font-semibold">Injuries & Health History</p>
            <p className="text-sm text-muted">Select any that apply — this shapes which exercises we pick.</p>
          </div>
          <div className="flex flex-col gap-2">
            {INJURY_OPTIONS.map((opt) => (
              <Chip key={opt.value} selected={profile.injuries.includes(opt.value)} onClick={() => profile.toggleInjury(opt.value)}>
                {opt.label}
              </Chip>
            ))}
            <Chip selected={profile.injuries.length === 0} onClick={() => profile.clearInjuries()}>
              None of these
            </Chip>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Anything else we should know? (surgeries, conditions, implants, etc.)
            </span>
            <textarea
              value={profile.healthNotes}
              onChange={(e) => profile.setHealthNotes(e.target.value)}
              rows={3}
              className="rounded-xl bg-surface-raised border border-border px-3 py-2.5 text-base focus:outline-none focus:border-accent-strong"
            />
          </label>
        </Card>
      )}

      {step === 4 && (
        <Card className="flex flex-col gap-3">
          <div>
            <p className="text-lg font-semibold">Goals</p>
            <p className="text-sm text-muted">Pick as many as apply.</p>
          </div>
          <div className="flex flex-col gap-2">
            {GOAL_OPTIONS.map((opt) => (
              <Chip key={opt.value} selected={profile.goals.includes(opt.value)} onClick={() => profile.toggleGoal(opt.value)}>
                {opt.label}
              </Chip>
            ))}
          </div>
        </Card>
      )}

      {step === 5 && (
        <Card className="flex flex-col gap-3">
          <p className="text-lg font-semibold">Where You Train</p>
          <div className="flex flex-col gap-2">
            {EQUIPMENT_OPTIONS.map((opt) => (
              <Chip key={opt.value} selected={profile.equipment === opt.value} onClick={() => profile.setEquipment(opt.value)}>
                {opt.label}
              </Chip>
            ))}
          </div>
          {profile.equipment && profile.equipment !== "full_gym" && (
            <p className="rounded-xl bg-warn/10 px-3 py-2 text-xs text-warn">
              Home/bodyweight-specific exercise substitutions are on the roadmap — for now your plan
              will assume gym equipment access.
            </p>
          )}
        </Card>
      )}

      {step === TOTAL_STEPS && (
        <Card className="flex flex-col gap-3">
          <p className="text-lg font-semibold">Your Plan</p>
          <p className="text-muted">
            {profile.injuries.includes("back")
              ? "Based on your back/spine history, we'll build your Strength A/B days from the Back-Friendly track — machines and dumbbells over loaded barbell lifts."
              : "No back issues on file, so we'll build your Strength A/B days from the Classic Strength track — traditional barbell lifts like the back squat and bench press."}
          </p>
          {(profile.injuries.includes("knee") || profile.injuries.includes("hip")) && (
            <p className="text-sm text-muted">
              ✓ Deep knee/hip flexion movements (squats, step-ups) will be swapped for Leg Press.
            </p>
          )}
          {profile.injuries.includes("shoulder") && (
            <p className="text-sm text-muted">
              ✓ Overhead and incline pressing will be swapped for Machine Chest Press.
            </p>
          )}
          {profile.injuries.includes("wrist_elbow") && (
            <p className="text-sm text-muted">
              ✓ Fixed-bar grip lifts will be swapped for dumbbell/machine versions.
            </p>
          )}
          <p className="text-xs text-muted">
            Goals and where-you-train are saved to your profile now — as IronPath&apos;s AI Coach comes
            online, they&apos;ll shape your coaching notes too.
          </p>
          <Button onClick={handleSave} className="mt-2 w-full">
            Save & Build My Plan
          </Button>
        </Card>
      )}

      {step > 0 && step < TOTAL_STEPS && (
        <div className="flex gap-3">
          <Button variant="secondary" onClick={back} className="flex-1">
            Back
          </Button>
          <Button onClick={next} className="flex-1">
            Next
          </Button>
        </div>
      )}
      {step === TOTAL_STEPS && (
        <Button variant="secondary" onClick={back} className="w-full">
          Back
        </Button>
      )}
    </div>
  );
}
