import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "ragdoll-playground-body.html"),
  "utf8"
);

export default function RagdollPlaygroundPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}