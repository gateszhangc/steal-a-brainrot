import { Keyword, SEMrushRow, PageKeywords } from './types';

export class KeywordProcessor {
  private questionWords = [
    'what', 'how', 'where', 'when', 'why', 'which', 'who', 'can', 'is',
    'does', 'do', 'are', 'will', 'was', 'were', 'has', 'have', 'should',
    'could', 'would', 'may', 'might', 'shall'
  ];

  private commercialIntents = [
    'buy', 'price', 'cost', 'cheap', 'free', 'download', 'online', 'best',
    'review', 'rating', 'deal', 'discount', 'sale', 'purchase'
  ];

  private informationalIntents = [
    'guide', 'tutorial', 'how to', 'what is', 'learn', 'tips', 'help',
    'instructions', 'manual', 'walkthrough', 'cheats', 'hacks'
  ];

  parseSEMrushData(data: any[]): Keyword[] {
    if (!Array.isArray(data)) {
      console.error('SEMrush data is not an array:', typeof data);
      return [];
    }

    return data.map((row: any) => {
      try {
        const keyword = this.extractKeyword(row);
        return this.processKeyword(keyword);
      } catch (error) {
        console.warn('Error processing row:', row, error);
        return null;
      }
    }).filter((keyword): keyword is Keyword => keyword !== null);
  }

  private extractKeyword(row: any): SEMrushRow {
    return {
      Keyword: row.Keyword || row.keyword || '',
      'Search Volume': Number(row['Search Volume'] || row.searchVolume || 0),
      'Keyword Difficulty': Number(row['Keyword Difficulty'] || row.keywordDifficulty || 0),
      CPC: Number(row.CPC || row.cpc || 0),
      'Competitive Density': Number(row['Competitive Density'] || 0),
      'Number of Results': Number(row['Number of Results'] || 0),
      Trends: row.Trends || '',
      'SERP Features': row['SERP Features'] || ''
    };
  }

  private processKeyword(row: SEMrushRow): Keyword {
    const keyword = row.Keyword.toLowerCase().trim();

    return {
      keyword,
      searchVolume: row['Search Volume'],
      keywordDifficulty: row['Keyword Difficulty'],
      cpc: row.CPC,
      intent: this.determineIntent(keyword),
      isQuestion: this.isQuestion(keyword),
      category: this.categorizeKeyword(keyword),
      priority: this.calculatePriority(row['Search Volume'], row['Keyword Difficulty'], row.CPC)
    };
  }

  private determineIntent(keyword: string): Keyword['intent'] {
    const lowerKeyword = keyword.toLowerCase();

    // Check for commercial intent
    if (this.commercialIntents.some(intent => lowerKeyword.includes(intent))) {
      return 'commercial';
    }

    // Check for informational intent
    if (this.informationalIntents.some(intent => lowerKeyword.includes(intent))) {
      return 'informational';
    }

    // Check for transactional intent
    if (lowerKeyword.includes('play') || lowerKeyword.includes('game') ||
        lowerKeyword.includes('download') || lowerKeyword.includes('online')) {
      return 'transactional';
    }

    // Default to informational for content-based queries
    return 'informational';
  }

  private isQuestion(keyword: string): boolean {
    const lowerKeyword = keyword.toLowerCase();

    // Check if it starts with a question word
    const startsWithQuestion = this.questionWords.some(word =>
      lowerKeyword.startsWith(word + ' ') || lowerKeyword === word
    );

    // Check if it contains question indicators
    const hasQuestionIndicators = lowerKeyword.includes('?') ||
      lowerKeyword.includes('how to') ||
      lowerKeyword.includes('what is') ||
      lowerKeyword.includes('where to');

    return startsWithQuestion || hasQuestionIndicators;
  }

