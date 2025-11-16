import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { getSiteConfig } from "@/lib/site/getSiteConfig";

export const metadata = {
  title: "Copyright - Steal Brainrot",
  description:
    "File DMCA or copyright notices with the Steal Brainrot fan team. Learn what to include so we can act quickly."
};

const requirements = [
  "A signature (physical or electronic) from the copyright owner or an authorized representative.",
  "A clear description of the work you believe was infringed, including reference links when available.",
  "The exact URL(s) on stealabrainrot.quest that contain the allegedly infringing material.",
  "Your preferred contact details: full name, organization, mailing address, phone number, and email.",
  "A statement that you have a good-faith belief the disputed use is not authorized by the owner or the law.",
  "A statement, under penalty of perjury, that the information you submit is accurate and that you are authorized to act."
];

const process = [
  {
    title: "Submit documentation",
    body: "Send your full notice to support@stealabrainrot.quest with the subject “DMCA Notice”. Attach any supporting files or proof of ownership."
  },
  {
    title: "We verify and respond",
    body: "Our small team reviews every notice manually. If the request is complete, we will acknowledge it within one business day."
  },
  {
    title: "Content removal or follow-up",
    body: "We temporarily disable access to the cited material while we investigate. If needed, we’ll reach out for more context or provide the uploader an opportunity to respond."
  }
];

const counterNoticeSteps = [
  "A statement consenting to the jurisdiction of the federal court in your region (or Atlanta, GA if outside the United States).",
  "A statement, under penalty of perjury, that you believe the flagged material was removed due to mistake or misidentification.",
  "Your contact details so we can share the notice with the original complainant."
];

export default async function CopyrightPage() {
  const site = await getSiteConfig();

  return (
    <>
      <Header brand={site.brand} navLinks={site.navLinks} searchPlaceholder={site.searchPlaceholder} />
      <main className="pb-16 pt-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 lg:px-8">
          <section className="card space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Copyright & DMCA</p>
            <h1 className="text-3xl font-black">Protecting creators is part of the mission</h1>
            <p className="text-lg text-white/80">
              {site.brand} respects intellectual property. Follow the checklist below when sending a notice so we can
              remove infringing material quickly and accurately.
            </p>
          </section>

          <section className="card space-y-4">
            <h2 className="text-2xl font-bold">What to include in your notice</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
              {requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="card space-y-6">
            <h2 className="text-2xl font-bold">How the process works</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {process.map((step) => (
                <article key={step.title} className="rounded-2xl border border-white/5 bg-surface/60 p-5">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{step.body}</p>
                </article>
              ))}
            </div>
            <p className="text-xs text-white/50">
              Send notices to{" "}
              <a href="mailto:support@stealabrainrot.quest" className="text-accent underline-offset-4 hover:underline">
                support@stealabrainrot.quest
              </a>{" "}
              — incomplete notices delay the timeline.
            </p>
          </section>

          <section className="card space-y-4">
            <h2 className="text-2xl font-bold">Counter notices</h2>
            <p className="text-sm text-white/70">
              If you believe your content was removed in error, send a counter notice containing the following:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
              {counterNoticeSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-xs text-white/50">
              After we receive a valid counter notice we will restore the material within 10 business days unless the
              original complainant informs us they filed an action seeking a court order to keep it down.
            </p>
          </section>
        </div>
      </main>
      <Footer site={site} />
    </>
  );
}
