import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sitemapGenerator } from '../lib/seo/sitemap.js';
import { seoConfig } from '../lib/seo/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

class SEOAuditor {
  constructor() {
    this.config = this.loadConfig();
    this.issues = [];
    this.warnings = [];
    this.results = [];
  }

  loadConfig() {
    try {
      const configPath = path.join(projectRoot, 'seo', 'keywords.json');
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load SEO config:', error.message);
    }
    return {};
  }

  async runAudit() {
    console.log('🔍 Starting SEO audit...\n');

    try {
      // Audit metadata
      await this.auditMetadata();

      // Audit schema markup
      await this.auditSchemaMarkup();

      // Audit sitemap
      await this.auditSitemap();

      // Audit images
      await this.auditImages();

      // Audit internal links
      await this.auditInternalLinks();

      // Audit page structure
      await this.auditPageStructure();

      // Generate report
      this.generateReport();

      return {
        totalIssues: this.issues.length,
        totalWarnings: this.warnings.length,
        pages: this.results.length,
        issues: this.issues,
        warnings: this.warnings,
        results: this.results
      };

    } catch (error) {
      console.error('❌ SEO audit failed:', error);
      throw error;
    }
  }

  async auditMetadata() {
    console.log('📝 Auditing metadata...');

    try {
      // Check if keywords.json exists and is valid
      const keywordsPath = path.join(projectRoot, 'seo', 'keywords.json');
      if (!fs.existsSync(keywordsPath)) {
        this.addIssue('Missing keywords.json file', 'critical');
        return;
      }

      const keywordsData = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'));

      // Validate structure
      if (!keywordsData.config) {
        this.addIssue('Missing config section in keywords.json', 'high');
      }

      if (!keywordsData.pages) {
        this.addIssue('Missing pages section in keywords.json', 'high');
      }

      if (!keywordsData.faqs || keywordsData.faqs.length === 0) {
        this.addWarning('No FAQ items found in keywords.json');
      }

      // Check page mappings
      if (keywordsData.pages) {
        for (const [pagePath, pageData] of Object.entries(keywordsData.pages)) {
          if (!pageData.primaryKeyword) {
            this.addIssue(`Missing primary keyword for page: ${pagePath}`, 'medium');
          }

          if (!pageData.title) {
            this.addIssue(`Missing title for page: ${pagePath}`, 'high');
          } else if (pageData.title.length > 60) {
            this.addWarning(`Title too long for page ${pagePath}: ${pageData.title.length} chars`);
          }

          if (!pageData.description) {
            this.addIssue(`Missing description for page: ${pagePath}`, 'high');
          } else if (pageData.description.length > 160) {
            this.addWarning(`Description too long for page ${pagePath}: ${pageData.description.length} chars`);
          }
        }
      }

      this.addResult('Metadata audit completed', {
        totalKeywords: Object.keys(keywordsData.pages || {}).length,
        totalFAQs: (keywordsData.faqs || []).length
      });

    } catch (error) {
      this.addIssue(`Error auditing metadata: ${error.message}`, 'high');
    }
  }

  async auditSchemaMarkup() {
    console.log('🏗️  Auditing schema markup...');

    try {
      // Check if schema generator exists
      const schemaPath = path.join(projectRoot, 'lib', 'seo', 'schema.ts');
      if (!fs.existsSync(schemaPath)) {
        this.addIssue('Missing schema.ts file', 'high');
        return;
      }

      // Check for required schema types
      const requiredSchemas = [
        'VideoGame',
        'FAQPage',
        'WebSite',
        'Organization'
      ];

      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      requiredSchemas.forEach(schemaType => {
        if (!schemaContent.includes(`@type": "${schemaType}"`)) {
          this.addWarning(`Missing ${schemaType} schema type`);
        }
      });

      this.addResult('Schema markup audit completed', {
        schemaTypesFound: requiredSchemas.filter(type => schemaContent.includes(type)).length
      });

    } catch (error) {
      this.addIssue(`Error auditing schema markup: ${error.message}`, 'medium');
    }
  }

