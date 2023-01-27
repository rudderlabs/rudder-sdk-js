/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core - CDN',
    path: 'dist/legacy/rudder-analytics.min.js',
    gzip: true,
    limit: '38 kB',
  },
  {
    name: 'Core - CDN (modern only)',
    path: 'dist/modern/rudder-analytics.min.js',
    gzip: true,
    limit: '35 kB',
  },
  {
    name: 'All Integrations - CDN',
    path: 'dist/legacy/js-integrations/*.min.js',
    gzip: true,
    limit: '672.543 kB',
  },
  {
    name: 'All Integrations - CDN (modern only)',
    path: 'dist/modern/js-integrations/*.min.js',
    gzip: true,
    limit: '531.15 kB',
  },
  {
    name: 'Core - NPM',
    path: 'dist/npm-lib/index.js',
    gzip: true,
    limit: '37 kB',
  },
  {
    name: 'Service Worker - NPM',
    path: 'dist/npm-lib/service-worker/index.js',
    gzip: true,
    limit: '26 kB',
  },
];
