import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { getHomepageData } from "@/lib/homepage/getHomepageData";
import { ComingSoonHero } from "@/components/coming-soon/Hero";

interface ComingSoonPageProps {
  searchParams: {
    title?: string;
    tagline?: string;
    image?: string;
  };
}

export default async function ComingSoonPage({ searchParams }: ComingSoonPageProps) {
  const data = await getHomepageData();
  const heroProps = {
    title: decodeURIComponent(searchParams.title ?? "New Brainrot Adventure"),
    tagline: decodeURIComponent(searchParams.tagline ?? "We're still polishing this experience."),
    image: searchParams.image ? decodeURIComponent(searchParams.image) : undefined
  };

  return (
    <>
      <Header brand={data.site.brand} navLinks={data.site.navLinks} searchPlaceholder={data.site.searchPlaceholder} />
      <main className="mx-auto flex min-h-[70vh] max-w-4xl flex-col gap-8 px-6 py-12 lg:px-8">
        <ComingSoonHero {...heroProps} />
      </main>
      <Footer site={data.site} />
    </>
  );
}
