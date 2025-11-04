import type { ReactNode } from "react";
import "./globals.css";
import fs from "node:fs";
import path from "node:path";

const headHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "home-head.html"),
  "utf8"
);

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head dangerouslySetInnerHTML={{ __html: headHtml }} />
      <body>{children}</body>
    </html>
  );
}
