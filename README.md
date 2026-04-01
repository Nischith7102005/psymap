# 🧠 Mind Brain Map

A fully runnable local-first application that converts web links and PDF documents into an interactive brain map visualization representing your interests, themes, and psychological patterns.

## Features

### Input Sources
- **Web URLs**: Fetch and analyze content from any web article
- **PDF Documents**: Upload and extract text from PDF files
- **Multiple Sources**: Combine multiple URLs and PDFs for comprehensive analysis

### Analysis Engine
- **Word Frequency Analysis**: Identifies key concepts by counting meaningful terms
- **Theme Detection**: Categorizes content into 6 areas:
  - 💻 Technology
  - 🔬 Science
  - 💼 Business
  - ❤️ Health
  - 🎨 Arts
  - 🌍 Society

### Psychological Profiling
Analyzes language patterns to infer 6 personality traits:
- **Analytical**: Logical and systematic thinking
- **Creative**: Imaginative and original patterns
- **Practical**: Focus on applications and results
- **Social**: Values connections and relationships
- **Ambitious**: Goal-oriented mindset
- **Curious**: Desire to learn and explore

### Interactive Visualization
- **Force-Directed Graph**: D3.js powered interactive network diagram
- **Draggable Nodes**: Rearrange the brain map by dragging
- **Tooltips**: Hover over nodes for detailed information
- **Color-Coded Categories**: Visual distinction between themes and concepts
- **Node Sizing**: Size reflects importance/strength of each concept
- **Zoom & Pan**: Navigate large graphs easily

### Insights Dashboard
- Real-time statistics (sources, concepts, themes, dominant trait)
- Primary interests list with frequency counts
- Connected themes visualization
- Psychological indicators with descriptions
- Content pattern analysis (vocabulary richness, word length, etc.)

### Privacy First
- **100% Local Processing**: All analysis happens in your browser
- **No Data Storage**: Nothing is sent to servers or stored persistently
- **Offline Capable**: Works without internet after initial load

## Quick Start

### Prerequisites
- Node.js 18+ (for development)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Open the application** in your browser
2. **Add sources**:
   - Enter a URL and click "Add URL", OR
   - Click "Choose PDF files" to upload PDF documents
3. **Review your sources** in the sources list
4. **Click "Analyze & Generate Brain Map"**
5. **Explore your brain map**:
   - Drag nodes to rearrange
   - Hover over nodes for details
   - Zoom in/out to navigate
   - View insights in the right panel
6. **Export** your brain map as PNG if desired

## Project Structure

```
/workspace
├── index.html          # Main HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── src/
│   ├── main.js         # Application entry point
│   ├── style.css       # Styles
│   ├── pdf-fetcher.js  # PDF and URL fetching
│   ├── analyzer.js     # Text analysis engine
│   └── visualizer.js   # D3.js visualization
├── public/             # Static assets
└── data/               # Optional data storage
```

## Technology Stack

- **Vite**: Fast build tool and dev server
- **D3.js**: Data visualization library
- **PDF.js**: PDF text extraction
- **Vanilla JavaScript**: No heavy frameworks
- **CSS Variables**: Theming and customization

## API Reference

### Analyzer Module (`src/analyzer.js`)

```javascript
import { analyzeText, generateConceptGraph } from './analyzer.js';

// Analyze text content
const analysis = analyzeText(text);
// Returns: { topWords, themes, psychological, stats, dominantTheme, dominantTrait }

// Generate graph data for visualization
const graphData = generateConceptGraph(analysis);
// Returns: { nodes, links }
```

### PDF Fetcher Module (`src/pdf-fetcher.js`)

```javascript
import { processSources } from './pdf-fetcher.js';

// Process multiple sources
const { combinedText, sourceDetails } = await processSources(sources);
// sources: Array<{ type: 'url'|'pdf', source: string|File }>
```

### Visualizer Module (`src/visualizer.js`)

```javascript
import { createBrainMap, exportAsPNG } from './visualizer.js';

// Create brain map
const brainMap = createBrainMap(container, graphData);

// Export as PNG
exportAsPNG(container, 'my-brain-map.png');
```

## Customization

### Theme Colors

Edit CSS variables in `src/style.css`:

```css
:root {
  --primary: #6366f1;      /* Main brand color */
  --secondary: #8b5cf6;    /* Secondary color */
  --bg-primary: #0f172a;   /* Background */
  /* ... more variables */
}
```

### Theme Categories

Modify `THEME_CATEGORIES` in `src/analyzer.js` to customize theme detection keywords.

### Psychological Patterns

Edit `PSYCHOLOGICAL_PATTERNS` in `src/analyzer.js` to adjust trait detection.

## Troubleshooting

### URL Fetching Issues
- Some websites block CORS proxies
- Try alternative URLs or upload as PDF
- Check browser console for specific errors

### PDF Extraction Problems
- Ensure PDF is not password-protected
- Scanned PDFs (images) won't have extractable text
- Check file size limits

### Visualization Not Showing
- Ensure container has dimensions
- Check browser console for errors
- Try refreshing the page

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

- Limit to 5-10 sources for best performance
- Large PDFs (>50 pages) may take longer to process
- Complex graphs with many nodes may be slower to render

## License

MIT License - Feel free to use, modify, and distribute.

## Contributing

Contributions welcome! Areas for improvement:
- Additional theme categories
- More psychological indicators
- Better NLP processing
- Graph layout algorithms
- Export formats (SVG, JSON)

---

**Built with ❤️ for curious minds**
