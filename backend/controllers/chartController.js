const Chart = require('../models/chart');

// Create a new chart
exports.createChart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { title, content, isPublic } = req.body;
    
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }
    
    const chart = await Chart.create(req.session.user.id, title, content, isPublic);
    
    res.status(201).json({
      message: 'Chart created successfully',
      chart
    });
  } catch (error) {
    console.error('Chart creation error:', error);
    res.status(500).json({ message: 'Server error during chart creation' });
  }
};

// Get all charts for current user
exports.getUserCharts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const charts = await Chart.findByUserId(req.session.user.id);
    
    res.json({ charts });
  } catch (error) {
    console.error('Get charts error:', error);
    res.status(500).json({ message: 'Server error while fetching charts' });
  }
};

// Get a chart by ID
exports.getChartById = async (req, res) => {
  try {
    const chart = await Chart.findById(req.params.id);
    
    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }
    
    // Check if user is authorized to view this chart
    if (!chart.public && (!req.session.user || chart.user_id !== req.session.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this chart' });
    }
    
    res.json({ chart });
  } catch (error) {
    console.error('Get chart error:', error);
    res.status(500).json({ message: 'Server error while fetching chart' });
  }
};

// Get a chart by share ID
exports.getChartByShareId = async (req, res) => {
  try {
    const chart = await Chart.findByShareId(req.params.shareId);
    
    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }
    
    // Only return public charts or charts owned by the current user
    if (!chart.public && (!req.session.user || chart.user_id !== req.session.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this chart' });
    }
    
    res.json({ chart });
  } catch (error) {
    console.error('Get shared chart error:', error);
    res.status(500).json({ message: 'Server error while fetching shared chart' });
  }
};

// Update a chart
exports.updateChart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const { title, content, isPublic } = req.body;
    
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }
    
    // Check if chart exists and belongs to user
    const chart = await Chart.findById(req.params.id);
    
    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }
    
    if (chart.user_id !== req.session.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this chart' });
    }
    
    const result = await Chart.update(req.params.id, title, content, isPublic);
    
    res.json({
      message: 'Chart updated successfully',
      changes: result.changes
    });
  } catch (error) {
    console.error('Update chart error:', error);
    res.status(500).json({ message: 'Server error during chart update' });
  }
};

// Delete a chart
exports.deleteChart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Check if chart exists and belongs to user
    const chart = await Chart.findById(req.params.id);
    
    if (!chart) {
      return res.status(404).json({ message: 'Chart not found' });
    }
    
    if (chart.user_id !== req.session.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this chart' });
    }
    
    const result = await Chart.delete(req.params.id);
    
    res.json({
      message: 'Chart deleted successfully',
      changes: result.changes
    });
  } catch (error) {
    console.error('Delete chart error:', error);
    res.status(500).json({ message: 'Server error during chart deletion' });
  }
};
