/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core - CDN',
    path: 'dist/legacy/rudder-analytics.min.js',
    gzip: true,
    limit: '39.6 kB',
  },
  {
    name: 'All Integrations - CDN',
    path: 'dist/legacy/js-integrations/*.min.js',
    gzip: true,
    limit: '400 kB',
  },
  {
    name: 'Core - NPM',
    path: 'dist/npm-lib/index.js',
    gzip: true,
    limit: '39.6 kB',
  },
  {
    name: 'Service Worker - NPM',
    path: 'dist/npm-lib/service-worker/index.js',
    gzip: true,
    limit: '28.5 kB',
  },
];
