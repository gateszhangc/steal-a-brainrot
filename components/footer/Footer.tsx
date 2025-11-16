import Link from "next/link";
import type { SiteConfig } from "@/lib/homepage/types";

interface FooterProps {
  site: SiteConfig;
}

export function Footer({ site }: FooterProps) {
  return (
    <footer className="mt-10 border-t border-white/5 bg-panel px-6 py-10 text-sm text-white/70">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="rounded-lg bg-accent px-4 py-2 text-base font-black text-black">{site.brand}</div>
        <nav className="flex flex-wrap gap-4 text-sm font-medium">
          {site.footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-6 max-w-[1400px] border-t border-white/10 pt-6 text-center text-xs text-white/60">
        <p>{site.copyright}</p>
        <p className="mt-2">{site.disclaimer}</p>
      </div>
    </footer>
  );
}
