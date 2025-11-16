"use client";

import Link from "next/link";
import type { SiteLink } from "@/lib/homepage/types";
import { useEffect } from "react";

interface MobileMenuProps {
  open: boolean;
  links: SiteLink[];
  brand: string;
  onClose: () => void;
}

export function MobileMenu({ open, links, brand, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="absolute inset-y-0 right-0 w-72 bg-panel p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="rounded-lg bg-accent px-3 py-1 text-sm font-bold text-black">
            {brand}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-white"
            aria-label="关闭菜单"
          >
            ×
          </button>
        </div>
        <nav className="mt-6 flex flex-col gap-4 text-lg font-semibold">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose} className="hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
