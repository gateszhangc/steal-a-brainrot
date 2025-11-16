"use client";

import Image from "next/image";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
}

const STAR_IMAGES = {
  on: "/themes/steal-brainrot.io/rs/plugins/raty/images/star-on-big.png",
  half: "/themes/steal-brainrot.io/rs/plugins/raty/images/star-half-big.png",
  off: "/themes/steal-brainrot.io/rs/plugins/raty/images/star-off-big.png"
};

export function StarRating({ rating }: StarRatingProps) {
  const [selected, setSelected] = useState(rating);
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? selected;

  const getStarType = (value: number) => {
    if (value >= 0.75) return STAR_IMAGES.on;
    if (value >= 0.25) return STAR_IMAGES.half;
    return STAR_IMAGES.off;
  };

  return (
    <div className="flex flex-col" onMouseLeave={() => setHover(null)}>
      <div className="flex items-center gap-1" aria-label={`Average rating ${rating.toFixed(1)} out of 5`}>
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          const delta = display - index;
          const src = getStarType(delta);
          return (
            <button
              key={starValue}
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onMouseEnter={() => setHover(starValue)}
              onFocus={() => setHover(starValue)}
              onBlur={() => setHover(null)}
              onClick={() => setSelected(starValue)}
              aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            >
              <Image src={src} alt="" width={24} height={24} />
            </button>
          );
        })}
        <span className="ml-2 text-sm font-semibold text-white/90">{display.toFixed(1)}</span>
      </div>
      <span className="text-xs uppercase tracking-widest text-white/50">Rating</span>
    </div>
  );
}
