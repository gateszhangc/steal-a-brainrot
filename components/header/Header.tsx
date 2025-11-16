"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteLink } from "@/lib/homepage/types";
import { MobileMenu } from "./MobileMenu";

interface HeaderProps {
  brand: string;
  navLinks: SiteLink[];
  searchPlaceholder: string;
}

export function Header({ brand, navLinks, searchPlaceholder }: HeaderProps) {
  const [term, setTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 2400);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!term.trim()) return;
    console.info(`Search submitted: ${term}`);
    setFeedback(`正在搜索：${term}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-panel/95 shadow-lg shadow-black/20 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="rounded-lg bg-accent px-3 py-1 text-sm font-black uppercase tracking-widest text-black"
        >
          {brand}
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-wide text-white/80 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>
        <form onSubmit={handleSearch} className="ml-auto hidden flex-1 items-center gap-3 md:flex">
          <input
            type="search"
            name="search"
            placeholder={searchPlaceholder}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            className="h-11 flex-1 rounded-lg border border-surface bg-night px-4 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
            aria-label="搜索游戏"
          />
          <button type="submit" className="control-button min-w-[90px] justify-center">
            🔍 搜索
          </button>
        </form>
        <button
          type="button"
          className="ml-auto text-3xl text-white md:hidden"
          aria-label="打开菜单"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>
      </div>
      <div className="flex w-full px-6 pb-4 md:hidden">
        <form onSubmit={handleSearch} className="flex w-full items-center gap-3">
          <input
            type="search"
            name="mobile-search"
            placeholder={searchPlaceholder}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            className="h-11 flex-1 rounded-lg border border-surface bg-night px-4 text-sm text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
            aria-label="搜索游戏"
          />
          <button type="submit" className="control-button min-w-[90px] justify-center">
            🔍
          </button>
        </form>
      </div>
      {feedback && (
        <p className="px-6 pb-3 text-xs text-white/60 md:text-right" aria-live="polite">
          {feedback}
        </p>
      )}
      <MobileMenu open={isOpen} brand={brand} links={navLinks} onClose={() => setIsOpen(false)} />
    </header>
  );
}
