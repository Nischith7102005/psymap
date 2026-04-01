/**
 * Text Analyzer Module
 * Analyzes text content to extract interests, themes, and psychological patterns
 */

// Stop words to filter out common English words
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
  'she', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose', 'where',
  'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here',
  'there', 'then', 'once', 'if', 'because', 'until', 'while', 'about',
  'against', 'between', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again',
  'further', 'am', 'being', 'your', 'our', 'their', 'my', 'his', 'her'
]);

// Theme categories with associated keywords
const THEME_CATEGORIES = {
  technology: [
    'technology', 'software', 'computer', 'digital', 'internet', 'ai', 'artificial',
    'intelligence', 'machine', 'learning', 'data', 'algorithm', 'code', 'programming',
    'developer', 'app', 'mobile', 'cloud', 'cyber', 'network', 'system', 'automation',
    'robot', 'blockchain', 'crypto', 'virtual', 'reality', 'quantum', 'chip', 'processor'
  ],
  science: [
    'science', 'research', 'study', 'experiment', 'discovery', 'physics', 'chemistry',
    'biology', 'genetics', 'evolution', 'space', 'astronomy', 'climate', 'environment',
    'energy', 'nuclear', 'particle', 'molecule', 'atom', 'theory', 'hypothesis',
    'laboratory', 'scientific', 'innovation', 'breakthrough', 'nature', 'ecosystem'
  ],
  business: [
    'business', 'company', 'market', 'finance', 'investment', 'stock', 'economy',
    'economic', 'trade', 'commerce', 'entrepreneur', 'startup', 'venture', 'capital',
    'profit', 'revenue', 'growth', 'strategy', 'management', 'leadership', 'brand',
    'marketing', 'sales', 'customer', 'industry', 'corporate', 'executive', 'merger'
  ],
  health: [
    'health', 'medical', 'medicine', 'doctor', 'hospital', 'patient', 'treatment',
    'disease', 'therapy', 'wellness', 'fitness', 'nutrition', 'diet', 'exercise',
    'mental', 'psychology', 'healthcare', 'pharmaceutical', 'vaccine', 'surgery',
    'symptom', 'diagnosis', 'prevention', 'immune', 'organic', 'lifestyle', 'aging'
  ],
  arts: [
    'art', 'artist', 'creative', 'design', 'music', 'film', 'movie', 'literature',
    'book', 'author', 'writing', 'poetry', 'painting', 'sculpture', 'photography',
    'theater', 'performance', 'culture', 'museum', 'gallery', 'exhibition', 'style',
    'aesthetic', 'visual', 'media', 'entertainment', 'celebrity', 'fashion', 'dance'
  ],
  society: [
    'society', 'social', 'political', 'government', 'policy', 'law', 'legal',
    'rights', 'justice', 'equality', 'community', 'education', 'school', 'university',
    'student', 'teacher', 'learning', 'history', 'philosophy', 'religion', 'spiritual',
    'ethics', 'morality', 'democracy', 'freedom', 'activism', 'movement', 'reform'
  ]
};

// Psychological indicators based on language patterns
const PSYCHOLOGICAL_PATTERNS = {
  analytical: {
    words: ['analyze', 'analysis', 'logical', 'reason', 'evidence', 'fact', 'prove',
            'conclude', 'deduce', 'systematic', 'method', 'structure', 'pattern', 'cause'],
    description: 'Tends to think logically and systematically'
  },
  creative: {
    words: ['imagine', 'create', 'innovate', 'original', 'unique', 'artistic', 'express',
            'inspire', 'vision', 'dream', 'possibility', 'intuitive', 'metaphor', 'symbol'],
    description: 'Shows creative and imaginative thinking patterns'
  },
  practical: {
    words: ['practical', 'useful', 'efficient', 'effective', 'result', 'outcome', 'apply',
            'implement', 'action', 'solution', 'tool', 'resource', 'manage', 'organize'],
    description: 'Focuses on practical applications and results'
  },
  social: {
    words: ['people', 'together', 'community', 'relationship', 'connect', 'share', 'help',
            'support', 'team', 'collaborate', 'communicate', 'empathy', 'understand', 'care'],
    description: 'Values social connections and relationships'
  },
  ambitious: {
    words: ['achieve', 'success', 'goal', 'ambition', 'excel', 'compete', 'win', 'lead',
            'advance', 'progress', 'improve', 'master', 'excellence', 'determination'],
    description: 'Shows ambition and goal-oriented mindset'
  },
  curious: {
    words: ['curious', 'wonder', 'explore', 'discover', 'learn', 'question', 'investigate',
            'research', 'understand', 'knowledge', 'insight', 'perspective', 'deep', 'complex'],
    description: 'Demonstrates curiosity and desire to learn'
  }
};

