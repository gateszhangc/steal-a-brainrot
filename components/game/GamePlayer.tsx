"use client";

import { useRef, useState } from "react";
import type { HeroData } from "@/lib/homepage/types";
import { StarRating } from "./StarRating";

interface GamePlayerProps {
  hero: HeroData;
  scrollTargetId: string;
}

export function GamePlayer({ hero, scrollTargetId }: GamePlayerProps) {
  const [isTheater, setIsTheater] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const scrollToComments = () => {
    const section = document.getElementById(scrollTargetId);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleTheater = () => {
    setIsTheater((prev) => !prev);
  };

  const toggleFullscreen = async () => {
    const target = iframeRef.current ?? playerRef.current;
    if (!target) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await target.requestFullscreen();
    }
  };

  return (
    <section className="game-section" ref={playerRef}>
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/5 bg-black ${
          isTheater ? "h-[72vh]" : "aspect-video"
        }`}
      >
        <iframe
          ref={iframeRef}
          src={hero.embedUrl}
          title={hero.title ?? "Play Steal a Brainrot"}
          loading="lazy"
          allowFullScreen
          className={`absolute inset-0 h-full w-full border-0 transition duration-500 ${
            isPlaying ? "opacity-100" : "opacity-25 blur-sm"
          }`}
        />
        {!isPlaying && (
          <div className="pointer-events-auto absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-night/80 via-night/60 to-night/70 px-6 py-10 text-center text-white">
            <div className="max-w-sm rounded-3xl bg-black/40 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
              {hero.thumbnail && (
                <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-2xl border border-white/10">
                  <img src={hero.thumbnail} alt={hero.title ?? "Game artwork"} className="h-full w-full object-cover" />
                </div>
              )}
              <p className="text-sm uppercase tracking-[0.4em] text-white/70">Roblox Experience</p>
              <h2 className="mt-3 text-3xl font-black text-white">{hero.title ?? "Steal Brainrot"}</h2>
              <p className="mt-2 text-white/70">
                Assemble your crew, steal the rarest Brainrots, and grow your meme empire faster than anyone else.
              </p>
              <button
                type="button"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-base font-bold text-black shadow-glow"
                onClick={() => setIsPlaying(true)}
              >
                {hero.cta ?? "Play Now"}
              </button>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[#3c404b]/95 px-6 py-4">
          <StarRating rating={hero.rating} />
          <div className="flex items-center gap-3">
            <button type="button" className="control-icon" onClick={scrollToComments} aria-label="Jump to comments">
              💬
            </button>
            <button type="button" className="control-icon" onClick={toggleTheater} aria-label="Toggle theater mode">
              ⤢
            </button>
            <button type="button" className="control-icon" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
              ⛶
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
