const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const envConfigPath = path.resolve(__dirname, '../src/env-config.js');

// Read the env-config.js file
fs.readFile(envConfigPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading env-config.js:', err);
    return;
  }

  // Replace placeholders with actual environment variables
  const result = data
    .replace(/\${WRITE_KEY}/g, process.env.NG_APP_RUDDERSTACK_WRITE_KEY || '')
    .replace(/\${DATAPLANE_URL}/g, process.env.NG_APP_RUDDERSTACK_DATAPLANE_URL || '');

  // Write the processed content back to the file
  fs.writeFile(envConfigPath, result, 'utf8', (err) => {
    if (err) {
      console.error('Error writing env-config.js:', err);
      return;
    }
    console.log('Environment variables replaced in env-config.js');
  });
}); 
