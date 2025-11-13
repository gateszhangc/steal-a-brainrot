import fs from "node:fs";
import path from "node:path";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "contact-us-body.html"),
  "utf8"
);

export const metadata = {
  title: "Contact Us - Steal Brainrot",
  description: "The information Contact Us at Steal Brainrot",
  keywords: "contact us steal brainrot"
};

export default function ContactUsPage() {
  return <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}