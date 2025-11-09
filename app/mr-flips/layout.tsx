import fs from "node:fs";
import path from "node:path";

const headHtml = fs.readFileSync(
  path.join(process.cwd(), "steal-brainrot_mr-flips.html"),
  "utf8"
);

export default function MrFlipsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Extract head content from the HTML file
  const headMatch = headHtml.match(/<head>(.*?)<\/head>/s);
  const headContent = headMatch ? headMatch[1] : "";
  
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: headContent }} />
      {children}
    </>
  );
}