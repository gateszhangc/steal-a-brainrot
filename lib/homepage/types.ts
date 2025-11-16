export interface HeroData {
  embedUrl: string;
  rating: number;
  ratingLabel: string;
  votes: number;
  title?: string;
  cta?: string;
  ctaUrl?: string;
  thumbnail?: string;
  backgroundImage?: string;
}

export interface GameStats {
  rating: string;
  plays: string;
  developer: string;
  releaseDate: string;
  technology: string;
  categories: string[];
}

export interface RecommendedGame {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tagline: string;
  image?: string;
  comingSoon?: boolean;
}

export interface TocItem {
  id: string;
  label: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQData {
  items: FAQItem[];
  cta: {
    title: string;
    body: string;
  };
}

export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  brand: string;
  domain: string;
  searchPlaceholder: string;
  navLinks: SiteLink[];
  footerLinks: SiteLink[];
  disclaimer: string;
  copyright: string;
}

export interface HomepageData {
  hero: HeroData;
  stats: GameStats;
  recommended: RecommendedGame[];
  faq: FAQData;
  site: SiteConfig;
  content: string;
  toc: TocItem[];
}
