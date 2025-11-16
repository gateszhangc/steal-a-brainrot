import type { FAQData } from "@/lib/homepage/types";

interface FAQListProps {
  faq: FAQData;
}

export function FAQList({ faq }: FAQListProps) {
  return (
    <div id="faq" className="mt-12 space-y-8">
      <h2 className="text-2xl font-semibold">FAQs</h2>
      <div className="space-y-6">
        {faq.items.map((item) => (
          <article key={item.question} className="rounded-2xl border border-white/10 bg-surface/60 p-6">
            <h3 className="text-xl font-semibold">{item.question}</h3>
            <p className="mt-2 text-white/80">{item.answer}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 rounded-2xl border border-accent/30 bg-accent/10 p-6">
        <h2 className="text-2xl font-bold text-accent">{faq.cta.title}</h2>
        <p className="mt-3 text-white/80">{faq.cta.body}</p>
      </div>
    </div>
  );
}
