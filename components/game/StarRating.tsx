"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
}

const TOTAL_STARS = 5;

export function StarRating({ rating }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? rating;

  return (
    <div className="flex flex-col" onMouseLeave={() => setHoverValue(null)}>
      <div className="flex items-center gap-1" aria-label={`Average rating ${rating.toFixed(1)} out of 5`}>
        {Array.from({ length: TOTAL_STARS }).map((_, index) => {
          const starNumber = index + 1;
          const fillValue = Math.max(0, Math.min(1, displayValue - index));
          const fillPercent = Math.round(fillValue * 100);

          return (
            <button
              key={starNumber}
              type="button"
              className="relative h-7 w-7 text-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onMouseEnter={() => setHoverValue(starNumber)}
              onFocus={() => setHoverValue(starNumber)}
              onBlur={() => setHoverValue(null)}
              aria-label={`${starNumber} star${starNumber > 1 ? "s" : ""}`}
            >
              <span className="text-2xl leading-none">★</span>
              <span
                className="pointer-events-none absolute inset-0 overflow-hidden text-2xl leading-none text-accent"
                style={{ width: `${fillPercent}%` }}
                aria-hidden="true"
              >
                ★
              </span>
            </button>
          );
        })}
      </div>
      <span className="mt-1 text-xs uppercase tracking-widest text-white/60">Rating {rating.toFixed(1)}</span>
    </div>
  );
}
