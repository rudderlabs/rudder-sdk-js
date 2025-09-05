const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.MOCK_DATA_PORT || 8002;

// Enable CORS for all routes
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.text({ type: 'text/plain' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[Mock Data Plane] ${timestamp} ${req.method} ${req.path}`);
  
  if (req.body && Object.keys(req.body).length > 0) {
    // Log first few chars of body for debugging without flooding console
    const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const preview = bodyStr.length > 100 ? bodyStr.substring(0, 100) + '...' : bodyStr;
    console.log(`[Mock Data Plane] Body preview: ${preview}`);
  }
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mock-data-plane' });
});

// Mock successful responses for all RudderStack analytics endpoints
const analyticsEndpoints = ['/v1/track', '/v1/page', '/v1/identify', '/v1/alias', '/v1/group', '/v1/screen'];

analyticsEndpoints.forEach(endpoint => {
  app.post(endpoint, (req, res) => {
    console.log(`[Mock Data Plane] ✅ ${endpoint} event received`);
    
    // Return successful response similar to real RudderStack data plane
    res.status(200).json({
      status: 'ok',
      message: 'Event received successfully',
      timestamp: new Date().toISOString()
    });
  });
});

// Handle batch endpoints
app.post('/v1/batch', (req, res) => {
  const batchData = req.body;
  const eventCount = batchData && batchData.batch ? batchData.batch.length : 0;
  console.log(`[Mock Data Plane] ✅ Batch endpoint - received ${eventCount} events`);
  
  res.status(200).json({
    status: 'ok',
    message: `Batch of ${eventCount} events received successfully`,
    timestamp: new Date().toISOString()
  });
});

// Catch all other routes
app.use('*', (req, res) => {
  console.log(`[Mock Data Plane] ⚠️ Unhandled request: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Endpoint not found' });
});

const server = app.listen(port, () => {
  console.log(`📊 Mock Data Plane server running on http://localhost:${port}`);
  console.log(`   Health check: http://localhost:${port}/health`);
  console.log(`   Analytics endpoints: ${analyticsEndpoints.join(', ')}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Mock Data Plane received SIGTERM, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Mock Data Plane received SIGINT, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = server;