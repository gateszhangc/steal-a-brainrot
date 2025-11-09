import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "steal-brainrot_mr-flips.html"),
  "utf8"
);

export default function MrFlipsPage() {
  // Extract body content from the HTML file
  const bodyMatch = bodyHtml.match(/<body[^>]*>(.*?)<\/body>/s);
  const bodyContent = bodyMatch ? bodyMatch[1] : "";
  
  return <div dangerouslySetInnerHTML={{ __html: bodyContent }} />;
}