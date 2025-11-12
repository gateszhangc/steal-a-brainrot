import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

class SEMrushParser {
  constructor() {
    this.seoDir = path.join(projectRoot, 'seo');
    this.outputFile = path.join(this.seoDir, 'keywords.json');
  }

  async parseExcelFiles() {
    console.log('Starting SEMrush data parsing...');

    try {
      // Find Excel files in seo directory
      const excelFiles = fs.readdirSync(this.seoDir)
        .filter(file => file.endsWith('.xlsx'));

      if (excelFiles.length === 0) {
        console.log('No Excel files found in seo directory');
        return;
      }

      console.log(`Found ${excelFiles.length} Excel files:`, excelFiles);

      let allKeywords = [];
      let allQuestions = [];

      // Parse each Excel file
      for (const file of excelFiles) {
        console.log(`\nParsing ${file}...`);
        const filePath = path.join(this.seoDir, file);
        const keywords = await this.parseExcelFile(filePath);

        // Categorize keywords
        const questions = this.identifyQuestions(keywords);
        const regularKeywords = keywords.filter(k => !k.isQuestion);

        allKeywords = [...allKeywords, ...regularKeywords];
        allQuestions = [...allQuestions, ...questions];

        console.log(`  - Total keywords: ${keywords.length}`);
        console.log(`  - Questions: ${questions.length}`);
        console.log(`  - Regular keywords: ${regularKeywords.length}`);
      }

      // Remove duplicates
      allKeywords = this.removeDuplicates(allKeywords);
      allQuestions = this.removeDuplicates(allQuestions);

      console.log('\nAfter removing duplicates:');
      console.log(`  - Total unique keywords: ${allKeywords.length}`);
      console.log(`  - Unique questions: ${allQuestions.length}`);

      // Sort by priority
      allKeywords.sort((a, b) => (b.priority || 0) - (a.priority || 0));
      allQuestions.sort((a, b) => (b.priority || 0) - (a.priority || 0));

      // Generate page mappings
      const pages = this.generatePageMappings(allKeywords, allQuestions);

      // Generate output JSON
      const output = this.generateOutput(allKeywords, allQuestions, pages);

      // Save to file
      await this.saveOutput(output);

      console.log('\n✅ SEMrush parsing completed successfully!');
      console.log(`📄 Output saved to: ${this.outputFile}`);
      console.log(`📊 Processed ${allKeywords.length} keywords and ${allQuestions.length} questions`);

    } catch (error) {
      console.error('❌ Error parsing SEMrush data:', error);
      throw error;
    }
  }

  async parseExcelFile(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(`  - Found ${data.length} rows in ${path.basename(filePath)}`);

    return data.map(row => this.processRow(row));
  }

  processRow(row) {
    const keyword = String(row['Keyword'] || row.keyword || '').toLowerCase().trim();

    if (!keyword) {
      console.warn('Skipping row with empty keyword:', row);
      return null;
    }

    return {
      keyword,
      searchVolume: Number(row['Search Volume'] || row.searchVolume || 0),
      keywordDifficulty: Number(row['Keyword Difficulty'] || row.keywordDifficulty || 0),
      cpc: Number(row.CPC || row.cpc || 0),
      competitiveDensity: Number(row['Competitive Density'] || row.competitiveDensity || 0),
      numberOfResults: Number(row['Number of Results'] || row.numberOfResults || 0),
      trends: String(row['Trends'] || row.trends || ''),
      serpFeatures: String(row['SERP Features'] || row.serpFeatures || ''),
      intent: this.determineIntent(keyword),
      isQuestion: this.isQuestion(keyword),
      category: this.categorizeKeyword(keyword),
      priority: this.calculatePriority(
        Number(row['Search Volume'] || row.searchVolume || 0),
        Number(row['Keyword Difficulty'] || row.keywordDifficulty || 0),
        Number(row.CPC || row.cpc || 0)
      )
    };
  }

  determineIntent(keyword) {
    const commercialIntents = ['buy', 'price', 'cost', 'cheap', 'free', 'download', 'best', 'review'];
    const informationalIntents = ['guide', 'tutorial', 'how to', 'what is', 'learn', 'tips'];
    const transactionalIntents = ['play', 'game', 'online'];

    const lowerKeyword = keyword.toLowerCase();

    if (commercialIntents.some(intent => lowerKeyword.includes(intent))) {
      return 'commercial';
    }
    if (informationalIntents.some(intent => lowerKeyword.includes(intent))) {
      return 'informational';
    }
    if (transactionalIntents.some(intent => lowerKeyword.includes(intent))) {
      return 'transactional';
    }

    return 'informational';
  }

  isQuestion(keyword) {
    const questionWords = ['what', 'how', 'where', 'when', 'why', 'which', 'who', 'can', 'is', 'does', 'do'];
    const lowerKeyword = keyword.toLowerCase();

    return questionWords.some(word =>
      lowerKeyword.startsWith(word + ' ') ||
      lowerKeyword === word ||
      lowerKeyword.includes('?') ||
      lowerKeyword.includes('how to') ||
      lowerKeyword.includes('what is')
    );
  }

  categorizeKeyword(keyword) {
    const lowerKeyword = keyword.toLowerCase();

    if (lowerKeyword.includes('unblocked') || lowerKeyword.includes('school')) {
      return 'unblocked-games';
    }
    if (lowerKeyword.includes('online') || lowerKeyword.includes('play')) {
      return 'online-games';
    }
    if (lowerKeyword.includes('roblox')) {
      return 'roblox-games';
    }
    if (lowerKeyword.includes('mobile') || lowerKeyword.includes('android') || lowerKeyword.includes('ios')) {
      return 'mobile-games';
    }
    if (lowerKeyword.includes('free')) {
      return 'free-games';
    }
    if (lowerKeyword.includes('download')) {
      return 'download-games';
    }
    if (this.isQuestion(keyword)) {
      return 'questions';
    }

    return 'general';
  }

