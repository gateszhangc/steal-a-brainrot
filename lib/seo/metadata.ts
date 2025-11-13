import { Metadata } from 'next';
import { PageKeywords, MetadataConfig, SEOConfig } from './types';
import { seoConfig } from './config';

export class MetadataGenerator {
  private seoConfig: SEOConfig;

  constructor() {
    this.seoConfig = seoConfig.getSEOConfig();
  }

  generateMetadata(config: {
    pagePath: string;
    gameTitle?: string;
    pageKeywords?: PageKeywords;
    baseUrl?: string;
  }): Metadata {
    const { pagePath, gameTitle, pageKeywords, baseUrl = this.seoConfig.siteUrl } = config;

    // Get page keywords or use defaults
    const keywords = pageKeywords || this.getDefaultPageKeywords(pagePath, gameTitle);

    // Generate title and description
    const { title, description } = this.generateTitleAndDescription(keywords, gameTitle);

    // Generate Open Graph data
    const openGraph = this.generateOpenGraph(title, description, pagePath, baseUrl);

    // Generate Twitter data
    const twitter = this.generateTwitter(title, description);

    // Generate keywords string
    const keywordsString = this.generateKeywordsString(keywords);

    return {
      title,
      description,
      keywords: keywordsString,
      authors: [{ name: this.seoConfig.siteName }],
      creator: this.seoConfig.siteName,
      publisher: this.seoConfig.siteName,
      openGraph,
      twitter,
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: `${baseUrl}${pagePath}`,
      },
    };
  }

  generateHomeMetadata(): Metadata {
    const homeKeywords = seoConfig.getPageKeywords('/');
    const config = this.seoConfig;

    const title = config.defaultTitle;
    const description = config.defaultDescription;

    const openGraph = {
      type: 'website' as const,
      title,
      description,
      url: config.siteUrl,
      siteName: config.siteName,
      images: [
        {
          url: `${config.siteUrl}${config.defaultOGImage}`,
          width: 1200,
          height: 630,
          alt: `${config.siteName} - Play Free Online Games`,
        },
      ],
      locale: config.locale,
    };

    const twitter = {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [`${config.siteUrl}${config.defaultOGImage}`],
      creator: config.twitterHandle,
    };

    return {
      title,
      description,
      keywords: config.keywords.primary.concat(config.keywords.secondary).join(', '),
      authors: [{ name: config.siteName }],
      creator: config.siteName,
      publisher: config.siteName,
      openGraph,
      twitter,
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: config.siteUrl,
      },
    };
  }

  generateGameMetadata(gameTitle: string, gameSlug: string): Metadata {
    const pagePath = `/${gameSlug}`;
    const pageKeywords = seoConfig.getPageKeywords(pagePath);

    return this.generateMetadata({
      pagePath,
      gameTitle,
      pageKeywords,
    });
  }

  private getDefaultPageKeywords(pagePath: string, gameTitle?: string): PageKeywords {
    // Try to get keywords from config first
    const configKeywords = seoConfig.getPageKeywords(pagePath);
    if (configKeywords) {
      return configKeywords;
    }

    // Generate default keywords based on page path and game title
    const primaryKeyword = {
      keyword: gameTitle ? `${gameTitle.toLowerCase()} game` : 'brainrot game',
      searchVolume: 100,
      keywordDifficulty: 30,
      cpc: 0.5,
      intent: 'transactional' as const,
      isQuestion: false,
    };

    const secondaryKeywords = [
      {
        keyword: 'play online',
        searchVolume: 50,
        keywordDifficulty: 25,
        cpc: 0.3,
        intent: 'transactional' as const,
        isQuestion: false,
      },
      {
        keyword: 'free game',
        searchVolume: 200,
        keywordDifficulty: 20,
        cpc: 0.4,
        intent: 'transactional' as const,
        isQuestion: false,
      },
    ];

    return {
      path: pagePath,
      primaryKeyword,
      secondaryKeywords,
      relatedQuestions: [],
    };
  }

  private generateTitleAndDescription(keywords: PageKeywords, gameTitle?: string): { title: string; description: string } {
    const { primaryKeyword, secondaryKeywords } = keywords;

    // Generate title (50-60 characters)
    let title: string;
    if (keywords.title) {
      title = this.optimizeTitle(keywords.title, 60);
    } else {
      const gameName = gameTitle || this.capitalizeFirst(primaryKeyword.keyword);
      title = `${gameName} - Play Free Online | ${this.seoConfig.siteName}`;
      title = this.optimizeTitle(title, 60);
    }

    // Generate description (150-160 characters)
    let description: string;
    if (keywords.description) {
      description = this.optimizeDescription(keywords.description, 160);
    } else {
      const actionVerbs = ['Play', 'Enjoy', 'Experience', 'Try', 'Discover'];
      const action = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];

      description = `${action} ${primaryKeyword.keyword} online for free! ${
        secondaryKeywords.length > 0
          ? `Enjoy ${secondaryKeywords[0].keyword} and other exciting games.`
          : 'The ultimate gaming experience.'
      } No downloads required - instant fun in your browser!`;

      description = this.optimizeDescription(description, 160);
    }

    return { title, description };
  }

  private generateOpenGraph(title: string, description: string, pagePath: string, baseUrl: string) {
    const config = this.seoConfig;

    return {
      type: pagePath === '/' ? 'website' as const : 'article' as const,
      title,
      description,
      url: `${baseUrl}${pagePath}`,
      siteName: config.siteName,
      images: [
        {
          url: `${baseUrl}${config.defaultOGImage}`,
          width: 1200,
          height: 630,
          alt: `${title} - ${config.siteName}`,
        },
      ],
      locale: config.locale,
    };
  }

  private generateTwitter(title: string, description: string) {
    const config = this.seoConfig;

    return {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [`${config.siteUrl}${config.defaultOGImage}`],
      creator: config.twitterHandle,
    };
  }

  private generateKeywordsString(keywords: PageKeywords): string {
    const allKeywords = [
      keywords.primaryKeyword.keyword,
      ...keywords.secondaryKeywords.map(k => k.keyword),
      ...this.seoConfig.keywords.primary.slice(0, 3), // Add some site-wide primary keywords
    ];

    // Remove duplicates and limit to 10 keywords
    return [...new Set(allKeywords)]
      .slice(0, 10)
      .join(', ');
  }

  private optimizeTitle(title: string, maxLength: number = 60): string {
    if (title.length <= maxLength) {
      return title;
    }

    // Try to cut at word boundaries
    const words = title.split(' ');
    let optimized = '';

    for (const word of words) {
      if ((optimized + ' ' + word).length > maxLength - 3) {
        break;
      }
      optimized += (optimized ? ' ' : '') + word;
    }

    return optimized + '...';
  }

  private optimizeDescription(description: string, maxLength: number = 160): string {
    if (description.length <= maxLength) {
      return description;
    }

    // Try to cut at sentence boundaries first, then word boundaries
    const sentences = description.split(/[.!?]/);
    let optimized = '';

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      const testLength = optimized + (optimized ? '. ' : '') + trimmed;
      if (testLength > maxLength - 3) {
        break;
      }
      optimized = testLength;
    }

    if (optimized.length > 0) {
      return optimized + '.';
    }

    // Fallback to word-based optimization
    const words = description.split(' ');
    optimized = '';

    for (const word of words) {
      if ((optimized + ' ' + word).length > maxLength - 3) {
        break;
      }
      optimized += (optimized ? ' ' : '') + word;
    }

    return optimized + '...';
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Utility method to generate metadata for static pages
  generateStaticPageMetadata(pageType: 'about' | 'contact' | 'privacy' | 'terms'): Metadata {
    const baseUrl = this.seoConfig.siteUrl;
    const siteName = this.seoConfig.siteName;

    const pageConfig = {
      about: {
        title: `About ${siteName} - Free Online Games`,
        description: `Learn more about ${siteName}, your destination for free online brainrot games. Discover our mission and the games we offer.`,
        path: '/about'
      },
      contact: {
        title: `Contact ${siteName} - Get in Touch`,
        description: `Contact ${siteName} for support, feedback, or inquiries. We're here to help with your online gaming experience.`,
        path: '/contact'
      },
      privacy: {
        title: `Privacy Policy - ${siteName}`,
        description: `Read ${siteName}'s privacy policy to understand how we protect your data while you enjoy free online games.`,
        path: '/privacy'
      },
      terms: {
        title: `Terms of Service - ${siteName}`,
        description: `Review ${siteName}'s terms of service to understand the rules and guidelines for using our free online gaming platform.`,
        path: '/terms'
      }
    };

    const config = pageConfig[pageType];

    return {
      title: config.title,
      description: config.description,
      openGraph: {
        type: 'website',
        title: config.title,
        description: config.description,
        url: `${baseUrl}${config.path}`,
        siteName,
        images: [
          {
            url: `${baseUrl}${this.seoConfig.defaultOGImage}`,
            width: 1200,
            height: 630,
            alt: config.title,
          },
        ],
        locale: this.seoConfig.locale,
      },
      twitter: {
        card: 'summary_large_image',
        title: config.title,
        description: config.description,
        images: [`${baseUrl}${this.seoConfig.defaultOGImage}`],
      },
      robots: {
        index: pageType !== 'privacy' && pageType !== 'terms',
        follow: true,
      },
      alternates: {
        canonical: `${baseUrl}${config.path}`,
      },
    };
  }
}

// Export singleton instance
export const metadataGenerator = new MetadataGenerator();
export default metadataGenerator;