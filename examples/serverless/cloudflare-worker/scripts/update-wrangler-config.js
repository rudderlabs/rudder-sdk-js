// A simple script to update wrangler.toml with environment variables from .env
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const wranglerConfigPath = path.join(__dirname, '../wrangler.toml');

// Read the existing config
let wranglerConfig = fs.readFileSync(wranglerConfigPath, 'utf8');

// Replace the placeholders with environment variables
wranglerConfig = wranglerConfig.replace(/RUDDERSTACK_WRITE_KEY\s*=\s*".*"/g, `RUDDERSTACK_WRITE_KEY = "${process.env.RUDDERSTACK_WRITE_KEY}"`);
wranglerConfig = wranglerConfig.replace(/RUDDERSTACK_DATAPLANE_URL\s*=\s*".*"/g, `RUDDERSTACK_DATAPLANE_URL = "${process.env.RUDDERSTACK_DATAPLANE_URL}"`);

// Write the updated config back
fs.writeFileSync(wranglerConfigPath, wranglerConfig);

console.log('✅ Wrangler configuration updated successfully with values from .env file'); 
