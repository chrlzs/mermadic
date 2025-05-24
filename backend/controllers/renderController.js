const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const util = require('util');

// Promisify exec
const execPromise = util.promisify(exec);

// Cache directory
const CACHE_DIR = path.join(__dirname, '../cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Generate a hash for the diagram content
function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Render Mermaid diagram on the server
exports.renderDiagram = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Diagram content is required' });
    }

    // Generate a hash for the content to use as a cache key
    const contentHash = generateHash(content);
    const svgFilePath = path.join(CACHE_DIR, `${contentHash}.svg`);

    // Check if we have a cached version
    if (fs.existsSync(svgFilePath)) {
      console.log('Serving cached diagram:', contentHash);
      const svg = fs.readFileSync(svgFilePath, 'utf8');
      return res.json({ svg });
    }

    // Create a temporary file for the Mermaid content
    const tempFilePath = path.join(CACHE_DIR, `${contentHash}.mmd`);
    fs.writeFileSync(tempFilePath, content);

    // Use mermaid-cli to render the diagram
    // Note: This requires mermaid-cli to be installed on the server
    // npm install -g @mermaid-js/mermaid-cli
    try {
      await execPromise(`npx mmdc -i ${tempFilePath} -o ${svgFilePath} -b transparent`);

      // Read the generated SVG
      const svg = fs.readFileSync(svgFilePath, 'utf8');

      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);

      return res.json({ svg });
    } catch (execError) {
      console.error('Error rendering diagram with mermaid-cli:', execError);

      // If mermaid-cli fails, fall back to a simpler approach using puppeteer
      // This is a placeholder - in a real implementation, you would use puppeteer
      // to render the diagram in a headless browser
      return res.status(500).json({
        message: 'Error rendering diagram',
        error: execError.message,
        fallback: true
      });
    }
  } catch (error) {
    console.error('Error in renderDiagram:', error);
    res.status(500).json({ message: 'Server error during diagram rendering' });
  }
};

// Alternative implementation using Node.js Mermaid library
exports.renderDiagramWithLibrary = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Diagram content is required' });
    }

    // Generate a hash for the content to use as a cache key
    const contentHash = generateHash(content);
    const svgFilePath = path.join(CACHE_DIR, `${contentHash}.svg`);

    // Check if we have a cached version
    if (fs.existsSync(svgFilePath)) {
      console.log('Serving cached diagram:', contentHash);
      const svg = fs.readFileSync(svgFilePath, 'utf8');
      return res.json({ svg });
    }

    // If mermaid library is available, use it to render
    // Note: This requires mermaid to be installed on the server
    // npm install mermaid
    try {
      // This is a placeholder - in a real implementation, you would use the mermaid library
      // to render the diagram
      const mermaid = require('mermaid');

      // Configure mermaid
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'default'
      });

      // Render the diagram
      const { svg } = await mermaid.render(`diagram-${contentHash}`, content);

      // Cache the result
      fs.writeFileSync(svgFilePath, svg);

      return res.json({ svg });
    } catch (renderError) {
      console.error('Error rendering diagram with mermaid library:', renderError);
      return res.status(500).json({
        message: 'Error rendering diagram',
        error: renderError.message,
        fallback: true
      });
    }
  } catch (error) {
    console.error('Error in renderDiagramWithLibrary:', error);
    res.status(500).json({ message: 'Server error during diagram rendering' });
  }
};

