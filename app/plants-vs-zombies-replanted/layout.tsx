import fs from "node:fs";
import path from "node:path";

const headHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "plants-vs-zombies-replanted-head.html"),
  "utf8"
);

export default function PlantsVsZombiesReplantedLayout({
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