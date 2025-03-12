/**
 * Server for ToolNook.dev
 * Works in both development and production environments
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

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