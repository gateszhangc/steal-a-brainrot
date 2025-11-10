import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "brainrot-alphabet-lore-musical-merge-body.html"),
  "utf8"
);

export default function BrainrotAlphabetLoreMusicalMerge() {
  return (
    <main
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
      suppressHydrationWarning
    />
  );
}