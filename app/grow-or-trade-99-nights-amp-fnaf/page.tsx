import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "grow-or-trade-99-nights-amp-fnaf-body.html"),
  "utf8"
);

export default function GrowOrTrade99NightsAmpFnaf() {
  return (
    <main
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
      suppressHydrationWarning
    />
  );
}