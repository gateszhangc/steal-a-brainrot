import fs from "node:fs";
import path from "node:path";

const headHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "steal-a-brainrot-2-head.html"),
  "utf8"
);

export default function StealABrainrot2Layout({
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