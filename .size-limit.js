/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core - CDN',
    path: 'dist/rudder-analytics.min.js',
    gzip: true,
    limit: '41 kB',
  },
  {
    name: 'All Integrations - CDN',
    path: 'dist/integrations/*.min.js',
    gzip: true,
    limit: '625 kB',
  },
  {
    name: 'Core - NPM',
    path: 'dist/rudder-sdk-js/index.js',
    gzip: true,
    limit: '41 kB',
  },
  {
    name: 'Service Worker - NPM',
    path: 'dist/rudder-sdk-js/service-worker/index.js',
    gzip: true,
    limit: '30 kB',
  },
];
