/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core - CDN',
    path: 'dist/legacy/rudder-analytics.min.js',
    gzip: true,
    limit: '36.93 kB',
  },
  {
    name: 'All Integrations - CDN',
    path: 'dist/legacy/js-integrations/*.min.js',
    gzip: true,
    limit: '415.3 kB',
  },
  {
    name: 'Core - NPM',
    path: 'dist/npm-lib/index.js',
    gzip: true,
    limit: '36.87 kB',
  },
  {
    name: 'Service Worker - NPM',
    path: 'dist/npm-lib/service-worker/index.js',
    gzip: true,
    limit: '29.5 kB',
  },
];
