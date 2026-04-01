/**
 * Main Application Module
 * Orchestrates the brain map application
 */

import { processSources } from './pdf-fetcher.js';
import { analyzeText, generateConceptGraph } from './analyzer.js';
import { createBrainMap, exportAsPNG } from './visualizer.js';

// Application state
const state = {
  sources: [],
  analysis: null,
  brainMap: null
};

// DOM Elements
const elements = {};

/**
 * Initialize the application
 */
export function init() {
  // Cache DOM elements
  elements.urlInput = document.getElementById('url-input');
  elements.addUrlBtn = document.getElementById('add-url-btn');
  elements.pdfInput = document.getElementById('pdf-input');
  elements.sourcesUl = document.getElementById('sources-ul');
  elements.sourceCount = document.getElementById('source-count');
  elements.analyzeBtn = document.getElementById('analyze-btn');
  elements.vizSection = document.getElementById('viz-section');
  elements.loadingSection = document.getElementById('loading-section');
  elements.loadingText = document.getElementById('loading-text');
  elements.brainMap = document.getElementById('brain-map');
  elements.tooltip = document.getElementById('tooltip');
  elements.exportBtn = document.getElementById('export-btn');
  elements.resetBtn = document.getElementById('reset-btn');
  elements.newAnalysisBtn = document.getElementById('new-analysis-btn');
  
  // Stats elements
  elements.statSources = document.getElementById('stat-sources');
  elements.statConcepts = document.getElementById('stat-concepts');
  elements.statThemes = document.getElementById('stat-themes');
  elements.statDominant = document.getElementById('stat-dominant');
  elements.interestsList = document.getElementById('interests-list');
  elements.themesCloud = document.getElementById('themes-cloud');
  elements.psychProfile = document.getElementById('psych-profile');
  elements.contentPatterns = document.getElementById('content-patterns');
  
  // Set up event listeners
  setupEventListeners();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Add URL button
  elements.addUrlBtn.addEventListener('click', handleAddUrl);
  
  // URL input enter key
  elements.urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleAddUrl();
    }
  });
  
  // PDF file input
  elements.pdfInput.addEventListener('change', handlePdfUpload);
  
  // Analyze button
  elements.analyzeBtn.addEventListener('click', handleAnalyze);
  
  // Export button
  elements.exportBtn.addEventListener('click', () => {
    exportAsPNG(elements.brainMap, 'mind-brain-map.png');
  });
  
  // Reset view button
  elements.resetBtn.addEventListener('click', () => {
    if (state.brainMap) {
      state.brainMap.resetView();
    }
  });
  
  // New analysis button
  elements.newAnalysisBtn.addEventListener('click', resetToInput);
}

/**
 * Handle adding a URL
 */
function handleAddUrl() {
  const url = elements.urlInput.value.trim();
  
  if (!url) {
    showNotification('Please enter a valid URL', 'error');
    return;
  }
  
  // Basic URL validation
  try {
    new URL(url);
  } catch {
    showNotification('Please enter a valid URL with http:// or https://', 'error');
    return;
  }
  
  // Check for duplicates
  if (state.sources.some(s => s.type === 'url' && s.source === url)) {
    showNotification('This URL has already been added', 'warning');
    return;
  }
  
  // Add source
  state.sources.push({
    type: 'url',
    source: url,
    name: url
  });
  
  // Clear input
  elements.urlInput.value = '';
  
  // Update UI
  updateSourcesList();
}

/**
 * Handle PDF file upload
 */
function handlePdfUpload(event) {
  const files = Array.from(event.target.files);
  
  for (const file of files) {
    if (file.type !== 'application/pdf') {
      showNotification(`${file.name} is not a PDF file`, 'error');
      continue;
    }
    
    // Check for duplicates by name and size
    if (state.sources.some(s => 
      s.type === 'pdf' && 
      s.source.name === file.name && 
      s.source.size === file.size
    )) {
      showNotification(`${file.name} has already been added`, 'warning');
      continue;
    }
    
    // Add source
    state.sources.push({
      type: 'pdf',
      source: file,
      name: file.name
    });
  }
  
  // Reset file input
  elements.pdfInput.value = '';
  
  // Update UI
  updateSourcesList();
}