// Render Mermaid diagram HTML
exports.renderDiagramHtml = async (req, res) => {
  try {
    const { content, title } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Diagram content is required' });
    }

    // Generate a hash for the content to use as a cache key
    const contentHash = generateHash(content);

    // Create HTML with Mermaid content
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Mermaid Diagram'}</title>
  <style>
    body {
      font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
      margin-top: 0;
    }
    .mermaid {
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    ${title ? `<h1>${title}</h1>` : ''}
    <div class="zoom-controls">
      <button class="zoom-out" title="Zoom Out">-</button>
      <button class="zoom-reset" title="Reset Zoom">↺</button>
      <button class="zoom-in" title="Zoom In">+</button>
    </div>
    <div id="mermaid-container" class="mermaid-container">
      <div id="mermaid-content" class="mermaid">
${content}
      </div>
    </div>
    <script>
      // Initialize zoom controls when the page loads
      document.addEventListener('DOMContentLoaded', function() {
        // Set current zoom level
        let currentZoom = 1.0;

        // Get zoom control buttons and container
        const zoomInBtn = document.querySelector('.zoom-in');
        const zoomOutBtn = document.querySelector('.zoom-out');
        const zoomResetBtn = document.querySelector('.zoom-reset');
        const mermaidContent = document.getElementById('mermaid-content');

        // Add event listeners
        zoomInBtn.addEventListener('click', () => {
          if (currentZoom < 3.0) {
            currentZoom += 0.25;
            updateZoom();
          }
        });

        zoomOutBtn.addEventListener('click', () => {
          if (currentZoom > 0.5) {
            currentZoom -= 0.25;
            updateZoom();
          }
        });

        zoomResetBtn.addEventListener('click', () => {
          currentZoom = 1.0;
          updateZoom();
        });

        // Update zoom level
        function updateZoom() {
          mermaidContent.style.transform = 'scale(' + currentZoom + ')';
          mermaidContent.style.transformOrigin = 'center center';

          // Update button states
          zoomInBtn.disabled = currentZoom >= 3.0;
          zoomOutBtn.disabled = currentZoom <= 0.5;

          console.log('Current zoom level:', currentZoom);
        }
      });
    </script>
  </div>
  <script src="/js/mermaid.min.js"></script>
  <script src="/js/zoom-controls.js"></script>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Trebuchet MS',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'linear'
      }
    });
  </script>
</body>
</html>`;

    return res.json({ html });
  } catch (error) {
    console.error('Error in renderDiagramHtml:', error);
    res.status(500).json({ message: 'Server error during diagram HTML generation' });
  }
};

// Render Mermaid diagram as a standalone page
exports.renderDiagramPage = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the chart from the database
    const Chart = require('../models/chart');
    const chart = await Chart.findById(id);

    if (!chart) {
      return res.status(404).send('Chart not found');
    }

    // Check if user is authorized to view this chart
    if (!chart.public && (!req.session.user || chart.user_id !== req.session.user.id)) {
      return res.status(403).send('Not authorized to view this chart');
    }

    // Send HTML with Mermaid content
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${chart.title} - Mermadic</title>
  <style>
    body {
      font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
      margin-top: 0;
    }
    .mermaid {
      margin: 20px 0;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 0.9em;
      color: #666;
    }
    .footer a {
      color: #0066cc;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${chart.title}</h1>
    <div class="zoom-controls">
      <button class="zoom-out" title="Zoom Out">-</button>
      <button class="zoom-reset" title="Reset Zoom">↺</button>
      <button class="zoom-in" title="Zoom In">+</button>
    </div>
    <div id="mermaid-container" class="mermaid-container">
      <div id="mermaid-content" class="mermaid">
${chart.content}
      </div>
    </div>
    <script>
      // Initialize zoom controls when the page loads
      document.addEventListener('DOMContentLoaded', function() {
        // Set current zoom level
        let currentZoom = 1.0;

        // Get zoom control buttons and container
        const zoomInBtn = document.querySelector('.zoom-in');
        const zoomOutBtn = document.querySelector('.zoom-out');
        const zoomResetBtn = document.querySelector('.zoom-reset');
        const mermaidContent = document.getElementById('mermaid-content');

        // Add event listeners
        zoomInBtn.addEventListener('click', () => {
          if (currentZoom < 3.0) {
            currentZoom += 0.25;
            updateZoom();
          }
        });

        zoomOutBtn.addEventListener('click', () => {
          if (currentZoom > 0.5) {
            currentZoom -= 0.25;
            updateZoom();
          }
        });

        zoomResetBtn.addEventListener('click', () => {
          currentZoom = 1.0;
          updateZoom();
        });

        // Update zoom level
        function updateZoom() {
          mermaidContent.style.transform = 'scale(' + currentZoom + ')';
          mermaidContent.style.transformOrigin = 'center center';

          // Update button states
          zoomInBtn.disabled = currentZoom >= 3.0;
          zoomOutBtn.disabled = currentZoom <= 0.5;

          console.log('Current zoom level:', currentZoom);
        }
      });
    </script>
    <div class="footer">
      <p>Created with <a href="/">Mermadic</a></p>
    </div>
  </div>
  <script src="/js/mermaid.min.js"></script>
  <script src="/js/zoom-controls.js"></script>
  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Trebuchet MS',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'linear'
      }
    });
  </script>
</body>
</html>`);
  } catch (error) {
    console.error('Error in renderDiagramPage:', error);
    res.status(500).send('Server error during diagram page generation');
  }
};
