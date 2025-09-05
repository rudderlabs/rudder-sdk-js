#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting RudderStack Mock Servers for Sample Apps...\n');

// Start control plane server
const controlPlane = spawn('node', [path.join(__dirname, 'control-plane.js')], {
  stdio: 'inherit'
});

// Start data plane server  
const dataPlane = spawn('node', [path.join(__dirname, 'data-plane.js')], {
  stdio: 'inherit'
});

// Handle cleanup on exit
const cleanup = () => {
  console.log('\n🛑 Shutting down mock servers...');
  controlPlane.kill('SIGTERM');
  dataPlane.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Handle child process exits
controlPlane.on('exit', (code) => {
  console.log(`Control plane server exited with code ${code}`);
  if (code !== 0) {
    dataPlane.kill('SIGTERM');
    process.exit(code);
  }
});

dataPlane.on('exit', (code) => {
  console.log(`Data plane server exited with code ${code}`);
  if (code !== 0) {
    controlPlane.kill('SIGTERM');
    process.exit(code);
  }
});

console.log('✅ Both mock servers started successfully!');
console.log('   Control Plane: http://localhost:8001');  
console.log('   Data Plane: http://localhost:8002');
console.log('   Press Ctrl+C to stop all servers\n');