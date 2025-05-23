const express = require('express');
const router = express.Router();
const renderController = require('../controllers/renderController');
const { isAuthenticated } = require('../middleware/auth');

// Render a diagram as SVG
router.post('/svg', renderController.renderDiagram);

// Render a diagram using the Mermaid library
router.post('/library', renderController.renderDiagramWithLibrary);

// Render a diagram as HTML
router.post('/html', renderController.renderDiagramHtml);

// Render a diagram as a standalone page
router.get('/page/:id', renderController.renderDiagramPage);

module.exports = router;
