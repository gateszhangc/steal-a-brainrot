import Link from "next/link";
import type { RecommendedGame } from "@/lib/homepage/types";

interface RecommendedRailProps {
  games: RecommendedGame[];
}

export function RecommendedRail({ games }: RecommendedRailProps) {
  return (
    <section className="card">
      <h3 className="mb-6 text-xl font-semibold text-accent">🎮 Recommended Games</h3>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/${game.slug}`}
            className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/5 bg-surface/70 p-3 text-center text-white transition hover:border-accent hover:shadow-glow"
          >
            <div className="h-24 w-full overflow-hidden rounded-xl bg-night">
              {game.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={game.image} alt={game.name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-3xl">{game.icon}</span>
              )}
            </div>
            <div className="mt-3 w-full">
              <p className="text-sm font-semibold leading-tight">{game.name}</p>
              <p className="text-xs text-white/60">{game.tagline}</p>
            </div>
            <span className="absolute inset-0 rounded-2xl border border-white/5 opacity-0 transition group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </section>
  );
}
