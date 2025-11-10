import fs from "node:fs";
import path from "node:path";

const headHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "brainrot-alphabet-lore-musical-merge-head.html"),
  "utf8"
);

export default function BrainrotAlphabetLoreMusicalMergeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: headHtml }} />
      {children}
    </>
  );
}