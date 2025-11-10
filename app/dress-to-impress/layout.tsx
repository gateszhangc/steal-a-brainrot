import fs from "node:fs";
import path from "node:path";

const headHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "dress-to-impress-head.html"),
  "utf8"
);

export default function DressToImpressLayout({
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