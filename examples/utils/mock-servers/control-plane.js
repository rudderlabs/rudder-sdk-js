const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.MOCK_CONTROL_PORT || 8001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mock source configuration response
const mockSourceConfig = {
  "source": {
    "id": "mock-source-id",
    "name": "Mock Source for Sample Apps",
    "writeKey": "test-write-key",
    "config": {
      "statsCollection": {
        "errors": { "enabled": false },
        "metrics": { "enabled": false }
      }
    },
    "enabled": true,
    "workspaceId": "mock-workspace-id",
    "destinations": [],
    "updatedAt": new Date().toISOString()
  },
  "updatedAt": new Date().toISOString(),
  "consentManagementMetadata": {
    "providers": []
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mock-control-plane' });
});

// Source configuration endpoint
app.get('/sourceConfig', (req, res) => {
  console.log(`[Mock Control Plane] Source config requested for writeKey: ${req.query.writeKey || 'undefined'}`);
  res.json(mockSourceConfig);
});

// Catch all other routes
app.use('*', (req, res) => {
  console.log(`[Mock Control Plane] Unhandled request: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not found' });
});

const server = app.listen(port, () => {
  console.log(`🎭 Mock Control Plane server running on http://localhost:${port}`);
  console.log(`   Health check: http://localhost:${port}/health`);
  console.log(`   Source config: http://localhost:${port}/sourceConfig`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Mock Control Plane received SIGTERM, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Mock Control Plane received SIGINT, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = server;