import Link from "next/link";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { getSiteConfig } from "@/lib/site/getSiteConfig";

export const metadata = {
  title: "About Us - Steal Brainrot",
  description:
    "Learn how the Steal Brainrot fan site curates instant-play builds, strategy guides, and trustworthy updates for the Roblox-inspired experience."
};

const highlights = [
  {
    title: "Instant-play curation",
    description:
      "We constantly test the latest Steal A Brainrot builds to ensure the version you launch from this site loads fast, runs smoothly, and keeps the heist fantasy intact."
  },
  {
    title: "Playable knowledge base",
    description:
      "Every guide focuses on practical tactics players actually use: how to balance your base upgrades, which Brainrot creatures to steal first, and when to go risk-on."
  },
  {
    title: "Community-first updates",
    description:
      "Patch roundups, security reminders, and feature explainers are written by the same people who grind the game nightly, so you always know what truly changed."
  }
];

const values = [
  {
    title: "Built by players",
    body:
      "We treat this site as a living changelog for the Roblox community. Each article and recommendation is vetted by someone who actively plays the game mode."
  },
  {
    title: "Transparent sourcing",
    body:
      "Every stat and recommendation lists where it came from—a dev stream, a verified leak, or hard-earned testing—so you can double-check our work."
  },
  {
    title: "Player safety first",
    body:
      "We mirror only safe, no-download experiences, and we remove anything that sneaks trackers or suspicious ads into the iframe."
  }
];

export default async function AboutUsPage() {
  const site = await getSiteConfig();

  return (
    <>
      <Header brand={site.brand} navLinks={site.navLinks} searchPlaceholder={site.searchPlaceholder} />
      <main className="pb-16 pt-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 lg:px-8">
          <section className="card space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">About {site.brand}</p>
            <h1 className="text-3xl font-black leading-tight md:text-4xl">Players keeping the Brainrot chaos online</h1>
            <p className="text-lg text-white/80">
              {site.brand} is an independent fan effort dedicated to keeping the Steal A Brainrot experience playable in
              the browser. We obsess over performance, publish unbiased strategy notes, and collect the community’s best
              finds so you can jump straight into the action.
            </p>
          </section>

          <section className="card space-y-6">
            <h2 className="text-2xl font-bold">What we focus on</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {highlights.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/5 bg-surface/40 p-4 shadow-inner">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="card space-y-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">How we operate</p>
              <h2 className="text-2xl font-bold">Values that guide every update</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {values.map((value) => (
                <article key={value.title} className="rounded-2xl border border-white/5 bg-panel/60 p-5">
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{value.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="card space-y-4">
            <h2 className="text-2xl font-bold">Want to help?</h2>
            <p className="text-white/80">
              If you spot a broken build, notice outdated information, or want to collaborate on a guide,{" "}
              <Link href="/contact-us" className="text-accent underline-offset-4 hover:underline">
                send us a note
              </Link>
              . Every submission keeps the info loop fresh for the whole community.
            </p>
          </section>
        </div>
      </main>
      <Footer site={site} />
    </>
  );
}
