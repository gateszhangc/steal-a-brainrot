import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "dress-to-impress-body.html"),
  "utf8"
);

export default function DressToImpress() {
  return (
    <main
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
      suppressHydrationWarning
    />
  );
}