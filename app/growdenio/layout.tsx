import fs from "node:fs";
import path from "node:path";

const headHtml = fs.readFileSync(
  path.join(process.cwd(), "steal-brainrot_growdenio.html"),
  "utf8"
);

export default function GameLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const headMatch = headHtml.match(/<head>(.*?)<\/head>/s);
  const headContent = headMatch ? headMatch[1] : "";
  
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: headContent }} />
      {children}
    </>
  );
}