/**
 * Tokenize and clean text
 * @param {string} text - Input text
 * @returns {string[]} - Array of cleaned tokens
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Calculate word frequencies
 * @param {string[]} tokens - Array of tokens
 * @returns {Map<string, number>} - Word frequency map
 */
function calculateWordFrequencies(tokens) {
  const frequencies = new Map();
  
  for (const token of tokens) {
    frequencies.set(token, (frequencies.get(token) || 0) + 1);
  }
  
  return frequencies;
}

/**
 * Get top N words by frequency
 * @param {Map<string, number>} frequencies - Word frequency map
 * @param {number} n - Number of top words to return
 * @returns {Array<{word: string, count: number}>}
 */
function getTopWords(frequencies, n = 50) {
  return Array.from(frequencies.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}

/**
 * Analyze theme distribution in text
 * @param {string} text - Input text
 * @returns {Object} - Theme scores
 */
function analyzeThemes(text) {
  const tokens = tokenize(text);
  const tokenSet = new Set(tokens);
  const themeScores = {};
  
  for (const [theme, keywords] of Object.entries(THEME_CATEGORIES)) {
    let score = 0;
    for (const keyword of keywords) {
      if (tokenSet.has(keyword)) {
        score++;
      }
      // Also check for partial matches in original text
      if (text.toLowerCase().includes(keyword)) {
        score += 0.5;
      }
    }
    themeScores[theme] = score;
  }
  
  // Normalize scores
  const maxScore = Math.max(...Object.values(themeScores));
  if (maxScore > 0) {
    for (const theme in themeScores) {
      themeScores[theme] = Math.round((themeScores[theme] / maxScore) * 100);
    }
  }
  
  return themeScores;
}

/**
 * Analyze psychological patterns in text
 * @param {string} text - Input text
 * @returns {Object} - Psychological trait scores
 */
function analyzePsychologicalPatterns(text) {
  const tokens = tokenize(text);
  const tokenSet = new Set(tokens);
  const traitScores = {};
  
  for (const [trait, data] of Object.entries(PSYCHOLOGICAL_PATTERNS)) {
    let score = 0;
    for (const word of data.words) {
      if (tokenSet.has(word)) {
        score += 2;
      }
      if (text.toLowerCase().includes(word)) {
        score += 1;
      }
    }
    traitScores[trait] = Math.min(score, 100); // Cap at 100
  }
  
  // Normalize to percentage
  const maxScore = Math.max(...Object.values(traitScores), 1);
  for (const trait in traitScores) {
    traitScores[trait] = Math.round((traitScores[trait] / maxScore) * 100);
  }
  
  return traitScores;
}

/**
 * Calculate content statistics
 * @param {string} text - Input text
 * @returns {Object} - Content statistics
 */
function calculateContentStats(text) {
  const tokens = tokenize(text);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  const uniqueWords = new Set(tokens);
  const avgWordLength = tokens.reduce((sum, word) => sum + word.length, 0) / (tokens.length || 1);
  const avgSentenceLength = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  return {
    totalWords: words.length,
    uniqueWords: uniqueWords.size,
    vocabularyRichness: Math.round((uniqueWords.size / (words.length || 1)) * 100),
    avgWordLength: avgWordLength.toFixed(1),
    avgSentenceLength: sentenceCount > 0 ? Math.round(words.length / sentenceCount) : 0,
    lexicalDiversity: Math.round((uniqueWords.size / (words.length || 1)) * 1000) / 10
  };
}

/**
 * Main analysis function
 * @param {string} text - Input text to analyze
 * @returns {Object} - Complete analysis results
 */
export function analyzeText(text) {
  if (!text || text.trim().length === 0) {
    throw new Error('No text provided for analysis');
  }
  
  const tokens = tokenize(text);
  const frequencies = calculateWordFrequencies(tokens);
  const topWords = getTopWords(frequencies, 30);
  const themes = analyzeThemes(text);
  const psychological = analyzePsychologicalPatterns(text);
  const stats = calculateContentStats(text);
  
  // Find dominant theme and trait
  const dominantTheme = Object.entries(themes)
    .sort((a, b) => b[1] - a[1])[0];
  
  const dominantTrait = Object.entries(psychological)
    .sort((a, b) => b[1] - a[1])[0];
  
  return {
    topWords,
    themes,
    psychological,
    stats,
    dominantTheme: dominantTheme ? dominantTheme[0] : 'unknown',
    dominantTrait: dominantTrait ? dominantTrait[0] : 'unknown',
    totalTokens: tokens.length
  };
}

/**
 * Generate concept relationships for the brain map
 * @param {Object} analysis - Analysis results
 * @returns {Array} - Nodes and links for visualization
 */
export function generateConceptGraph(analysis) {
  const nodes = [];
  const links = [];
  
  // Central node
  nodes.push({
    id: 'center',
    label: 'Your Mind',
    group: 'center',
    value: 50,
    type: 'center'
  });
  
  // Add theme nodes
  const themeColors = {
    technology: '#3b82f6',
    science: '#10b981',
    business: '#f59e0b',
    health: '#ef4444',
    arts: '#8b5cf6',
    society: '#ec4899'
  };
  
  for (const [theme, score] of Object.entries(analysis.themes)) {
    if (score > 20) { // Only include significant themes
      nodes.push({
        id: `theme-${theme}`,
        label: theme.charAt(0).toUpperCase() + theme.slice(1),
        group: 'theme',
        value: score / 2,
        type: 'theme',
        color: themeColors[theme],
        score: score
      });
      
      links.push({
        source: 'center',
        target: `theme-${theme}`,
        value: score
      });
    }
  }
  
  // Add top concept nodes connected to relevant themes
  const conceptColors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f472b6'];
  
  analysis.topWords.slice(0, 20).forEach((item, index) => {
    const nodeId = `concept-${item.word}`;
    
    // Find most relevant theme for this concept
    let bestTheme = null;
    let bestScore = 0;
    
    for (const [theme, keywords] of Object.entries(THEME_CATEGORIES)) {
      const keywordMatch = keywords.some(k => 
        item.word.includes(k) || k.includes(item.word)
      );
      if (keywordMatch && analysis.themes[theme] > bestScore) {
        bestScore = analysis.themes[theme];
        bestTheme = theme;
      }
    }
    
    nodes.push({
      id: nodeId,
      label: item.word,
      group: 'concept',
      value: Math.min(item.count * 3, 30),
      type: 'concept',
      color: conceptColors[index % conceptColors.length],
      frequency: item.count,
      relatedTheme: bestTheme
    });
    
    // Connect to center
    links.push({
      source: 'center',
      target: nodeId,
      value: item.count
    });
    
    // Connect to relevant theme if found
    if (bestTheme) {
      links.push({
        source: `theme-${bestTheme}`,
        target: nodeId,
        value: item.count / 2
      });
    }
  });
  
  // Add some cross-links between related concepts
  for (let i = 0; i < Math.min(10, analysis.topWords.length - 1); i++) {
    const word1 = analysis.topWords[i].word;
    const word2 = analysis.topWords[i + 1].word;
    
    // Check if they share a theme
    const node1 = nodes.find(n => n.id === `concept-${word1}`);
    const node2 = nodes.find(n => n.id === `concept-${word2}`);
    
    if (node1 && node2 && node1.relatedTheme && node1.relatedTheme === node2.relatedTheme) {
      links.push({
        source: `concept-${word1}`,
        target: `concept-${word2}`,
        value: Math.min(node1.frequency, node2.frequency) / 3
      });
    }
  }
  
  return { nodes, links };
}
