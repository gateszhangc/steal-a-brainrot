import type { GameStats } from "@/lib/homepage/types";

interface GameInfoGridProps {
  stats: GameStats;
}

const LABELS: { key: keyof GameStats; label: string }[] = [
  { key: "rating", label: "Rating" },
  { key: "plays", label: "Play Count" },
  { key: "developer", label: "Developer" },
  { key: "releaseDate", label: "Release Date" },
  { key: "technology", label: "Technology" },
  { key: "categories", label: "Categories" }
];

export function GameInfoGrid({ stats }: GameInfoGridProps) {
  return (
    <section className="card">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {LABELS.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-2 rounded-xl bg-surface/60 p-4">
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">{label}</span>
            {key === "categories" ? (
              <div className="flex flex-wrap gap-2 text-sm text-white/90">
                {stats.categories.map((category) => (
                  <span key={category} className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-wide">
                    {category}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xl font-semibold text-white">{stats[key]}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
