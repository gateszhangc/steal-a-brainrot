import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "games-meme-body.html"),
  "utf8"
);

export default function GamesMeme() {
  return (
    <main
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
      suppressHydrationWarning
    />
  );
}