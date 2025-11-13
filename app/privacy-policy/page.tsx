import fs from "node:fs";
import path from "node:path";
import Head from "next/head";

const bodyHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "privacy-policy-body.html"),
  "utf8"
);

const headHtml = fs.readFileSync(
  path.join(process.cwd(), "data", "privacy-policy-head.html"),
  "utf8"
);

export const metadata = {
  title: "Privacy Policy - Steal Brainrot",
  description: "The information privacy policy at Steal Brainrot",
  robots: "noindex"
};

export default function PrivacyPolicy() {
  return (
    <>
      <Head dangerouslySetInnerHTML={{ __html: headHtml }} />
      <main
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
        suppressHydrationWarning
      />
    </>
  );
}