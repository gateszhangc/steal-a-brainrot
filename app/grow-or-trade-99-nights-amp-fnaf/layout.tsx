import fs from "node:fs";
import path from "node:path";

const headHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "grow-or-trade-99-nights-amp-fnaf-head.html"),
  "utf8"
);

export default function GrowOrTrade99NightsAmpFnafLayout({
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