import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  metadataBase: new URL("https://stealabrainrot.quest"),
  title: "Steal Brainrot | Play Steal A Brainrot Online",
  description:
    "Play Steal A Brainrot online with zero downloads. Build your base, steal rare Brainrots, and enjoy the chaotic Roblox-style heist gameplay.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Steal Brainrot | Play Steal A Brainrot Online",
    description:
      "Dive into the chaotic Roblox-inspired world of Steal A Brainrot. Collect, steal, and upgrade meme characters to boost your income.",
    url: "https://stealabrainrot.quest/",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Steal Brainrot | Play Steal A Brainrot Online",
    description:
      "Collect and steal meme Brainrots to grow your base. Play Steal A Brainrot instantly in your browser.",
    site: "@stealabrainrot"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} bg-night text-white`}>{children}</body>
    </html>
  );
}
