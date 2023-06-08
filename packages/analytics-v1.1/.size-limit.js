/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core - CDN - v1.1',
    path: 'dist/legacy/rudder-analytics.min.js',
    gzip: true,
    limit: '36.82 kB',
  },
  {
    name: 'All Integrations - CDN - v1.1',
    path: 'dist/legacy/js-integrations/*.min.js',
    gzip: true,
    limit: '391 kB',
  },
  {
    name: 'Core - NPM - v1.1',
    path: 'dist/npm-lib/index.js',
    gzip: true,
    limit: '36.7 kB',
  },
  {
    name: 'Service Worker - NPM - v1.1',
    path: 'dist/npm-lib/service-worker/index.js',
    gzip: true,
    limit: '28.5 kB',
  },
];
