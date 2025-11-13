import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SitemapEntry } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

export class SitemapGenerator {
  private appDir: string;
  private publicDir: string;
  private excludePatterns: RegExp[];

  constructor() {
    this.appDir = path.join(projectRoot, 'app');
    this.publicDir = path.join(projectRoot, 'public');
    this.excludePatterns = [
      /\[.*\]/, // Dynamic routes like [slug]
      /^_/, // Next.js special files like _not-found, _document
      /\/api\//, // API routes
      /\/.*\.(js|ts|jsx|tsx|css|scss|json|md)$/, // Static files
      /^layout\.(tsx|ts)$/,
      /^loading\.(tsx|ts)$/,
      /^error\.(tsx|ts)$/,
      /^not-found\.(tsx|ts)$/,
    ];
  }

  async generateSitemap(baseUrl: string = 'https://www.stealabrainrot.quest'): Promise<string> {
    try {
      console.log('Generating sitemap...');

      // Get all page paths
      const pagePaths = await this.scanPages();

      // Generate sitemap entries
      const entries = this.generateSitemapEntries(pagePaths, baseUrl);

      // Generate XML
      const xml = this.generateSitemapXML(entries);

      console.log(`Generated sitemap with ${entries.length} entries`);
      return xml;

    } catch (error) {
      console.error('Error generating sitemap:', error);
      throw error;
    }
  }

  private async scanPages(): Promise<string[]> {
    const pages: string[] = [];

    const scanDirectory = (dir: string, relativePath: string = ''): void => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const itemPath = path.join(dir, item);
        const relativeItemPath = path.join(relativePath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          scanDirectory(itemPath, relativeItemPath);
        } else if (item === 'page.tsx' || item === 'page.ts') {
          // Found a page file
          const routePath = relativePath === '' ? '/' : `/${relativePath}`;
          if (!this.shouldExclude(routePath)) {
            pages.push(routePath);
          }
        }
      }
    };

    scanDirectory(this.appDir);

    // Add static pages from public directory
    this.addStaticPages(pages);

    return pages.sort();
  }

  private shouldExclude(path: string): boolean {
    return this.excludePatterns.some(pattern => pattern.test(path));
  }

  private addStaticPages(pages: string[]): void {
    // Common static pages that might not be in the app directory
    const staticPages = [
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/faq',
      '/help',
      '/sitemap.xml',
      '/robots.txt',
    ];

    for (const page of staticPages) {
      if (!pages.includes(page)) {
        pages.push(page);
      }
    }
  }

  private generateSitemapEntries(pagePaths: string[], baseUrl: string): SitemapEntry[] {
    const entries: SitemapEntry[] = [];

    for (const pagePath of pagePaths) {
      const entry = this.createSitemapEntry(pagePath, baseUrl);
      if (entry) {
        entries.push(entry);
      }
    }

    return entries;
  }

  private createSitemapEntry(pagePath: string, baseUrl: string): SitemapEntry | null {
    // Determine priority based on page path
    const priority = this.getPriority(pagePath);
    const changefreq = this.getChangeFrequency(pagePath);

    // Get last modified date
    let lastmod = new Date().toISOString().split('T')[0];

    try {
      // Try to get file modification time
      const pageFile = this.getPageFilePath(pagePath);
      if (fs.existsSync(pageFile)) {
        const stats = fs.statSync(pageFile);
        lastmod = stats.mtime.toISOString().split('T')[0];
      }
    } catch (error) {
      // Use current date if file doesn't exist or error occurs
      console.warn(`Could not get modification date for ${pagePath}:`, error);
    }

    return {
      loc: `${baseUrl}${pagePath === '/' ? '' : pagePath}`,
      lastmod,
      changefreq,
      priority,
    };
  }

  private getPageFilePath(pagePath: string): string {
    if (pagePath === '/') {
      return path.join(this.appDir, 'page.tsx');
    }

    const cleanPath = pagePath.replace(/^\//, '').replace(/\/$/, '');
    const pageFile = path.join(this.appDir, cleanPath, 'page.tsx');
    return pageFile;
  }

  private getPriority(pagePath: string): number {
    // Priority logic based on page importance
    if (pagePath === '/') {
      return 1.0; // Homepage
    }

    if (pagePath.includes('/game/') || pagePath.includes('/play/')) {
      return 0.8; // Game pages
    }

    if (['/about', '/contact', '/faq', '/help'].includes(pagePath)) {
      return 0.6; // Important info pages
    }

    if (['/privacy', '/terms'].includes(pagePath)) {
      return 0.3; // Legal pages
    }

    if (pagePath.endsWith('.xml') || pagePath.endsWith('.txt')) {
      return 0.1; // Technical files
    }

    return 0.5; // Default priority for other pages
  }

  private getChangeFrequency(pagePath: string): SitemapEntry['changefreq'] {
    // Change frequency based on page type
    if (pagePath === '/') {
      return 'daily'; // Homepage updates frequently
    }

    if (pagePath.includes('/game/') || pagePath.includes('/play/')) {
      return 'weekly'; // Game pages might update with new features
    }

    if (['/about', '/privacy', '/terms'].includes(pagePath)) {
      return 'monthly'; // Static content
    }

    if (pagePath.includes('/blog') || pagePath.includes('/news')) {
      return 'weekly'; // Content pages
    }

    return 'monthly'; // Default
  }

  private generateSitemapXML(entries: SitemapEntry[]): string {
    const urlEntries = entries.map(entry => this.formatURLEntry(entry)).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
  }

  private formatURLEntry(entry: SitemapEntry): string {
    return `  <url>
    <loc>${this.escapeXML(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`;
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async saveSitemap(xml: string, outputPath?: string): Promise<void> {
    const defaultPath = path.join(this.publicDir, 'sitemap.xml');
    const filePath = outputPath || defaultPath;

    try {
      // Ensure public directory exists
      if (!fs.existsSync(this.publicDir)) {
        fs.mkdirSync(this.publicDir, { recursive: true });
      }

      fs.writeFileSync(filePath, xml, 'utf8');
      console.log(`Sitemap saved to: ${filePath}`);
    } catch (error) {
      console.error('Error saving sitemap:', error);
      throw error;
    }
  }

  // Generate sitemap index for multiple sitemaps
  generateSitemapIndex(sitemaps: Array<{ loc: string; lastmod: string }>): string {
    const sitemapEntries = sitemaps.map(sitemap =>
      `  <sitemap>
    <loc>${this.escapeXML(sitemap.loc)}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
    ).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
  }

  // Validate sitemap entries
  validateEntries(entries: SitemapEntry[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const entry of entries) {
      // Check URL format
      try {
        new URL(entry.loc);
      } catch {
        errors.push(`Invalid URL: ${entry.loc}`);
      }

      // Check lastmod format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.lastmod)) {
        errors.push(`Invalid lastmod format: ${entry.lastmod} for ${entry.loc}`);
      }

      // Check priority range
      if (entry.priority < 0.0 || entry.priority > 1.0) {
        errors.push(`Invalid priority: ${entry.priority} for ${entry.loc}`);
      }

      // Check changefreq
      const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
      if (!validFrequencies.includes(entry.changefreq)) {
        errors.push(`Invalid changefreq: ${entry.changefreq} for ${entry.loc}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const sitemapGenerator = new SitemapGenerator();
export default sitemapGenerator;