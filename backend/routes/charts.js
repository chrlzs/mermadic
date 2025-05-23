const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');
const { isAuthenticated } = require('../middleware/auth');

// Create a new chart
router.post('/', isAuthenticated, chartController.createChart);

// Get all charts for current user
router.get('/', isAuthenticated, chartController.getUserCharts);

// Get a chart by ID
router.get('/:id', chartController.getChartById);

// Get a chart by share ID
router.get('/share/:shareId', chartController.getChartByShareId);

// Update a chart
router.put('/:id', isAuthenticated, chartController.updateChart);

// Delete a chart
router.delete('/:id', isAuthenticated, chartController.deleteChart);

module.exports = router;
