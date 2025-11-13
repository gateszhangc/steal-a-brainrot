import { sitemapGenerator } from '../lib/seo/sitemap.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

class SitemapScript {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const configPath = path.join(projectRoot, 'seo', 'keywords.json');
      if (fs.existsSync(configPath)) {
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return {
          siteUrl: configData.config?.siteUrl || 'https://www.stealabrainrot.quest',
          siteName: configData.config?.siteName || 'Steal a Brainrot',
        };
      }
    } catch (error) {
      console.warn('Could not load SEO config, using defaults:', error.message);
    }

    return {
      siteUrl: 'https://www.stealabrainrot.quest',
      siteName: 'Steal a Brainrot',
    };
  }

  async generateSitemap() {
    console.log('🗺️  Starting sitemap generation...');
    console.log(`📍 Base URL: ${this.config.siteUrl}`);

    try {
      // Generate main sitemap
      console.log('📝 Generating sitemap...');
      const sitemapXml = await sitemapGenerator.generateSitemap(this.config.siteUrl);

      // Save sitemap to public directory
      const outputPath = path.join(projectRoot, 'public', 'sitemap.xml');
      await sitemapGenerator.saveSitemap(sitemapXml, outputPath);

      console.log(`✅ Sitemap generated successfully!`);
      console.log(`📍 Location: ${outputPath}`);
      console.log(`🌐 Live URL: ${this.config.siteUrl}/sitemap.xml`);

      // Generate sitemap stats
      const stats = await this.getSitemapStats(sitemapXml);
      console.log('\n📊 Sitemap Statistics:');
      console.log(`   - Total URLs: ${stats.urlCount}`);
      console.log(`   - File size: ${stats.fileSize} bytes`);
      console.log(`   - Generated at: ${new Date().toISOString()}`);

      // Validate sitemap
      const validation = await this.validateSitemap(outputPath);
      if (validation.valid) {
        console.log('✅ Sitemap validation passed');
      } else {
        console.warn('⚠️  Sitemap validation warnings:');
        validation.errors.forEach(error => console.log(`   - ${error}`));
      }

      return {
        success: true,
        path: outputPath,
        url: `${this.config.siteUrl}/sitemap.xml`,
        stats
      };

    } catch (error) {
      console.error('❌ Failed to generate sitemap:', error.message);
      throw error;
    }
  }

  async getSitemapStats(sitemapXml) {
    const urlMatches = sitemapXml.match(/<loc>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;
    const fileSize = Buffer.byteLength(sitemapXml, 'utf8');

    return {
      urlCount,
      fileSize
    };
  }

  async validateSitemap(sitemapPath) {
    try {
      const content = fs.readFileSync(sitemapPath, 'utf8');

      // Basic XML validation
      if (!content.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
        return { valid: false, errors: ['Missing XML declaration'] };
      }

      if (!content.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
        return { valid: false, errors: ['Missing sitemap namespace'] };
      }

      // Check for required elements in each URL
      const urlBlocks = content.match(/<url>[\s\S]*?<\/url>/g);
      if (!urlBlocks) {
        return { valid: false, errors: ['No URL blocks found'] };
      }

      const errors = [];
      urlBlocks.forEach((block, index) => {
        if (!block.includes('<loc>')) {
          errors.push(`URL block ${index + 1}: Missing loc element`);
        }
        if (!block.includes('<lastmod>')) {
          errors.push(`URL block ${index + 1}: Missing lastmod element`);
        }
      });

      return {
        valid: errors.length === 0,
        errors
      };

    } catch (error) {
      return {
        valid: false,
        errors: [`Validation error: ${error.message}`]
      };
    }
  }

  // Generate robots.txt alongside sitemap
  async generateRobotsTxt() {
    const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.config.siteUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1

# Disallow specific paths if needed
# Disallow: /api/
# Disallow: /admin/
`;

    const robotsPath = path.join(projectRoot, 'public', 'robots.txt');
    fs.writeFileSync(robotsPath, robotsContent, 'utf8');

    console.log(`🤖 Robots.txt generated: ${robotsPath}`);
    console.log(`🌐 Live URL: ${this.config.siteUrl}/robots.txt`);
  }

  // Main execution method
  async run() {
    try {
      console.log('🚀 Starting sitemap generation process...\n');

      // Generate sitemap
      const sitemapResult = await this.generateSitemap();

      // Generate robots.txt
      await this.generateRobotsTxt();

      console.log('\n🎉 Sitemap generation completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Test your sitemap: https://www.google.com/webmasters/tools/sitemap-list');
      console.log('2. Submit to Google Search Console');
      console.log('3. Submit to Bing Webmaster Tools');
      console.log('4. Monitor crawl stats in Google Search Console');

      return sitemapResult;

    } catch (error) {
      console.error('\n💥 Sitemap generation failed:', error);
      process.exit(1);
    }
  }
}

// Run the script
const sitemapScript = new SitemapScript();
sitemapScript.run().catch(console.error);