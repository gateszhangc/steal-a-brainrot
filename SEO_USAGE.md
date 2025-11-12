# SEO Optimization System Usage Guide

## Overview

This document explains how to use the comprehensive SEO optimization system implemented for Steal a Brainrot website. The system includes automated keyword analysis, metadata generation, schema markup, FAQ content, sitemap generation, and SEO auditing tools.

## Quick Start

### 1. Initial Setup

```bash
# Install dependencies (if not already done)
npm install

# Parse SEMrush data and generate initial SEO configuration
npm run seo:parse

# Generate sitemap
npm run seo:sitemap

# Run SEO audit to check implementation
npm run seo:audit

# Run all SEO tasks at once
npm run seo:all
```

### 2. Key Files and Directories

```
seo/
├── keywords.json              # Main SEO configuration file
├── *.xlsx                    # SEMrush keyword data files

lib/seo/
├── types.ts                  # TypeScript type definitions
├── config.ts                 # SEO configuration manager
├── keywords.ts               # Keyword processing utilities
├── metadata.ts               # Metadata generation system
├── schema.ts                 # Schema markup generator
└── sitemap.ts                # Sitemap generation tools

components/seo/
├── FAQ.tsx                   # FAQ React component
└── SchemaMarkup.tsx          # Schema markup component

scripts/
├── parseSEMrush.js           # SEMrush data parser
├── generateSitemap.js        # Sitemap generator
└── seoAudit.js               # SEO audit tool
```

## Core Components

### 1. SEMrush Data Parser (`scripts/parseSEMrush.js`)

**Purpose**: Process SEMrush Excel files to extract and categorize keywords for SEO optimization.

**Usage**:
```bash
npm run seo:parse
```

**What it does**:
- Reads Excel files from `seo/` directory
- Extracts keywords, search volume, difficulty, CPC data
- Identifies question-type keywords for FAQ generation
- Categorizes keywords (games, unblocked, mobile, etc.)
- Generates page mappings with primary/secondary keywords
- Creates FAQ content based on common questions
- Updates `seo/keywords.json` with processed data

**Input files**: SEMrush Excel exports in `seo/` directory
- `steal-a-brainrot_broad-match_us_2025-11-11.xlsx`
- `steal-a-brainrot_broad-match_us_2025-11-11-quest.xlsx`

**Output**: Updated `seo/keywords.json` with:
- Site configuration
- Keyword mappings by page
- FAQ items and answers
- Processing metadata

### 2. Metadata Generator (`lib/seo/metadata.ts`)

**Purpose**: Automatically generate optimized meta tags for all pages.

**Usage**: Integrated into Next.js layouts and pages.

**Features**:
- Dynamic title optimization (50-60 characters)
- Meta description optimization (150-160 characters)
- Open Graph and Twitter Card tags
- Canonical URL generation
- Keyword integration

**Example Usage**:
```typescript
import { metadataGenerator } from '../lib/seo/metadata';

export const metadata = metadataGenerator.generateHomeMetadata();

// For game pages
export const metadata = metadataGenerator.generateGameMetadata(
  'Game Title',
  'game-slug'
);
```

### 3. Schema Markup Generator (`lib/seo/schema.ts`)

**Purpose**: Generate JSON-LD structured data for enhanced search results.

**Available Schema Types**:
- VideoGame (for game pages)
- FAQPage (for FAQ sections)
- WebSite (for homepage)
- Organization (for site info)
- BreadcrumbList (for navigation)
- WebPage (for general pages)

**Usage**:
```typescript
import { SchemaMarkup, usePageSchemas } from '../components/seo/SchemaMarkup';

export default function GamePage({ game }) {
  const schemas = usePageSchemas('game', { game });

  return (
    <>
      <SchemaMarkup schemas={schemas} />
      {/* Page content */}
    </>
  );
}
```

### 4. FAQ Component (`components/seo/FAQ.tsx`)

**Purpose**: Display FAQ sections with expandable questions and automatic schema markup.

