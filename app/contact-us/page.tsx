import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSiteConfig } from "@/lib/site/getSiteConfig";

const contactEmail = "support@stealabrainrot.quest";

export const metadata = {
  title: "Contact Us - Steal Brainrot",
  description:
    "Need help with a Steal A Brainrot build, a DMCA request, or a partnership idea? Reach the Steal Brainrot team directly.",
  keywords: "contact Steal Brainrot, support, DMCA"
};

const channels = [
  {
    title: "General support",
    body: "Report bugs, playback issues, or incorrect stats. Screenshots and device info help us troubleshoot faster.",
    response: "Replies within one business day"
  },
  {
    title: "Partnerships & licensing",
    body: "We love working with creators and dev teams who expand the Brainrot universe. Pitch events, showcase slots, or custom builds.",
    response: "Replies within three business days"
  },
  {
    title: "Copyright or safety alerts",
    body: "Send urgent DMCA takedowns or security concerns. We monitor this inbox continuously and pause content when needed.",
    response: "Same-day acknowledgement"
  }
];

const checklist = [
  "Tell us which game page, platform, or browser you were using.",
  "Attach a short clip or image if you’re reporting a gameplay issue.",
  "Include proof of ownership or authorization for copyright notices.",
  "Let us know the best way to reach you back (email, Discord, Roblox username)."
];

export default async function ContactUsPage() {
  const site = await getSiteConfig();

  return (
    <>
      <Header brand={site.brand} navLinks={site.navLinks} searchPlaceholder={site.searchPlaceholder} />
      <main className="pb-16 pt-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 lg:px-8">
          <section className="card space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Talk to the team</p>
            <h1 className="text-3xl font-black">We read every message</h1>
            <p className="text-lg text-white/80">
              Drop us a note through the form below or email{" "}
              <a href={`mailto:${contactEmail}`} className="text-accent underline-offset-4 hover:underline">
                {contactEmail}
              </a>
              . We’re Roblox fans first, so we treat your reports with the same urgency we’d expect for our own bases.
            </p>
          </section>

          <section className="card space-y-6">
            <h2 className="text-2xl font-bold">How we route messages</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {channels.map((channel) => (
                <article key={channel.title} className="rounded-2xl border border-white/5 bg-surface/60 p-5">
                  <h3 className="text-lg font-semibold">{channel.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{channel.body}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/40">{channel.response}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="card space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Send a message</h2>
              <p className="mt-2 text-white/70">
                Fill out the form and we’ll route it to the right person. No bots, no ticket loops—just real humans.
              </p>
            </div>
            <ContactForm />
          </section>

          <section className="card space-y-4">
            <h2 className="text-2xl font-bold">Tips for a faster response</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
              {checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer site={site} />
    </>
  );
}