/**
 * Remove a source
 * @param {number} index - Index of source to remove
 */
function removeSource(index) {
  state.sources.splice(index, 1);
  updateSourcesList();
}

/**
 * Update the sources list UI
 */
function updateSourcesList() {
  elements.sourcesUl.innerHTML = '';
  elements.sourceCount.textContent = state.sources.length;
  
  state.sources.forEach((source, index) => {
    const li = document.createElement('li');
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'source-name';
    nameSpan.textContent = `${source.type === 'pdf' ? '📄' : '🌐'} ${source.name}`;
    nameSpan.title = source.name;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-source';
    removeBtn.innerHTML = '&times;';
    removeBtn.title = 'Remove';
    removeBtn.addEventListener('click', () => removeSource(index));
    
    li.appendChild(nameSpan);
    li.appendChild(removeBtn);
    elements.sourcesUl.appendChild(li);
  });
  
  // Enable/disable analyze button
  elements.analyzeBtn.disabled = state.sources.length === 0;
}

/**
 * Handle the analyze action
 */
async function handleAnalyze() {
  if (state.sources.length === 0) {
    showNotification('Please add at least one source', 'error');
    return;
  }
  
  // Show loading
  elements.vizSection.style.display = 'none';
  elements.loadingSection.style.display = 'block';
  elements.loadingText.textContent = 'Fetching and processing content...';
  
  try {
    // Process all sources
    const { combinedText, sourceDetails } = await processSources(state.sources);
    
    if (!combinedText || combinedText.trim().length === 0) {
      throw new Error('No meaningful content could be extracted from the sources');
    }
    
    // Update loading message
    elements.loadingText.textContent = 'Analyzing content patterns...';
    
    // Small delay to show progress
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Analyze text
    elements.loadingText.textContent = 'Generating brain map...';
    const analysis = analyzeText(combinedText);
    state.analysis = analysis;
    
    // Generate graph
    const graphData = generateConceptGraph(analysis);
    
    // Create visualization
    elements.loadingSection.style.display = 'none';
    elements.vizSection.style.display = 'grid';
    
    state.brainMap = createBrainMap(elements.brainMap, graphData);
    
    // Update insights
    updateInsights(analysis, sourceDetails);
    
  } catch (error) {
    console.error('Analysis error:', error);
    elements.loadingSection.style.display = 'none';
    showNotification(`Analysis failed: ${error.message}`, 'error');
  }
}

/**
 * Update the insights panel
 * @param {Object} analysis - Analysis results
 * @param {Array} sourceDetails - Source details
 */
