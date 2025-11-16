import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { getSiteConfig } from "@/lib/site/getSiteConfig";

export const metadata = {
  title: "Term Of Use - Steal Brainrot",
  description: "Review the rules for using the Steal Brainrot fan site, embeds, and community features."
};

const clauses = [
  {
    title: "Acceptance of terms",
    items: [
      "By loading or interacting with the site you agree to this policy and any referenced documents.",
      "If you are under 13, a parent or guardian must review these terms with you before using the service.",
      "We may update the terms at any time. Continued use after changes means you accept the updated version."
    ]
  },
  {
    title: "Using our content",
    items: [
      "Embeds, screenshots, and copy are provided strictly for personal, non-commercial entertainment.",
      "Do not mirror our builds or scrape data for resale without written permission.",
      "You are responsible for following Roblox’s terms of service when you queue into any linked experience."
    ]
  },
  {
    title: "Community behavior",
    items: [
      "Keep submissions respectful—no harassment, discrimination, or spam in comments or contact messages.",
      "Do not attempt to hack, reverse engineer, or disrupt the site infrastructure.",
      "Security researchers can responsibly disclose vulnerabilities at support@stealabrainrot.quest."
    ]
  },
  {
    title: "Content ownership",
    items: [
      "We respect all applicable copyrights and trademarks. Brand assets belong to their respective owners.",
      "User-submitted guides or comments remain yours, but you grant us a license to display them on the site.",
      "Submit DMCA notices through the Copyright page so we can respond quickly."
    ]
  },
  {
    title: "Limitation of liability",
    items: [
      "We provide this fan resource “as is” without warranties of any kind. Downtime or bugs may occur.",
      "We are not liable for losses that stem from using linked games, third-party ads, or external services.",
      "Some jurisdictions do not allow certain disclaimers, so these limits may not apply in full to you."
    ]
  }
];

const enforcement = [
  "Temporary or permanent suspension of access to the site.",
  "Removal of offending user content without prior notice.",
  "Collaboration with platform partners and legal authorities when a report involves safety or IP violations."
];

const lastUpdated = "Effective date: 11 November 2025";

export default async function TermOfUsePage() {
  const site = await getSiteConfig();

  return (
    <>
      <Header brand={site.brand} navLinks={site.navLinks} searchPlaceholder={site.searchPlaceholder} />
      <main className="pb-16 pt-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 lg:px-8">
          <section className="card space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Terms of Use</p>
            <h1 className="text-3xl font-black">Play fair, stay safe</h1>
            <p className="text-lg text-white/80">
              These terms explain how you can use {site.brand}, what we expect from the community, and how we handle
              disputes. Please read them carefully before exploring the rest of the site.
            </p>
            <p className="text-sm text-white/50">{lastUpdated}</p>
          </section>

          {clauses.map((clause) => (
            <section key={clause.title} className="card space-y-3">
              <h2 className="text-2xl font-bold">{clause.title}</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
                {clause.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <section className="card space-y-4">
            <h2 className="text-2xl font-bold">If someone breaks the rules</h2>
            <p className="text-sm text-white/70">
              We consider reports carefully and take the least severe action necessary to protect the community.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
              {enforcement.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="card space-y-4">
            <h2 className="text-2xl font-bold">Questions or disputes</h2>
            <p className="text-white/80">
              Email{" "}
              <a href="mailto:support@stealabrainrot.quest" className="text-accent underline-offset-4 hover:underline">
                support@stealabrainrot.quest
              </a>{" "}
              with the subject line &ldquo;Terms Inquiry&rdquo; and include any relevant links or evidence.
            </p>
          </section>
        </div>
      </main>
      <Footer site={site} />
    </>
  );
}
