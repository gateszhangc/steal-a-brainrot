"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ComingSoonHeroProps {
  title: string;
  tagline: string;
  image?: string;
}

export function ComingSoonHero({ title, tagline, image }: ComingSoonHeroProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      setMessage("Please share an email so we can let you know.");
      return;
    }
    try {
      setSubmitting(true);
      setMessage("Thanks! We'll notify you as soon as the game is live.");
      await new Promise((resolve) => setTimeout(resolve, 1200));
      router.push("/");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-panel p-6 text-white shadow-lg">
      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-black/30 p-6">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={title} className="h-48 w-48 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-night text-4xl">🎮</div>
          )}
          <p className="mt-4 text-xs uppercase tracking-[0.4em] text-white/60">In Production</p>
          <h1 className="mt-2 text-3xl font-black">{title}</h1>
          <p className="mt-1 text-center text-white/60">{tagline}</p>
        </div>
        <div className="flex flex-col justify-center gap-6">
          <div>
            <h2 className="text-2xl font-semibold">We're polishing the experience ✨</h2>
            <p className="mt-3 text-white/70">
              This adventure isn't playable just yet. Leave your email below if you'd like a heads-up the second it goes
              live. In the meantime, feel free to explore the rest of our Brainrot collection!
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-semibold uppercase tracking-widest text-white/60">Notify me</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 flex-1 rounded-lg border border-white/10 bg-night px-4 text-sm focus:border-accent focus:outline-none"
                required
              />
              <button
                type="submit"
                className="control-button h-12 rounded-full px-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Notify Me"}
              </button>
            </div>
            {message && <p className="text-sm text-accent">{message}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
