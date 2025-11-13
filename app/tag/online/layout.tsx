import type { ReactNode } from "react";
import fs from "node:fs";
import path from "node:path";

export default function TagOnlineLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headHtml = fs.readFileSync(
    path.join(process.cwd(), "data", "tag-online-head.html"),
    "utf8"
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head dangerouslySetInnerHTML={{ __html: headHtml }} />
      <body>{children}</body>
    </html>
  );
}