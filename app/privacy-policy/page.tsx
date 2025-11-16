import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { getSiteConfig } from "@/lib/site/getSiteConfig";

export const metadata = {
  title: "Privacy Policy - Steal Brainrot",
  description:
    "Understand how Steal Brainrot collects analytics data, stores contact submissions, and keeps your information safe."
};

const sections = [
  {
    title: "Information we collect",
    items: [
      "Usage data such as pages visited, launch actions, and error events captured by privacy-friendly analytics tools.",
      "Technical data like browser version, device type, and approximate region to help us prioritize compatibility work.",
      "Contact submissions containing your name, email, and message when you reach out for support or DMCA requests."
    ]
  },
  {
    title: "How we use your information",
    items: [
      "To keep the site stable, fast, and secure by monitoring aggregate performance metrics.",
      "To respond to support tickets, partnership pitches, or legal notices you submit through the contact form.",
      "To protect the community by investigating abuse reports and blocking malicious traffic."
    ]
  },
  {
    title: "Third-party services",
    description:
      "We rely on a short list of vendors to operate this fan hub. Each provider sees only the data required to perform their service and is bound by their own privacy terms.",
    items: [
      "Analytics providers to aggregate visit counts and device stats. Data is stored anonymously and never sold.",
      "Content delivery and hosting platforms that serve static assets and cache game embeds.",
      "Email and error-reporting tooling so we can reply to your tickets and debug outages quickly."
    ]
  },
  {
    title: "Your choices",
    items: [
      "You can opt out of optional cookies through your browser settings. Core functionality will still work.",
      "Contact us any time to request deletion of prior submissions. Provide the email address you used so we can locate the entry.",
      "For DMCA or parental removal requests, include authoritative proof of ownership so we can comply quickly."
    ]
  },
  {
    title: "Policy updates",
    description:
      "We may update this document when laws, tooling, or product features change. The revision date below will always note the most recent update.",
    items: []
  }
];

const lastUpdated = "Last updated: 11 November 2025";

export default async function PrivacyPolicyPage() {
  const site = await getSiteConfig();

  return (
    <>
      <Header brand={site.brand} navLinks={site.navLinks} searchPlaceholder={site.searchPlaceholder} />
      <main className="pb-16 pt-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 lg:px-8">
          <section className="card space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Privacy Policy</p>
            <h1 className="text-3xl font-black">Your data stays in your control</h1>
            <p className="text-lg text-white/80">
              This policy explains what information we collect when you browse {site.brand}, why we collect it, and how
              you can reach us with questions. Our goal is to store only what’s required to keep the experience fast and
              fair.
            </p>
            <p className="text-sm text-white/50">{lastUpdated}</p>
          </section>

          {sections.map((section) => (
            <section key={section.title} className="card space-y-4">
              <h2 className="text-2xl font-bold">{section.title}</h2>
              {section.description && <p className="text-sm text-white/70">{section.description}</p>}
              {section.items.length > 0 && (
                <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="card space-y-4">
            <h2 className="text-2xl font-bold">Questions?</h2>
            <p className="text-white/80">
              Email{" "}
              <a href="mailto:support@stealabrainrot.quest" className="text-accent underline-offset-4 hover:underline">
                support@stealabrainrot.quest
              </a>{" "}
              and we’ll follow up within a few business days. Please include &ldquo;Privacy Request&rdquo; in the
              subject line so we can route it immediately.
            </p>
          </section>
        </div>
      </main>
      <Footer site={site} />
    </>
  );
}
