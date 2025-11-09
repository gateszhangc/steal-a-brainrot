import type { ReactNode } from "react";
import "./globals.css";
import fs from "node:fs";
import path from "node:path";

export const metadata = {
  title: "Steal a Brainrot",
  description: "Play Steal A Brainrot now and step into the Roblox-style world full of absurd meme characters"
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  const headHtml = fs.readFileSync(
    path.join(process.cwd(), "data", "home-head.html"),
    "utf8"
  );
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head dangerouslySetInnerHTML={{ __html: headHtml }} />
      <body>{children}</body>
    </html>
  );
}
