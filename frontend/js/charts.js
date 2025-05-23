// Chart related functions

// Load user's charts
async function loadUserCharts() {
  try {
    const response = await fetch('/api/charts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load charts');
    }
    
    const data = await response.json();
    return data.charts;
  } catch (error) {
    console.error('Error loading charts:', error);
    return [];
  }
}

// Create a new chart
async function createChart(title, content, isPublic) {
  try {
    const response = await fetch('/api/charts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, content, isPublic })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create chart');
    }
    
    const data = await response.json();
    return data.chart;
  } catch (error) {
    console.error('Error creating chart:', error);
    throw error;
  }
}

// Update an existing chart
async function updateChart(chartId, title, content, isPublic) {
  try {
    const response = await fetch(`/api/charts/${chartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, content, isPublic })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update chart');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating chart:', error);
    throw error;
  }
}

// Delete a chart
async function deleteChart(chartId) {
  try {
    const response = await fetch(`/api/charts/${chartId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete chart');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting chart:', error);
    throw error;
  }
}

// Get a chart by ID
async function getChartById(chartId) {
  try {
    const response = await fetch(`/api/charts/${chartId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to load chart');
    }
    
    const data = await response.json();
    return data.chart;
  } catch (error) {
    console.error('Error loading chart:', error);
    throw error;
  }
}
