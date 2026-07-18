import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { exercises } from "@/lib/exercises";
import { ExerciseCategory } from "@/types";

const categoryLabel: Record<ExerciseCategory, string> = {
  warmup: "Warm-up",
  strength: "Strength",
  core: "Core",
  carry: "Carries",
  cardio: "Cardio",
};

export default function ExerciseLibraryPage() {
  const categories = Object.keys(categoryLabel) as ExerciseCategory[];

  return (
    <div className="flex flex-col gap-5 pb-4">
      <h1 className="text-2xl font-bold">Exercise Library</h1>
      {categories.map((category) => {
        const list = exercises.filter((e) => e.category === category);
        if (list.length === 0) return null;
        return (
          <div key={category} className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{categoryLabel[category]}</p>
            <Card className="flex flex-col divide-y divide-border p-0">
              {list.map((exercise) => (
                <Link
                  key={exercise.id}
                  href={`/exercises/${exercise.id}`}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <span className="font-medium">{exercise.name}</span>
                  <span className="text-muted">›</span>
                </Link>
              ))}
            </Card>
          </div>
        );
      })}
    </div>
  );
}
