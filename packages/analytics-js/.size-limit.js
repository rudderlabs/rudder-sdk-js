/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core - NPM',
    path: 'dist/npm/modern/esm/index.js',
    gzip: true,
    limit: '25 kB',
  },
  {
    name: 'Core Legacy - CDN',
    path: 'dist/cdn/legacy/iife/rudder-analytics.min.js',
    gzip: true,
    limit: '37 kB',
  },
  {
    name: 'Core - CDN',
    path: 'dist/cdn/modern/iife/rudder-analytics.min.js',
    gzip: true,
    limit: '25 kB',
  },
];
