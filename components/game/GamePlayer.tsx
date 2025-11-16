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
    const container = playerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await container.requestFullscreen();
  };

  return (
    <section className="game-section">
      <div
        ref={playerRef}
        className={`relative overflow-hidden rounded-2xl border border-white/5 bg-black ${
          isTheater ? "h-[72vh]" : "aspect-video"
        }`}
      >
        <iframe
          ref={iframeRef}
          src={hero.embedUrl}
          title="Play Steal A Brainrot"
          loading="lazy"
          className="absolute inset-0 h-full w-full"
          allowFullScreen
        />
        <div className="pointer-events-auto absolute bottom-6 left-1/2 flex w-[90%] -translate-x-1/2 flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-night/85 px-6 py-4 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-2">
            <StarRating rating={hero.rating} />
            <p className="text-xs text-white/60">Based on {hero.votes.toLocaleString()} votes</p>
          </div>
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