**Features**:
- Accordion-style expand/collapse
- Responsive design
- Automatic FAQPage schema generation
- Keyboard navigation support
- Category organization

**Usage**:
```typescript
import { FAQ } from '../components/seo/FAQ';
import { seoConfig } from '../lib/seo/config';

export default function HomePage() {
  const faqs = seoConfig.getFAQData();

  return (
    <FAQ
      items={faqs}
      title="Frequently Asked Questions"
      maxItems={5}
      className="my-8"
    />
  );
}
```

### 5. Sitemap Generator (`scripts/generateSitemap.js`)

**Purpose**: Automatically generate XML sitemaps for all site pages.

**Usage**:
```bash
npm run seo:sitemap
```

**Features**:
- Scans `app/` directory for pages
- Automatic priority assignment
- Change frequency optimization
- Last modification date tracking
- Robots.txt generation
- Sitemap validation

**Output**: `public/sitemap.xml` and `public/robots.txt`

### 6. SEO Audit Tool (`scripts/seoAudit.js`)

**Purpose**: Comprehensive SEO audit to identify optimization opportunities.

**Usage**:
```bash
npm run seo:audit
```

**Audit Categories**:
- Metadata completeness
- Schema markup implementation
- Sitemap validation
- Image optimization
- Internal linking
- Page structure

**Output**: `seo-audit-report.json` with detailed findings and recommendations

## Configuration

### Main Configuration File (`seo/keywords.json`)

The central configuration file contains:

```json
{
  "config": {
    "siteName": "Steal a Brainrot",
    "siteUrl": "https://www.stealabrainrot.quest",
    "defaultTitle": "Steal a Brainrot - Play Free Online Brainrot Games",
    "defaultDescription": "Play Steal a Brainrot online for free!",
    "defaultOGImage": "/og-image.png",
    "twitterHandle": "@stealabrainrot",
    "locale": "en_US"
  },
  "keywords": {
    "primary": ["steal a brainrot", "brainrot game"],
    "secondary": ["online game", "meme game", "free game"]
  },
  "pages": {
    "/": {
      "primaryKeyword": { "keyword": "steal a brainrot", ... },
      "secondaryKeywords": [...],
      "title": "Optimized Title",
      "description": "Optimized Description"
    }
  },
  "faqs": [
    {
      "question": "What is Steal a Brainrot?",
      "answer": "Detailed answer..."
    }
  ]
}
```

## Integration with Next.js

### Root Layout (`app/layout.tsx`)

```typescript
import { metadataGenerator } from '../lib/seo/metadata';

export const metadata = metadataGenerator.generateHomeMetadata();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Page Implementation

```typescript
import { FAQ } from '../components/seo/FAQ';
import { SchemaMarkup, usePageSchemas } from '../components/seo/SchemaMarkup';
import { seoConfig } from '../lib/seo/config';

