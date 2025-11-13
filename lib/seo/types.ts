export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export interface GameMetadata {
  title: string;
  description: string;
  keywords: string[];
  category?: string;
  tags?: string[];
  thumbnail?: string;
  author?: string;
  publishDate?: string;
  lastUpdated?: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    url?: string;
    siteName?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  jsonLd?: any[];
}