function updateInsights(analysis, sourceDetails) {
  // Update stats
  elements.statSources.textContent = sourceDetails.filter(s => !s.error).length;
  elements.statConcepts.textContent = analysis.topWords.length;
  elements.statThemes.textContent = Object.values(analysis.themes).filter(v => v > 20).length;
  elements.statDominant.textContent = analysis.dominantTrait.charAt(0).toUpperCase() + 
                                       analysis.dominantTrait.slice(1);
  
  // Update interests list
  elements.interestsList.innerHTML = '';
  const maxFrequency = Math.max(...analysis.topWords.map(w => w.count), 1);
  
  analysis.topWords.slice(0, 10).forEach(item => {
    const li = document.createElement('li');
    
    const wordSpan = document.createElement('span');
    wordSpan.textContent = item.word;
    
    const barContainer = document.createElement('div');
    barContainer.style.flex = '1';
    barContainer.style.marginLeft = '0.75rem';
    barContainer.style.position = 'relative';
    
    const bar = document.createElement('div');
    bar.className = 'frequency-bar';
    bar.style.width = `${(item.count / maxFrequency) * 100}%`;
    bar.style.minWidth = '30px';
    
    const countSpan = document.createElement('span');
    countSpan.textContent = item.count;
    countSpan.style.fontSize = '0.8rem';
    countSpan.style.color = 'var(--text-secondary)';
    countSpan.style.marginLeft = '0.5rem';
    
    barContainer.appendChild(bar);
    li.appendChild(wordSpan);
    li.appendChild(barContainer);
    li.appendChild(countSpan);
    
    elements.interestsList.appendChild(li);
  });
  
  // Update themes cloud
  elements.themesCloud.innerHTML = '';
  const themeEmojis = {
    technology: '💻',
    science: '🔬',
    business: '💼',
    health: '❤️',
    arts: '🎨',
    society: '🌍'
  };
  
  Object.entries(analysis.themes)
    .filter(([_, score]) => score > 20)
    .sort((a, b) => b[1] - a[1])
    .forEach(([theme, score]) => {
      const tag = document.createElement('span');
      tag.className = 'theme-tag';
      tag.innerHTML = `${themeEmojis[theme] || '📌'} ${theme} <strong>${score}%</strong>`;
      elements.themesCloud.appendChild(tag);
    });
  
  // Update psychological profile
  elements.psychProfile.innerHTML = '';
  const traitDescriptions = {
    analytical: 'Thinks logically and systematically',
    creative: 'Shows imaginative thinking patterns',
    practical: 'Focuses on applications and results',
    social: 'Values connections and relationships',
    ambitious: 'Goal-oriented and driven',
    curious: 'Demonstrates desire to learn'
  };
  
  Object.entries(analysis.psychological)
    .sort((a, b) => b[1] - a[1])
    .forEach(([trait, score]) => {
      const barContainer = document.createElement('div');
      barContainer.className = 'trait-bar';
      
      const nameSpan = document.createElement('span');
      nameSpan.className = 'trait-name';
      nameSpan.textContent = trait.charAt(0).toUpperCase() + trait.slice(1);
      
      const progress = document.createElement('div');
      progress.className = 'trait-progress';
      
      const fill = document.createElement('div');
      fill.className = 'trait-fill';
      fill.style.width = `${score}%`;
      
      const valueSpan = document.createElement('span');
      valueSpan.className = 'trait-value';
      valueSpan.textContent = `${score}%`;
      
      progress.appendChild(fill);
      barContainer.appendChild(nameSpan);
      barContainer.appendChild(progress);
      barContainer.appendChild(valueSpan);
      
      elements.psychProfile.appendChild(barContainer);
    });
  
  // Update content patterns
  elements.contentPatterns.innerHTML = `
    <div class="pattern-item">
      <div class="pattern-label">Total Words</div>
      <div class="pattern-value">${analysis.stats.totalWords.toLocaleString()}</div>
    </div>
    <div class="pattern-item">
      <div class="pattern-label">Unique Words</div>
      <div class="pattern-value">${analysis.stats.uniqueWords.toLocaleString()}</div>
    </div>
    <div class="pattern-item">
      <div class="pattern-label">Vocabulary Richness</div>
      <div class="pattern-value">${analysis.stats.lexicalDiversity}/10</div>
    </div>
    <div class="pattern-item">
      <div class="pattern-label">Avg Word Length</div>
      <div class="pattern-value">${analysis.stats.avgWordLength} chars</div>
    </div>
  `;
}

/**
 * Reset to input section
 */
function resetToInput() {
  state.analysis = null;
  state.brainMap = null;
  elements.vizSection.style.display = 'none';
  document.querySelector('.input-section').style.display = 'block';
  
  // Clear brain map container
  elements.brainMap.innerHTML = '';
}

/**
 * Show a notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning)
 */
function showNotification(message, type = 'info') {
  // Simple alert for now - could be enhanced with a toast system
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#6366f1'
  };
  
  // Create temporary notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type] || colors.info};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
