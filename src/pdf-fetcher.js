// PDF.js worker configuration
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';

/**
 * Extract text from a PDF file
 * @param {File} file - The PDF file to extract text from
 * @returns {Promise<string>} - The extracted text content
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + ' ';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Fetch and extract text from a web URL
 * Uses a CORS proxy to fetch external content
 * @param {string} url - The URL to fetch
 * @returns {Promise<string>} - The extracted text content
 */
export async function fetchWebContent(url) {
  try {
    // Use multiple CORS proxies as fallbacks
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://thingproxy.freeboard.io/fetch/${url}`
    ];
    
    let html = null;
    let lastError = null;
    
    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml'
          }
        });
        
        if (response.ok) {
          html = await response.text();
          break;
        }
      } catch (err) {
        lastError = err;
        continue;
      }
    }
    
    if (!html) {
      throw new Error(lastError || 'All CORS proxies failed');
    }
    
    // Parse HTML and extract text
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove script and style elements
    doc.querySelectorAll('script, style, nav, footer, header, aside').forEach(el => el.remove());
    
    // Get text from main content areas first
    let text = '';
    const mainContent = doc.querySelector('main, article, .content, #content, .post, .article');
    
    if (mainContent) {
      text = mainContent.textContent;
    } else {
      // Fallback to body content
      text = doc.body.textContent;
    }
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Ensure we have meaningful content
    if (text.length < 100) {
      throw new Error('Insufficient content extracted from URL');
    }
    
    return text;
  } catch (error) {
    console.error('Error fetching web content:', error);
    throw new Error(`Failed to fetch content from URL: ${error.message}`);
  }
}

/**
 * Process multiple sources and combine their text
 * @param {Array<{type: string, source: File|string}>} sources - Array of sources
 * @returns {Promise<{combinedText: string, sourceDetails: Array}>} 
 */
export async function processSources(sources) {
  const results = [];
  const sourceDetails = [];
  
  for (const source of sources) {
    try {
      let text;
      let name;
      
      if (source.type === 'pdf') {
        text = await extractTextFromPDF(source.source);
        name = source.source.name;
      } else if (source.type === 'url') {
        text = await fetchWebContent(source.source);
        name = source.source;
      }
      
      results.push(text);
      sourceDetails.push({
        type: source.type,
        name: name,
        wordCount: text.split(/\s+/).length
      });
    } catch (error) {
      console.warn(`Failed to process source ${source.type === 'url' ? source.source : source.source.name}:`, error);
      sourceDetails.push({
        type: source.type,
        name: source.type === 'url' ? source.source : source.source.name,
        error: error.message
      });
    }
  }
  
  return {
    combinedText: results.join('\n\n'),
    sourceDetails
  };
}
