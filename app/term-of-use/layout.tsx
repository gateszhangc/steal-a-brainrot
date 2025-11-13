import fs from "node:fs";
import path from "node:path";

const headHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "term-of-use-head.html"),
  "utf8"
);

export const metadata = {
  title: "Term Of Use - Steal Brainrot",
  description: "The information Term Of Use at Steal Brainrot"
};

export default function TermOfUseLayout({
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