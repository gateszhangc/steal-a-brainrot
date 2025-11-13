import fs from "node:fs";
import path from "node:path";

const headHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "games-meme-head.html"),
  "utf8"
);

export default function GamesMemeLayout({
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