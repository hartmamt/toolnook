/**
 * Server for ToolNook.dev
 * Works in both development and production environments
 */

// Explicitly require all dependencies to avoid module resolution issues in Vercel
const express = require('express');
const path = require('path');
const axios = require('axios');

// Safely import optional dependencies
let vary;
try {
  // Explicitly import vary (common middleware dependency)
  vary = require('vary');
  console.log('Vary module loaded successfully');
} catch (e) {
  console.error('Error loading vary module:', e.message);
  // Create a simple vary function as fallback
  vary = function(res, field) {
    if (!res || !field) return;
    const current = res.getHeader('Vary') || '';
    const header = Array.isArray(current) ? current.join(', ') : String(current);
    
    if (header && header.toLowerCase().split(/\s*,\s*/).indexOf(field.toLowerCase()) === -1) {
      res.setHeader('Vary', header ? `${header}, ${field}` : field);
    }
  };
}

const app = express();
const PORT = process.env.PORT || 3000;

// Log dependency versions for debugging
console.log('Express version:', require('express/package.json').version);
console.log('Axios version:', require('axios/package.json').version);
try {
  console.log('Vary version:', require('vary/package.json').version);
} catch (e) {
  console.log('Vary version: fallback implementation');
}

// Middleware for logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Health check route that also validates the vary module is working
app.get('/api/healthcheck', (req, res) => {
  try {
    // Use the vary module to add a header
    vary(res, 'User-Agent');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Get dependency info safely
    const dependencies = {
      express: require('express/package.json').version,
      axios: require('axios/package.json').version
    };
    
    try {
      dependencies.vary = require('vary/package.json').version;
    } catch (e) {
      dependencies.vary = 'fallback implementation';
    }
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      dependencies,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve common assets
app.use('/common', express.static(path.join(__dirname, 'common')));

// Serve individual tools
app.use('/tools', express.static(path.join(__dirname, 'tools')));

// Route for tool paths - serves the tool's index.html
app.get('/tools/:tool', (req, res) => {
  res.sendFile(path.join(__dirname, 'tools', req.params.tool, 'index.html'));
});

// Reference the vary module defined at the top of the file
const varyModule = vary;

// Proxy endpoint for the Meta Tag Analyzer
app.get('/api/proxy', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  try {
    // Add a timeout to prevent long-running requests
    const response = await axios.get(url, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'ToolNook-Meta-Tag-Analyzer/1.0'
      }
    });
    
    // Set headers using vary for better caching behavior
    try {
        varyModule(res, 'Origin');
    } catch (e) {
        console.error('Error using vary module:', e);
        // Fallback implementation if vary module fails
        const current = res.getHeader('Vary') || '';
        const header = Array.isArray(current)
            ? current.join(', ')
            : String(current);
        
        if (header && header.toLowerCase().split(/\s*,\s*/).indexOf('origin') === -1) {
            res.setHeader('Vary', header ? `${header}, Origin` : 'Origin');
        }
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    // Return the HTML content
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch the URL',
      details: error.message
    });
  }
});

// Catch-all route for SPA behavior
app.get('*', (req, res) => {
  // Only redirect unmatched routes to the homepage
  if (!req.path.includes('.')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).send('File not found');
  }
});

// Start the server if not being imported
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ToolNook.dev server running at http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop the server`);
  });
}

// Export the app for serverless environments
module.exports = app;