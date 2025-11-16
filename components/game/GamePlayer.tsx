"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { HeroData } from "@/lib/homepage/types";
import { StarRating } from "./StarRating";

interface GamePlayerProps {
  hero: HeroData;
  scrollTargetId: string;
}

export function GamePlayer({ hero, scrollTargetId }: GamePlayerProps) {
  const [isTheater, setIsTheater] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const scrollToComments = () => {
    const section = document.getElementById(scrollTargetId);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleTheater = () => {
    setIsTheater((prev) => !prev);
  };

  const toggleFullscreen = async () => {
    const container = playerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await container.requestFullscreen();
  };

  return (
    <section className="game-section" ref={playerRef}>
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/5 bg-black ${
          isTheater ? "h-[72vh]" : "aspect-video"
        }`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url(${hero.backgroundImage ?? hero.thumbnail ?? ""})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-night/80 via-night/60 to-night/40" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 py-10 text-center">
          <div className="max-w-sm rounded-3xl bg-black/30 p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
            {hero.thumbnail && (
              <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-2xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hero.thumbnail} alt={hero.title ?? "Game artwork"} className="h-full w-full object-cover" />
              </div>
            )}
            <p className="text-sm uppercase tracking-[0.4em] text-white/70">Roblox Experience</p>
            <h2 className="mt-3 text-3xl font-black text-white">{hero.title ?? "Steal Brainrot"}</h2>
            <p className="mt-2 text-white/70">
              Assemble your crew, steal the rarest Brainrots, and grow your meme empire faster than anyone else.
            </p>
            <Link
              href={hero.ctaUrl ?? "/steal-brainrot-online"}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-base font-bold text-black shadow-glow"
            >
              {hero.cta ?? "Play Now"}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-night/90 px-6 py-4">
          <StarRating rating={hero.rating} />
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="control-button" onClick={scrollToComments}>
              💬 Comments
            </button>
            <button type="button" className="control-button" onClick={toggleTheater}>
              🖥️ {isTheater ? "Default View" : "Theater Mode"}
            </button>
            <button type="button" className="control-button" onClick={toggleFullscreen}>
              ⛶ Fullscreen
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
