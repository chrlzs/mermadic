// Zoom Controls for Mermaid Diagrams

// Default zoom levels
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;
const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM = 1.0;

// Utility function to remove existing zoom controls
function removeExistingZoomControls(container) {
  // Remove any existing zoom controls that are siblings of the container
  const parent = container.parentNode;
  if (parent) {
    const existingControls = parent.querySelectorAll('.zoom-controls');
    existingControls.forEach(control => control.remove());
  }
}

// Initialize zoom controls for a container
function initZoomControls(containerId, contentId) {
  console.log('Initializing zoom controls for:', containerId, contentId);

  const container = document.getElementById(containerId);
  const content = document.getElementById(contentId);

  if (!container || !content) {
    console.error('Container or content element not found:', containerId, contentId);
    return;
  }

  console.log('Found container and content elements:', container, content);

  // Remove any existing zoom controls first
  removeExistingZoomControls(container);

  // Add zoom controls
  const zoomControls = document.createElement('div');
  zoomControls.className = 'zoom-controls';
  zoomControls.innerHTML = `
    <button class="zoom-out" title="Zoom Out">-</button>
    <button class="zoom-reset" title="Reset Zoom">↺</button>
    <button class="zoom-in" title="Zoom In">+</button>
  `;

  // Insert zoom controls before the container
  container.parentNode.insertBefore(zoomControls, container);

  // Make container zoomable
  container.classList.add('zoomable-container');
  content.classList.add('zoomable-content');

  // Set current zoom level
  let currentZoom = DEFAULT_ZOOM;

  // Get zoom control buttons
  const zoomInBtn = zoomControls.querySelector('.zoom-in');
  const zoomOutBtn = zoomControls.querySelector('.zoom-out');
  const zoomResetBtn = zoomControls.querySelector('.zoom-reset');

  // Add event listeners
  zoomInBtn.addEventListener('click', () => {
    if (currentZoom < MAX_ZOOM) {
      currentZoom += ZOOM_STEP;
      updateZoom();
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    if (currentZoom > MIN_ZOOM) {
      currentZoom -= ZOOM_STEP;
      updateZoom();
    }
  });

  zoomResetBtn.addEventListener('click', () => {
    currentZoom = DEFAULT_ZOOM;
    updateZoom();
  });

  // Update zoom level
  function updateZoom() {
    content.style.transform = `scale(${currentZoom})`;

    // Update button states
    zoomInBtn.disabled = currentZoom >= MAX_ZOOM;
    zoomOutBtn.disabled = currentZoom <= MIN_ZOOM;

    // Log current zoom level
    console.log('Current zoom level:', currentZoom);
  }

  // Initialize zoom
  updateZoom();

  // Return control functions
  return {
    zoomIn: () => {
      if (currentZoom < MAX_ZOOM) {
        currentZoom += ZOOM_STEP;
        updateZoom();
      }
    },
    zoomOut: () => {
      if (currentZoom > MIN_ZOOM) {
        currentZoom -= ZOOM_STEP;
        updateZoom();
      }
    },
    resetZoom: () => {
      currentZoom = DEFAULT_ZOOM;
      updateZoom();
    },
    setZoom: (level) => {
      currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level));
      updateZoom();
    }
  };
}

// Initialize zoom controls for an iframe
function initIframeZoomControls(containerId, iframeId) {
  console.log('Initializing iframe zoom controls for:', containerId, iframeId);

  const container = document.getElementById(containerId);
  const iframe = document.getElementById(iframeId);

  if (!container || !iframe) {
    console.error('Container or iframe element not found:', containerId, iframeId);
    return;
  }

  console.log('Found container and iframe elements:', container, iframe);

  // Remove any existing zoom controls first
  removeExistingZoomControls(container);

  // Add zoom controls
  const zoomControls = document.createElement('div');
  zoomControls.className = 'zoom-controls';
  zoomControls.innerHTML = `
    <button class="zoom-out" title="Zoom Out">-</button>
    <button class="zoom-reset" title="Reset Zoom">↺</button>
    <button class="zoom-in" title="Zoom In">+</button>
  `;

  // Insert zoom controls before the container
  container.parentNode.insertBefore(zoomControls, container);

  // Set current zoom level
  let currentZoom = DEFAULT_ZOOM;

  // Get zoom control buttons
  const zoomInBtn = zoomControls.querySelector('.zoom-in');
  const zoomOutBtn = zoomControls.querySelector('.zoom-out');
  const zoomResetBtn = zoomControls.querySelector('.zoom-reset');

  // Add event listeners
  zoomInBtn.addEventListener('click', () => {
    if (currentZoom < MAX_ZOOM) {
      currentZoom += ZOOM_STEP;
      updateZoom();
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    if (currentZoom > MIN_ZOOM) {
      currentZoom -= ZOOM_STEP;
      updateZoom();
    }
  });

  zoomResetBtn.addEventListener('click', () => {
    currentZoom = DEFAULT_ZOOM;
    updateZoom();
  });

  // Update zoom level
  function updateZoom() {
    try {
      // Try to access the iframe content
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const mermaidDiv = iframeDoc.querySelector('.mermaid');

      if (mermaidDiv) {
        mermaidDiv.style.transform = `scale(${currentZoom})`;
        mermaidDiv.style.transformOrigin = 'center top';
        mermaidDiv.style.display = 'block';
        mermaidDiv.style.margin = '0 auto';
      }

      // Update button states
      zoomInBtn.disabled = currentZoom >= MAX_ZOOM;
      zoomOutBtn.disabled = currentZoom <= MIN_ZOOM;

      // Log current zoom level
      console.log('Current iframe zoom level:', currentZoom);
    } catch (error) {
      console.error('Error updating iframe zoom:', error);
    }
  }

  // Initialize zoom
  // Wait for iframe to load
  iframe.addEventListener('load', () => {
    updateZoom();
  });

  // Return control functions
  return {
    zoomIn: () => {
      if (currentZoom < MAX_ZOOM) {
        currentZoom += ZOOM_STEP;
        updateZoom();
      }
    },
    zoomOut: () => {
      if (currentZoom > MIN_ZOOM) {
        currentZoom -= ZOOM_STEP;
        updateZoom();
      }
    },
    resetZoom: () => {
      currentZoom = DEFAULT_ZOOM;
      updateZoom();
    },
    setZoom: (level) => {
      currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level));
      updateZoom();
    }
  };
}
