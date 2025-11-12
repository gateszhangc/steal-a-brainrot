import { VideoGameSchema, FAQPageSchema, WebSiteSchema, FAQItem } from './types';
import { seoConfig } from './config';

export class SchemaGenerator {
  private seoConfig = seoConfig.getSEOConfig();

  generateVideoGameSchema(game: {
    name: string;
    description: string;
    genre?: string[];
    url: string;
    rating?: { value: number; count: number };
    gamePlatform?: string[];
    datePublished?: string;
  }): VideoGameSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: game.name,
      description: game.description,
      genre: game.genre || ['Action', 'Multiplayer', 'Browser Game'],
      gamePlatform: game.gamePlatform || ['Web Browser', 'PC'],
      url: `${this.seoConfig.siteUrl}${game.url}`,
      datePublished: game.datePublished || new Date().toISOString().split('T')[0],
      ...(game.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: game.rating.value,
          ratingCount: game.rating.count,
        },
      }),
    };
  }

  generateWebSiteSchema(): WebSiteSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.seoConfig.siteName,
      url: this.seoConfig.siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.seoConfig.siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  generateFAQSchema(faqs: FAQItem[]): FAQPageSchema {
    const mainEntity = faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity,
    };
  }

  generateOrganizationSchema(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.seoConfig.siteName,
      url: this.seoConfig.siteUrl,
      description: `${this.seoConfig.siteName} - Free online brainrot games and multiplayer gaming experiences`,
      logo: {
        '@type': 'ImageObject',
        url: `${this.seoConfig.siteUrl}/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: [
        // Add social media URLs if available
      ],
    };
  }

  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): any {
    const itemListElement = breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    };
  }

  generateWebPageSchema(page: {
    name: string;
    description: string;
    url: string;
    lastReviewed?: string;
    reviewedBy?: string;
  }): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.name,
      description: page.description,
      url: `${this.seoConfig.siteUrl}${page.url}`,
      ...(page.lastReviewed && {
        lastReviewed: page.lastReviewed,
      }),
      ...(page.reviewedBy && {
        reviewedBy: {
          '@type': 'Organization',
          name: page.reviewedBy,
        },
      }),
    };
  }

  generateGameListSchema(games: Array<{
    name: string;
    description: string;
    url: string;
    image?: string;
    rating?: { value: number; count: number };
  }>): any {
    const itemListElement = games.map((game, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Game',
        name: game.name,
        description: game.description,
        url: `${this.seoConfig.siteUrl}${game.url}`,
        ...(game.image && {
          image: {
            '@type': 'ImageObject',
            url: `${this.seoConfig.siteUrl}${game.image}`,
          },
        }),
        ...(game.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: game.rating.value,
            ratingCount: game.rating.count,
          },
        }),
      },
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Brainrot Games Collection',
      description: 'Collection of free online brainrot games available on our platform',
      itemListElement,
    };
  }

  // Generate schema for game categories
  generateCollectionPageSchema(category: {
    name: string;
    description: string;
    url: string;
    games: Array<{ name: string; url: string }>;
  }): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.name} Games`,
      description: category.description,
      url: `${this.seoConfig.siteUrl}${category.url}`,
      mainEntity: {
        '@type': 'ItemList',
        name: `${category.name} Games`,
        description: category.description,
        numberOfItems: category.games.length,
        itemListElement: category.games.map((game, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Game',
            name: game.name,
            url: `${this.seoConfig.siteUrl}${game.url}`,
          },
        })),
      },
    };
  }

  // Generate schema for how-to guides and tutorials
  generateHowToSchema(howTo: {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string; image?: string }>;
    image?: string;
    totalTime?: string;
  }): any {
    const stepList = howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: `${this.seoConfig.siteUrl}${step.image}`,
        },
      }),
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: howTo.name,
      description: howTo.description,
      image: howTo.image ? `${this.seoConfig.siteUrl}${howTo.image}` : undefined,
      ...(howTo.totalTime && {
        totalTime: howTo.totalTime,
      }),
      step: stepList,
    };
  }

  // Utility function to convert schema to JSON-LD string
  schemaToJSONLD(schema: any): string {
    return JSON.stringify(schema, null, 2);
  }

  // Generate multiple schemas for a page
  generatePageSchemas(pageType: 'home' | 'game' | 'category' | 'faq' | 'about', data?: any): any[] {
    const schemas: any[] = [];

    // Always include WebSite schema
    schemas.push(this.generateWebSiteSchema());

    // Always include Organization schema
    schemas.push(this.generateOrganizationSchema());

    switch (pageType) {
      case 'home':
        schemas.push(
          this.generateWebPageSchema({
            name: this.seoConfig.siteName,
            description: this.seoConfig.defaultDescription,
            url: '/',
            lastReviewed: new Date().toISOString().split('T')[0],
          })
        );

        // Add game list if data is provided
        if (data?.games?.length > 0) {
          schemas.push(this.generateGameListSchema(data.games));
        }
        break;

      case 'game':
        if (data) {
          schemas.push(this.generateVideoGameSchema(data));

          // Add breadcrumb if provided
          if (data.breadcrumbs) {
            schemas.push(this.generateBreadcrumbSchema(data.breadcrumbs));
          }
        }
        break;

      case 'category':
        if (data) {
          schemas.push(this.generateCollectionPageSchema(data));

          // Add breadcrumb
          schemas.push(
            this.generateBreadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: data.name, url: data.url },
            ])
          );
        }
        break;

      case 'faq':
        if (data?.faqs?.length > 0) {
          schemas.push(this.generateFAQSchema(data.faqs));

          // Add breadcrumb
          schemas.push(
            this.generateBreadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'FAQ', url: '/faq' },
            ])
          );
        }
        break;

      case 'about':
        schemas.push(
          this.generateWebPageSchema({
            name: `About ${this.seoConfig.siteName}`,
            description: `Learn more about ${this.seoConfig.siteName} and our mission to provide free online brainrot games.`,
            url: '/about',
          })
        );

        // Add breadcrumb
        schemas.push(
          this.generateBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'About', url: '/about' },
          ])
        );
        break;
    }

    return schemas;
  }
}

// Export singleton instance
export const schemaGenerator = new SchemaGenerator();
export default schemaGenerator;