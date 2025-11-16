"use client";

import Link from "next/link";
import { useRef } from "react";
import type { RecommendedGame } from "@/lib/homepage/types";

interface RecommendedRailProps {
  games: RecommendedGame[];
}

export function RecommendedRail({ games }: RecommendedRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;
    dragState.current = {
      isDown: true,
      startX: event.clientX,
      scrollLeft: container.scrollLeft
    };
    container.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container || !dragState.current.isDown) return;
    const walk = event.clientX - dragState.current.startX;
    container.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;
    dragState.current.isDown = false;
    container.releasePointerCapture(event.pointerId);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      container.scrollLeft += event.deltaY;
    }
  };

  return (
    <section className="card">
      <h3 className="mb-6 text-xl font-semibold text-accent">🎮 Recommended Games</h3>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/${game.slug}`}
            className="flex min-w-[140px] flex-col items-center rounded-xl bg-surface/80 px-4 py-5 text-center text-white transition duration-200 hover:-translate-y-2 hover:shadow-glow"
          >
            <div className="mb-3 flex h-24 w-full items-center justify-center rounded-lg bg-night text-4xl">
              {game.icon}
            </div>
            <span className="text-sm font-semibold">{game.name}</span>
            <span className="mt-1 text-xs text-white/60">{game.tagline}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
