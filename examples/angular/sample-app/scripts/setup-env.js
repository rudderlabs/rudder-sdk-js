const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Get environment variables
const writeKey = process.env.NG_APP_RUDDERSTACK_WRITE_KEY || '';
const dataplaneUrl = process.env.NG_APP_RUDDERSTACK_DATAPLANE_URL || '';
const configUrl = process.env.NG_APP_RUDDERSTACK_CONFIG_URL || '';

// Define the environment files
const envFiles = [
  {
    path: path.resolve(__dirname, '../src/environments/environment.ts'),
    production: false,
  },
  {
    path: path.resolve(__dirname, '../src/environments/environment.prod.ts'),
    production: true,
  },
];

// Update each environment file
envFiles.forEach(file => {
  const envContent = `export const environment = {
  production: ${file.production},
  RUDDERSTACK_WRITE_KEY: '${writeKey}',
  RUDDERSTACK_DATAPLANE_URL: '${dataplaneUrl}',
  RUDDERSTACK_CONFIG_URL: '${configUrl}',
};
`;

  if (!fs.existsSync(path.dirname(file.path))) {
    fs.mkdirSync(path.dirname(file.path));
  }

  fs.writeFileSync(file.path, envContent, 'utf8');
  console.log(`Updated ${path.basename(file.path)} with environment variables`);
});

console.log('Environment files have been configured successfully');
