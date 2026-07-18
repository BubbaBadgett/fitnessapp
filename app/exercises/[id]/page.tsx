import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { exercises, getExerciseById } from "@/lib/exercises";

export function generateStaticParams() {
  return exercises.map((e) => ({ id: e.id }));
}

export default async function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exercise = getExerciseById(id);
  if (!exercise) notFound();

  const alternative = exercise.backFriendlyAlternativeId
    ? getExerciseById(exercise.backFriendlyAlternativeId)
    : null;

  const searchQuery = encodeURIComponent(`${exercise.name} proper form demonstration`);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div>
        <Link href="/exercises" className="text-sm text-muted">
          ‹ Exercise Library
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{exercise.name}</h1>
        <p className="text-sm text-muted">{exercise.equipment}</p>
      </div>

      <a
        href={`https://www.youtube.com/results?search_query=${searchQuery}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-2xl bg-accent-strong px-5 py-3.5 text-base font-semibold text-black"
      >
        ▶ Search for a demo video
      </a>

      <Card>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Muscles Worked</p>
        <div className="flex flex-wrap gap-2">
          {exercise.muscles.map((m) => (
            <span key={m} className="rounded-full bg-surface-raised px-3 py-1 text-sm">
              {m}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Coaching Cues</p>
        <ul className="flex flex-col gap-1.5">
          {exercise.cues.map((cue) => (
            <li key={cue} className="flex gap-2 text-sm">
              <span className="text-accent-strong">•</span>
              {cue}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Common Mistakes</p>
        <ul className="flex flex-col gap-1.5">
          {exercise.mistakes.map((mistake) => (
            <li key={mistake} className="flex gap-2 text-sm text-muted">
              <span className="text-danger">•</span>
              {mistake}
            </li>
          ))}
        </ul>
      </Card>

      {alternative && (
        <Card className="bg-warn/10 border-warn/30">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-warn">Back-Friendly Alternative</p>
          <Link href={`/exercises/${alternative.id}`} className="text-lg font-semibold underline underline-offset-4">
            {alternative.name}
          </Link>
          {exercise.backFriendlyNote && <p className="mt-1 text-sm text-muted">{exercise.backFriendlyNote}</p>}
        </Card>
      )}
    </div>
  );
}
