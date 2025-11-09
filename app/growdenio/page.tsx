import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "steal-brainrot_growdenio.html"),
  "utf8"
);

export default function GamePage() {
  const bodyMatch = bodyHtml.match(/<body[^>]*>(.*?)<\/body>/s);
  const bodyContent = bodyMatch ? bodyMatch[1] : "";
  
  return <div dangerouslySetInnerHTML={{ __html: bodyContent }} />;
}