  async auditSitemap() {
    console.log('🗺️  Auditing sitemap...');

    try {
      const sitemapPath = path.join(projectRoot, 'public', 'sitemap.xml');
      if (!fs.existsSync(sitemapPath)) {
        this.addIssue('Missing sitemap.xml file', 'high');
        return;
      }

      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

      // Validate sitemap structure
      if (!sitemapContent.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
        this.addIssue('Sitemap missing XML declaration', 'high');
      }

      if (!sitemapContent.includes('<urlset')) {
        this.addIssue('Invalid sitemap structure', 'high');
      }

      // Count URLs
      const urlMatches = sitemapContent.match(/<url>/g);
      const urlCount = urlMatches ? urlMatches.length : 0;

      if (urlCount === 0) {
        this.addIssue('No URLs found in sitemap', 'high');
      } else if (urlCount < 10) {
        this.addWarning(`Sitemap has only ${urlCount} URLs`);
      }

      // Check for required elements
      const locMatches = sitemapContent.match(/<loc>/g);
      if (!locMatches || locMatches.length !== urlCount) {
        this.addIssue('Missing or inconsistent <loc> elements in sitemap', 'high');
      }

      this.addResult('Sitemap audit completed', {
        urlCount,
        fileSize: Buffer.byteLength(sitemapContent, 'utf8')
      });

    } catch (error) {
      this.addIssue(`Error auditing sitemap: ${error.message}`, 'medium');
    }
  }

  async auditImages() {
    console.log('🖼️  Auditing images...');

    try {
      const publicDir = path.join(projectRoot, 'public');
      if (!fs.existsSync(publicDir)) {
        this.addWarning('No public directory found');
        return;
      }

      // Check for default OG image
      const ogImagePath = path.join(publicDir, 'og-image.png');
      if (!fs.existsSync(ogImagePath)) {
        this.addIssue('Missing default OG image (og-image.png)', 'high');
      }

      // Check image files
      const images = this.findFiles(publicDir, ['.png', '.jpg', '.jpeg', '.gif', '.webp']);

      let largeImages = 0;
      let unoptimizedImages = 0;

      images.forEach(image => {
        try {
          const stats = fs.statSync(image);
          const sizeInMB = stats.size / (1024 * 1024);

          if (sizeInMB > 1) {
            largeImages++;
            this.addWarning(`Large image file: ${path.basename(image)} (${sizeInMB.toFixed(2)}MB)`);
          }

          // Check for unoptimized extensions
          if (image.endsWith('.jpg') || image.endsWith('.png')) {
            unoptimizedImages++;
          }
        } catch (error) {
          // Skip files that can't be accessed
        }
      });

      this.addResult('Image audit completed', {
        totalImages: images.length,
        largeImages,
        unoptimizedImages
      });

    } catch (error) {
      this.addIssue(`Error auditing images: ${error.message}`, 'low');
    }
  }

  async auditInternalLinks() {
    console.log('🔗 Auditing internal links...');

    try {
      // Check for main navigation structure
      const appDir = path.join(projectRoot, 'app');
      if (fs.existsSync(appDir)) {
        const layoutPath = path.join(appDir, 'layout.tsx');
        if (fs.existsSync(layoutPath)) {
          const layoutContent = fs.readFileSync(layoutPath, 'utf8');

          // Check for navigation
          if (!layoutContent.includes('nav') && !layoutContent.includes('Nav')) {
            this.addWarning('No navigation found in layout');
          }

          // Check for internal links
          const internalLinks = layoutContent.match(/href="\/[^"]*"/g);
          if (!internalLinks || internalLinks.length < 3) {
            this.addWarning('Few internal navigation links found');
          }
        }
      }

      this.addResult('Internal links audit completed', {});

    } catch (error) {
      this.addIssue(`Error auditing internal links: ${error.message}`, 'low');
    }
  }

  async auditPageStructure() {
    console.log('📄 Auditing page structure...');

    try {
      const appDir = path.join(projectRoot, 'app');
      if (!fs.existsSync(appDir)) {
        this.addIssue('No app directory found', 'critical');
        return;
      }

      // Check main layout
      const layoutPath = path.join(appDir, 'layout.tsx');
      if (!fs.existsSync(layoutPath)) {
        this.addIssue('Missing layout.tsx file', 'critical');
        return;
      }

      const layoutContent = fs.readFileSync(layoutPath, 'utf8');

      // Check for essential HTML elements
      if (!layoutContent.includes('<html')) {
        this.addIssue('Missing html element in layout', 'high');
      }

      if (!layoutContent.includes('<head')) {
        this.addIssue('Missing head element in layout', 'high');
      }

      if (!layoutContent.includes('<body')) {
        this.addIssue('Missing body element in layout', 'high');
      }

      // Check for viewport meta tag
      if (!layoutContent.includes('viewport')) {
        this.addIssue('Missing viewport meta tag', 'medium');
      }

      // Check main page
      const pagePath = path.join(appDir, 'page.tsx');
      if (!fs.existsSync(pagePath)) {
        this.addIssue('Missing main page.tsx file', 'critical');
        return;
      }

      const pageContent = fs.readFileSync(pagePath, 'utf8');

      // Check for heading structure
      if (!pageContent.includes('<h1') && !pageContent.includes('className=.*h1')) {
        this.addWarning('No H1 heading found on main page');
      }

      // Check for SEO components
      if (!pageContent.includes('FAQ') && !pageContent.includes('faq')) {
        this.addWarning('No FAQ section found on main page');
      }

      this.addResult('Page structure audit completed', {
        hasLayout: fs.existsSync(layoutPath),
        hasMainPage: fs.existsSync(pagePath)
      });

    } catch (error) {
      this.addIssue(`Error auditing page structure: ${error.message}`, 'medium');
    }
  }

