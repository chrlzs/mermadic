// Chart related functions

// Load user's charts
async function getAllCharts() {
  try {
    // Check if user is authenticated
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      console.warn('User not authenticated, redirecting to login');
      window.location.href = '/login.html';
      return [];
    }

    const response = await fetch('/api/charts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include cookies for session authentication
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized error
        console.warn('Session expired, redirecting to login');
        localStorage.removeItem('user'); // Clear invalid user data
        window.location.href = '/login.html?session=expired';
        return [];
      }
      throw new Error('Failed to load charts');
    }

    const data = await response.json();
    return data.charts || [];
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
      credentials: 'include', // Include cookies for session authentication
      body: JSON.stringify({ title, content, isPublic })
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized error
        console.warn('Session expired, redirecting to login');
        localStorage.removeItem('user'); // Clear invalid user data
        window.location.href = '/login.html?session=expired';
        throw new Error('Session expired');
      }
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
      credentials: 'include', // Include cookies for session authentication
      body: JSON.stringify({ title, content, isPublic })
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized error
        console.warn('Session expired, redirecting to login');
        localStorage.removeItem('user'); // Clear invalid user data
        window.location.href = '/login.html?session=expired';
        throw new Error('Session expired');
      }
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
      },
      credentials: 'include' // Include cookies for session authentication
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized error
        console.warn('Session expired, redirecting to login');
        localStorage.removeItem('user'); // Clear invalid user data
        window.location.href = '/login.html?session=expired';
        throw new Error('Session expired');
      }
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
  // If no chartId is provided, throw an error
  if (!chartId) {
    throw new Error('Chart ID is required');
  }
  try {
    const response = await fetch(`/api/charts/${chartId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include cookies for session authentication
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized error
        console.warn('Session expired, redirecting to login');
        localStorage.removeItem('user'); // Clear invalid user data
        window.location.href = '/login.html?session=expired';
        throw new Error('Session expired');
      }
      throw new Error('Failed to load chart');
    }

    const data = await response.json();
    return data.chart;
  } catch (error) {
    console.error('Error loading chart:', error);
    throw error;
  }
}

// Expose functions to global scope
window.getAllCharts = getAllCharts;
window.createChart = createChart;
window.updateChart = updateChart;
window.deleteChart = deleteChart;
window.getChartById = getChartById;
