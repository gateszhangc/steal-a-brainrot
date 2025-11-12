import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(path.dirname(__dirname));

class SEOConfigManager {
  constructor() {
    this.loadConfig();
  }

  loadConfig() {
    try {
      const configPath = path.join(projectRoot, 'seo', 'keywords.json');
      if (fs.existsSync(configPath)) {
        const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        this.config = data.config || {};
        this.pages = data.pages || {};
        this.faqs = data.faqs || [];
      }
    } catch (error) {
      console.warn('Could not load SEO config:', error.message);
      this.config = {};
      this.pages = {};
      this.faqs = [];
    }
  }

  getSEOConfig() {
    return {
      siteName: this.config.siteName || 'Steal a Brainrot',
      siteUrl: this.config.siteUrl || 'https://www.stealabrainrot.quest',
      defaultTitle: this.config.defaultTitle || 'Steal a Brainrot - Play Free Online',
      defaultDescription: this.config.defaultDescription || 'Play Steal a Brainrot and other brainrot games online for free.',
      defaultOGImage: this.config.defaultOGImage || '/og-image.png',
      twitterHandle: this.config.twitterHandle || '@stealabrainrot',
      locale: this.config.locale || 'en_US',
    };
  }

  getPageKeywords(pagePath) {
    if (this.pages[pagePath]) {
      return this.pages[pagePath];
    }
    return null;
  }

  getFAQData(category) {
    if (category) {
      return this.faqs.filter(faq => faq.category === category);
    }
    return this.faqs;
  }
}

export const seoConfig = new SEOConfigManager();
export default seoConfig;