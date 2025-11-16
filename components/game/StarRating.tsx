"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
}

const STAR = {
  on: "/themes/steal-brainrot.io/rs/plugins/raty/images/star-on-big.png",
  half: "/themes/steal-brainrot.io/rs/plugins/raty/images/star-half-big.png",
  off: "/themes/steal-brainrot.io/rs/plugins/raty/images/star-off-big.png"
};

export function StarRating({ rating }: StarRatingProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const value = hover ?? selected ?? rating;

  const spriteFor = (index: number) => {
    const delta = value - index;
    if (delta >= 1) return STAR.on;
    if (delta >= 0.5) return STAR.half;
    return STAR.off;
  };

  return (
    <div className="flex items-center gap-1 text-white" aria-label={`Average rating ${rating.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }).map((_, idx) => (
        <button
          key={idx}
          type="button"
          className="inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onMouseEnter={() => setHover(idx + 1)}
          onFocus={() => setHover(idx + 1)}
          onMouseLeave={() => setHover(null)}
          onBlur={() => setHover(null)}
          onClick={() => setSelected(idx + 1)}
          aria-label={`${idx + 1} star${idx ? "s" : ""}`}
        >
          <img src={spriteFor(idx)} alt="" width={22} height={22} />
        </button>
      ))}
      <span className="ml-2 text-sm font-semibold text-white/90">{value.toFixed(1)}</span>
    </div>
  );
}