  private categorizeKeyword(keyword: string): string {
    const lowerKeyword = keyword.toLowerCase();

    // Game-specific categories
    if (lowerKeyword.includes('unblocked') || lowerKeyword.includes('school')) {
      return 'unblocked-games';
    }

    if (lowerKeyword.includes('online') || lowerKeyword.includes('play')) {
      return 'online-games';
    }

    if (lowerKeyword.includes('roblox')) {
      return 'roblox-games';
    }

    if (lowerKeyword.includes('mobile') || lowerKeyword.includes('phone') || lowerKeyword.includes('android') || lowerKeyword.includes('ios')) {
      return 'mobile-games';
    }

    if (lowerKeyword.includes('free') || lowerKeyword.includes('no download')) {
      return 'free-games';
    }

    if (lowerKeyword.includes('download') || lowerKeyword.includes('install')) {
      return 'download-games';
    }

    // Content categories
    if (this.isQuestion(keyword)) {
      return 'questions';
    }

    return 'general';
  }

  private calculatePriority(searchVolume: number, difficulty: number, cpc: number): number {
    // Priority score: higher search volume, lower difficulty, higher CPC = higher priority
    const volumeScore = Math.log(Math.max(searchVolume, 1)) / Math.log(10000); // Normalize 0-1
    const difficultyScore = (100 - difficulty) / 100; // Lower difficulty = higher score
    const cpcScore = Math.min(cpc / 2, 1); // Cap CPC influence at $2

    // Weighted formula: 50% volume, 30% difficulty, 20% CPC
    return (volumeScore * 0.5) + (difficultyScore * 0.3) + (cpcScore * 0.2);
  }

  identifyQuestions(keywords: Keyword[]): Keyword[] {
    return keywords.filter(keyword => keyword.isQuestion)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  prioritizeKeywords(keywords: Keyword[]): Keyword[] {
    return keywords
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, 200); // Return top 200 keywords
  }

  assignKeywordsToPages(
    keywords: Keyword[],
    pages: string[]
  ): PageKeywords[] {
    const prioritizedKeywords = this.prioritizeKeywords(keywords);
    const questionKeywords = this.identifyQuestions(keywords);

    return pages.map((page, index) => {
      // Assign primary keyword based on page index
      const primaryKeyword = prioritizedKeywords[index] || prioritizedKeywords[0] || this.getDefaultKeyword();

      // Assign 2-3 secondary keywords
      const startIndex = (index * 3) + 1;
      const secondaryKeywords = prioritizedKeywords
        .slice(startIndex, startIndex + 3)
        .filter(kw => kw.keyword !== primaryKeyword.keyword);

      // Assign related questions
      const relatedQuestions = questionKeywords
        .slice(index * 2, (index * 2) + 2)
        .map(kw => kw.keyword);

      return {
        path: page,
        primaryKeyword,
        secondaryKeywords: secondaryKeywords.length > 0 ? secondaryKeywords : [this.getDefaultKeyword()],
        relatedQuestions
      };
    });
  }

  private getDefaultKeyword(): Keyword {
    return {
      keyword: 'steal a brainrot',
      searchVolume: 1000,
      keywordDifficulty: 30,
      cpc: 0.5,
      intent: 'informational',
      isQuestion: false,
      priority: 0.5
    };
  }

  generatePageMetadata(pageKeywords: PageKeywords): { title: string; description: string } {
    const { primaryKeyword, secondaryKeywords } = pageKeywords;

    // Generate title (50-60 characters)
    let title = '';
    const pageTitle = pageKeywords.title;
    if (pageTitle) {
      title = pageTitle.length > 60 ? pageTitle.substring(0, 57) + '...' : pageTitle;
    } else {
      title = `${primaryKeyword.keyword.charAt(0).toUpperCase() + primaryKeyword.keyword.slice(1)} - Play Free Online`;
      if (title.length > 60) {
        title = title.substring(0, 57) + '...';
      }
    }

    // Generate description (150-160 characters)
    let description = '';
    const pageDescription = pageKeywords.description;
    if (pageDescription) {
      description = pageDescription.length > 160 ? pageDescription.substring(0, 157) + '...' : pageDescription;
    } else {
      description = `Play ${primaryKeyword.keyword} online for free! ${secondaryKeywords[0] ? `Enjoy ${secondaryKeywords[0].keyword} and other exciting brainrot games.` : 'The ultimate brainrot gaming experience.'}`;
      if (description.length > 160) {
        description = description.substring(0, 157) + '...';
      }
    }

    return { title, description };
  }
}

export default KeywordProcessor;