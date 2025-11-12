import { SEOConfig, PageKeywords, FAQItem } from './types';
import seoData from '../../../seo/keywords.json';

class SEOConfigManager {
  private config: SEOConfig;
  private pages: Record<string, PageKeywords>;
  private faqs: FAQItem[];

  constructor() {
    // Type assertion for the imported JSON data
    const data = seoData as any;

    this.config = {
      siteName: data.config?.siteName || 'Steal a Brainrot',
      siteUrl: data.config?.siteUrl || 'https://www.stealabrainrot.quest',
      defaultTitle: data.config?.defaultTitle || 'Steal a Brainrot - Play Free Online',
      defaultDescription: data.config?.defaultDescription || 'Play Steal a Brainrot online for free!',
      defaultOGImage: data.config?.defaultOGImage || '/og-image.png',
      twitterHandle: data.config?.twitterHandle,
      locale: data.config?.locale || 'en_US',
      keywords: {
        primary: data.keywords?.primary || [],
        secondary: data.keywords?.secondary || []
      }
    };

    this.pages = data.pages || {};
    this.faqs = data.faqs || [];
  }

  getSEOConfig(): SEOConfig {
    return this.config;
  }

  getPageKeywords(pagePath: string): PageKeywords | null {
    // Exact match first
    if (this.pages[pagePath]) {
      return this.pages[pagePath];
    }

    // Try to find a partial match for dynamic routes
    for (const [path, keywords] of Object.entries(this.pages)) {
      if (pagePath.includes(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
        return keywords;
      }
    }

    // Return default keywords for homepage if no match found
    if (pagePath === '/' || pagePath === '') {
      return {
        path: '/',
        primaryKeyword: {
          keyword: 'steal a brainrot',
          searchVolume: 1000,
          keywordDifficulty: 30,
          cpc: 0.5,
          intent: 'informational',
          isQuestion: false
        },
        secondaryKeywords: [
          {
            keyword: 'brainrot game',
            searchVolume: 500,
            keywordDifficulty: 25,
            cpc: 0.3,
            intent: 'informational',
            isQuestion: false
          }
        ],
        relatedQuestions: []
      };
    }

    return null;
  }

  getFAQData(category?: string): FAQItem[] {
    if (category) {
      return this.faqs.filter(faq => faq.category === category);
    }
    return this.faqs;
  }

  getAllPages(): Record<string, PageKeywords> {
    return this.pages;
  }

  addPageKeywords(pagePath: string, keywords: PageKeywords): void {
    this.pages[pagePath] = keywords;
  }

  addFAQ(faq: FAQItem): void {
    this.faqs.push(faq);
  }
}

// Export singleton instance
export const seoConfig = new SEOConfigManager();
export default seoConfig;