  calculatePriority(searchVolume, difficulty, cpc) {
    const volumeScore = Math.log(Math.max(searchVolume, 1)) / Math.log(10000);
    const difficultyScore = (100 - difficulty) / 100;
    const cpcScore = Math.min(cpc / 2, 1);

    return (volumeScore * 0.5) + (difficultyScore * 0.3) + (cpcScore * 0.2);
  }

  identifyQuestions(keywords) {
    return keywords.filter(k => k && k.isQuestion);
  }

  removeDuplicates(keywords) {
    const seen = new Set();
    return keywords.filter(keyword => {
      if (!keyword || !keyword.keyword) return false;
      if (seen.has(keyword.keyword)) return false;
      seen.add(keyword.keyword);
      return true;
    });
  }

  generatePageMappings(keywords, questions) {
    const pages = {};

    // Homepage
    pages['/'] = {
      primaryKeyword: keywords[0] || { keyword: 'steal a brainrot', searchVolume: 1000, keywordDifficulty: 30, cpc: 0.5 },
      secondaryKeywords: keywords.slice(1, 4),
      title: 'Steal a Brainrot - Play Free Online Brainrot Games',
      description: 'Play Steal a Brainrot online for free! The ultimate brainrot game experience with exciting gameplay and no downloads required.'
    };

    // Create pages for high-priority keywords
    const priorityKeywords = keywords.slice(0, 20);
    for (let i = 1; i < priorityKeywords.length; i++) {
      const keyword = priorityKeywords[i];
      const slug = this.createSlug(keyword.keyword);
      const path = `/${slug}`;

      pages[path] = {
        primaryKeyword: keyword,
        secondaryKeywords: keywords.slice(i + 1, i + 3),
        title: `${this.capitalizeFirst(keyword.keyword)} - Play Free Online | Steal a Brainrot`,
        description: `Play ${keyword.keyword} online for free! Enjoy this exciting brainrot game with instant access and no downloads required.`
      };
    }

    return pages;
  }

  createSlug(keyword) {
    return keyword
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  generateFAQs(questions) {
    const topQuestions = questions.slice(0, 15);
    return topQuestions.map(q => ({
      question: this.capitalizeFirst(q.keyword),
      answer: this.generateAnswer(q.keyword)
    }));
  }

  generateAnswer(question) {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('what is')) {
      return 'Steal a Brainrot is a free online multiplayer game where players compete to collect brainrot characters in exciting game modes.';
    } else if (lowerQuestion.includes('how to play')) {
      return 'Playing Steal a Brainrot is easy! Use your mouse or keyboard to move your character and collect brainrot items while avoiding other players.';
    } else if (lowerQuestion.includes('free')) {
      return 'Yes! Steal a Brainrot is completely free to play. No downloads, registrations, or payments are required - just instant online gaming!';
    } else if (lowerQuestion.includes('unblocked')) {
      return 'Steal a Brainrot unblocked versions allow you to play at school or work without restrictions. Simply visit our website for instant access.';
    } else if (lowerQuestion.includes('online')) {
      return 'Yes, Steal a Brainrot is an online multiplayer game that you can play directly in your browser with friends or players from around the world.';
    } else {
      return 'Steal a Brainrot offers exciting multiplayer gameplay with various game modes, colorful graphics, and addictive fun for players of all ages.';
    }
  }

  generateOutput(keywords, questions, pages) {
    // Read existing config if available
    let existingConfig = {};
    try {
      if (fs.existsSync(this.outputFile)) {
        const existingData = JSON.parse(fs.readFileSync(this.outputFile, 'utf8'));
        existingConfig = existingData.config || {};
      }
    } catch (error) {
      console.warn('Could not read existing config:', error.message);
    }

    return {
      config: {
        siteName: existingConfig.siteName || 'Steal a Brainrot',
        siteUrl: existingConfig.siteUrl || 'https://www.stealabrainrot.quest',
        defaultTitle: existingConfig.defaultTitle || 'Steal a Brainrot - Play Free Online',
        defaultDescription: existingConfig.defaultDescription || 'Play Steal a Brainrot and other brainrot games online for free.',
        defaultOGImage: existingConfig.defaultOGImage || '/og-image.png',
        twitterHandle: existingConfig.twitterHandle || '@stealabrainrot',
        locale: existingConfig.locale || 'en_US',
        lastUpdated: new Date().toISOString()
      },
      keywords: {
        primary: keywords.slice(0, 10).map(k => k.keyword),
        secondary: keywords.slice(10, 30).map(k => k.keyword),
        total: keywords.length
      },
      pages,
      faqs: this.generateFAQs(questions),
      metadata: {
        totalKeywordsProcessed: keywords.length + questions.length,
        totalQuestions: questions.length,
        topKeywordByVolume: keywords.sort((a, b) => b.searchVolume - a.searchVolume)[0]?.keyword || 'N/A',
        processingDate: new Date().toISOString()
      }
    };
  }

  async saveOutput(data) {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(this.outputFile, jsonString, 'utf8');
  }
}

// Run the parser
const parser = new SEMrushParser();
parser.parseExcelFiles().then(() => {
  console.log('Script completed successfully');
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});

export default SEMrushParser;