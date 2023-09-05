/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core (legacy build) - CDN - v1.1',
    path: 'dist/cdn/legacy/rudder-analytics.min.js',
    gzip: true,
    limit: '37.5 KiB',
  },
  {
    name: 'Core - NPM - v1.1',
    path: 'dist/npm/index.js',
    gzip: true,
    limit: '37.5 KiB',
  },
  {
    name: 'Service Worker - NPM - v1.1',
    path: 'dist/npm/service-worker/index.js',
    gzip: true,
    limit: '28 KiB',
  },
];