export default function GamePage({ params }) {
  const faqs = seoConfig.getFAQData();
  const schemas = usePageSchemas('game', {
    game: {
      name: 'Game Title',
      description: 'Game description...',
      url: `/game/${params.slug}`,
      genre: ['Action', 'Multiplayer']
    }
  });

  return (
    <>
      <SchemaMarkup schemas={schemas} />
      <main>
        {/* Game content */}
        <FAQ items={faqs} />
      </main>
    </>
  );
}
```

## NPM Scripts

All SEO-related tasks are available as NPM scripts:

```json
{
  "seo:parse": "node scripts/parseSEMrush.js",      // Parse keyword data
  "seo:sitemap": "node scripts/generateSitemap.js", // Generate sitemap
  "seo:audit": "node scripts/seoAudit.js",         // Run SEO audit
  "seo:all": "npm run seo:parse && npm run seo:sitemap && npm run seo:audit"
}
```

## Maintenance and Updates

### Regular Tasks

1. **Monthly**:
   ```bash
   # Update with fresh SEMrush data
   npm run seo:parse

   # Regenerate sitemap
   npm run seo:sitemap

   # Run audit to check for issues
   npm run seo:audit
   ```

2. **After Content Changes**:
   ```bash
   # Update sitemap if pages were added/removed
   npm run seo:sitemap
   ```

3. **Performance Monitoring**:
   - Check Google Search Console for indexing issues
   - Monitor keyword rankings weekly
   - Review SEO audit reports monthly

### Updating Keywords

1. Export fresh data from SEMrush
2. Save Excel files to `seo/` directory
3. Run `npm run seo:parse`
4. Review generated `seo/keywords.json`
5. Customize FAQ answers if needed
6. Run `npm run seo:audit` to validate changes

### Adding New Pages

1. Create page in `app/` directory
2. Add page configuration to `seo/keywords.json`:
   ```json
   {
     "pages": {
       "/new-page": {
         "primaryKeyword": { "keyword": "target keyword", ... },
         "secondaryKeywords": [...],
         "title": "Optimized Title",
         "description": "Optimized Description"
       }
     }
   }
   ```
3. Add FAQ content if relevant
4. Run `npm run seo:sitemap` to update sitemap
5. Test with `npm run seo:audit`

## Performance Considerations

### Build-Time Optimization

- All SEO data is processed at build time
- No runtime overhead for metadata generation
- Static sitemap generation
- Pre-compiled FAQ content

### Client-Side Performance

- SEO components are lightweight
- Schema markup is server-side rendered
- FAQ component uses minimal JavaScript
- No external dependencies for core SEO features

## Troubleshooting

### Common Issues

1. **Missing keywords.json**:
   ```bash
   npm run seo:parse
   ```

2. **Sitemap not generating**:
   - Check `app/` directory structure
   - Verify public directory exists
   - Run `npm run seo:sitemap`

3. **Metadata not appearing**:
   - Check layout.tsx integration
   - Verify metadataGenerator import
   - Check for TypeScript errors

4. **Schema not working**:
   - Validate schema with Google Rich Results Test
   - Check JSON-LD syntax
   - Verify component integration

### Debug Commands

```bash
# Check keywords.json structure
cat seo/keywords.json | jq '.config'

# Validate sitemap
npm run seo:sitemap

# Run comprehensive audit
npm run seo:audit

# Test individual components
npm run dev
```

## Advanced Usage

### Custom Schema Types

Extend the schema generator for custom types:

```typescript
// In lib/seo/schema.ts
generateCustomSchema(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CustomType',
    // Custom properties
  };
}
```

### Dynamic Keywords

For real-time keyword optimization:

```typescript
// Use generateMetadata in Next.js pages
export async function generateMetadata({ params }) {
  return metadataGenerator.generateMetadata({
    pagePath: params.slug,
    gameTitle: params.title,
  });
}
```

### Internationalization

For multi-language support:

```typescript
// Update config for multiple locales
const config = {
  locale: 'en_US',
  alternateLocales: ['es_ES', 'fr_FR'],
  // Add locale-specific keywords
};
```

## API Reference

### Core Classes

- `SEOConfigManager`: Configuration management
- `MetadataGenerator`: Meta tag generation
- `SchemaGenerator`: Structured data generation
- `SitemapGenerator`: XML sitemap creation
- `KeywordProcessor`: Keyword analysis and processing

### React Components

- `FAQ`: FAQ display with schema
- `SchemaMarkup`: JSON-LD schema injection
- `FAQCategories`: Category-organized FAQs

### Utility Functions

- `usePageSchemas`: Generate page-specific schemas
- `useFAQData`: Access FAQ data in components
- `metadataGenerator.generateHomeMetadata()`: Homepage metadata
- `sitemapGenerator.generateSitemap()`: Create XML sitemap

## Support

For issues or questions:

1. Check the audit report: `seo-audit-report.json`
2. Review this documentation
3. Check console errors during development
4. Validate with Google Search Console tools

## License

This SEO optimization system is part of the Steal a Brainrot project and follows the same licensing terms.