  findFiles(dir, extensions) {
    const files = [];

    function scanDirectory(currentDir) {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          scanDirectory(itemPath);
        } else {
          const ext = path.extname(item).toLowerCase();
          if (extensions.includes(ext)) {
            files.push(itemPath);
          }
        }
      }
    }

    scanDirectory(dir);
    return files;
  }

  addIssue(message, severity = 'medium') {
    this.issues.push({ message, severity });
  }

  addWarning(message) {
    this.warnings.push(message);
  }

  addResult(message, data) {
    this.results.push({ message, data, timestamp: new Date().toISOString() });
  }

  generateReport() {
    console.log('\n📊 SEO AUDIT REPORT');
    console.log('==================\n');

    // Summary
    console.log(`📈 SUMMARY:`);
    console.log(`   ✅ Successful checks: ${this.results.length}`);
    console.log(`   ⚠️  Warnings: ${this.warnings.length}`);
    console.log(`   ❌ Issues: ${this.issues.length}`);

    // Critical issues first
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    const highIssues = this.issues.filter(i => i.severity === 'high');
    const mediumIssues = this.issues.filter(i => i.severity === 'medium');
    const lowIssues = this.issues.filter(i => i.severity === 'low');

    if (criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      criticalIssues.forEach(issue => console.log(`   ❌ ${issue.message}`));
    }

    if (highIssues.length > 0) {
      console.log('\n⚠️  HIGH PRIORITY ISSUES:');
      highIssues.forEach(issue => console.log(`   ⚠️  ${issue.message}`));
    }

    if (mediumIssues.length > 0) {
      console.log('\n📋 MEDIUM PRIORITY ISSUES:');
      mediumIssues.forEach(issue => console.log(`   📋 ${issue.message}`));
    }

    if (lowIssues.length > 0) {
      console.log('\n💡 LOW PRIORITY ISSUES:');
      lowIssues.forEach(issue => console.log(`   💡 ${issue.message}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚡ RECOMMENDATIONS:');
      this.warnings.forEach(warning => console.log(`   ⚡ ${warning}`));
    }

    // Calculate score
    const totalChecks = this.results.length + this.issues.length;
    const score = Math.round((this.results.length / totalChecks) * 100);

    console.log('\n🎯 OVERALL SEO SCORE:');
    console.log(`   Score: ${score}/100`);

    if (score >= 90) {
      console.log('   🏆 Excellent SEO optimization!');
    } else if (score >= 80) {
      console.log('   👍 Good SEO optimization');
    } else if (score >= 70) {
      console.log('   👌 SEO optimization needs improvement');
    } else {
      console.log('   📈 SEO optimization requires significant work');
    }

    // Save detailed report
    this.saveDetailedReport();
  }

  saveDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.issues.length,
        totalWarnings: this.warnings.length,
        totalPassed: this.results.length,
        score: Math.round((this.results.length / (this.results.length + this.issues.length)) * 100)
      },
      issues: this.issues,
      warnings: this.warnings,
      results: this.results,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(projectRoot, 'seo-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.issues.some(i => i.message.includes('title'))) {
      recommendations.push('Optimize page titles for better search engine visibility');
    }

    if (this.issues.some(i => i.message.includes('description'))) {
      recommendations.push('Add compelling meta descriptions to improve click-through rates');
    }

    if (this.issues.some(i => i.message.includes('sitemap'))) {
      recommendations.push('Ensure sitemap is properly generated and accessible');
    }

    if (this.warnings.some(w => w.includes('image'))) {
      recommendations.push('Optimize images for better page load speed');
    }

    if (this.issues.some(i => i.message.includes('schema'))) {
      recommendations.push('Implement structured data to enhance search results');
    }

    recommendations.push('Regularly update keyword data based on performance');
    recommendations.push('Monitor search console for indexing issues');
    recommendations.push('Consider implementing JSON-LD for all schema types');

    return recommendations;
  }
}

// Run the audit
const auditor = new SEOAuditor();
auditor.runAudit()
  .then(results => {
    console.log('\n✅ SEO audit completed successfully!');
    process.exit(results.totalIssues > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('\n💥 SEO audit failed:', error);
    process.exit(1);
  });