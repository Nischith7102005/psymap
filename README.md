# 🧠 MindMap - Brain Map Visualizer

A fully runnable local-first application that converts web links and PDF documents into an interactive brain map visualization representing your inferred interests, themes, and psychological state.

## Features

- **Single File**: Everything contained in one HTML file - no installation required
- **Local-First**: All processing happens in your browser, no data sent to servers
- **Dual Input**: Accepts both web URLs and PDF documents
- **Interactive Visualization**: Force-directed graph with draggable nodes
- **Psychological Analysis**: Infers personality traits from language patterns
- **Theme Detection**: Automatically categorizes content into interest areas
- **Real-time Insights**: Displays statistics and content patterns

## Quick Start

1. Open `mindmap.html` in any modern web browser (Chrome, Firefox, Edge, Safari)
2. Enter a URL or upload a PDF document
3. Watch as your brain map is generated automatically

## How It Works

### Content Analysis
- Extracts text from web pages (via CORS proxy) or PDF files
- Identifies key concepts through word frequency analysis
- Filters out common stopwords for meaningful insights

### Theme Detection
Categorizes content into 6 major themes:
- **Technology**: AI, software, digital innovation
- **Science**: Research, discovery, scientific methods
- **Business**: Strategy, entrepreneurship, finance
- **Health**: Wellness, fitness, mental health
- **Arts**: Creative expression, design, culture
- **Society**: Community, policy, social issues

### Psychological Profiling
Analyzes language patterns to identify 6 personality dimensions:
- **Analytical**: Logical, systematic thinking
- **Creative**: Imaginative, innovative mindset
- **Practical**: Action-oriented, results-focused
- **Social**: Collaborative, community-minded
- **Ambitious**: Goal-driven, achievement-oriented
- **Curious**: Learning-focused, exploratory

### Visualization
- Central node represents your core identity
- Theme nodes branch out based on detected interests
- Concept nodes show specific topics you engage with
- Psychological trait nodes reveal personality indicators
- Node sizes reflect importance/strength
- Colors indicate category membership

## Usage Tips

1. **Multiple Sources**: Add multiple URLs or PDFs to build a comprehensive profile
2. **Drag Nodes**: Interact with the visualization by dragging nodes around
3. **Hover for Details**: Mouse over nodes to see detailed information
4. **Quality Content**: Longer, more detailed content produces better insights
5. **Mix Media Types**: Combine articles and research papers for diverse analysis

## Technical Details

### Dependencies (CDN-loaded)
- [D3.js v7](https://d3js.org/) - Data visualization library
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF text extraction

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Limitations
- Some websites block CORS proxy access (use PDF upload as alternative)
- Very large PDFs may take longer to process
- Requires JavaScript enabled

## File Structure

```
/workspace/
├── mindmap.html    # Complete application (single file)
└── README.md       # This documentation
```

## Privacy

This application runs entirely in your browser:
- No data is sent to external servers (except URL fetching via CORS proxy)
- No cookies or tracking
- No account required
- All analysis happens locally

## License

Free to use, modify, and distribute.

---

**Built for efficiency, simplicity, and easy integration.**
