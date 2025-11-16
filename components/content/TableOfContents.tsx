"use client";

import type { TocItem } from "@/lib/homepage/types";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const handleClick = (anchor: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById(anchor);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${anchor}`);
    }
  };

  return (
    <div className="mb-8 rounded-xl bg-slate/80 p-6">
      <h3 className="mb-4 text-lg font-semibold">📋 On-Page Navigation</h3>
      <ol className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={handleClick(item.id)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-white/80 transition hover:bg-white/5 hover:text-accent"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
