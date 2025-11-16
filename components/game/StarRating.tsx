"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
}

export function StarRating({ rating }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const value = hoverValue ?? rating;

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const percentage = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const snapped = Math.max(0.5, Math.round(percentage * 10) / 2);
    setHoverValue(snapped);
  };

  return (
    <div className="text-white">
      <div
        className="relative inline-flex cursor-pointer select-none text-2xl leading-none text-white/15"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverValue(null)}
        aria-label={`Average rating ${rating.toFixed(1)} out of 5`}
      >
        <span aria-hidden="true">★★★★★</span>
        <span
          className="pointer-events-none absolute inset-0 overflow-hidden text-accent"
          style={{ width: `${(value / 5) * 100}%` }}
          aria-hidden="true"
        >
          ★★★★★
        </span>
      </div>
      <span className="ml-2 text-sm font-semibold text-white/90 align-middle">{value.toFixed(1)}</span>
    </div>
  );
}
