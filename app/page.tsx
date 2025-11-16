import { Header } from "@/components/header/Header";
import { GamePlayer } from "@/components/game/GamePlayer";
import { RecommendedRail } from "@/components/recommended/RecommendedRail";
import { GameInfoGrid } from "@/components/game/GameInfoGrid";
import { ContentSection } from "@/components/content/ContentSection";
import { CommentsSection } from "@/components/comments/CommentsSection";
import { Footer } from "@/components/footer/Footer";
import { getHomepageData } from "@/lib/homepage/getHomepageData";

export default async function HomePage() {
  const data = await getHomepageData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: data.site.brand,
        url: data.site.domain,
        description:
          "Play Steal A Brainrot online with zero downloads. Build your base, steal rare Brainrots, and enjoy the chaotic Roblox-style heist gameplay.",
        potentialAction: {
          "@type": "SearchAction",
          target: `${data.site.domain}/search?q={query}`,
          "query-input": "required name=query"
        }
      },
      {
        "@type": "VideoGame",
        name: "Steal A Brainrot",
        applicationCategory: "Game",
        author: {
          "@type": "Organization",
          name: data.stats.developer
        },
        datePublished: data.stats.releaseDate,
        operatingSystem: "Web",
        url: data.site.domain,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: data.hero.rating,
          ratingCount: data.hero.votes
        },
        genre: data.stats.categories
      },
      {
        "@type": "FAQPage",
        mainEntity: data.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      <Header brand={data.site.brand} navLinks={data.site.navLinks} searchPlaceholder={data.site.searchPlaceholder} />
      <main className="pb-16 pt-8">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 lg:px-8">
          <GamePlayer hero={data.hero} scrollTargetId="comments-section" />
          <RecommendedRail games={data.recommended} />
          <GameInfoGrid stats={data.stats} />
          <ContentSection content={data.content} toc={data.toc} faq={data.faq} />
          <CommentsSection />
        </div>
      </main>
      <Footer site={data.site} />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
