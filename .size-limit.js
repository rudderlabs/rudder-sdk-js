/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core - CDN',
    path: 'dist/rudder-analytics.min.js',
    gzip: true,
    limit: '40 kB',
  },
  {
    name: 'All Integrations - CDN',
    path: 'dist/integrations/*.min.js',
    gzip: true,
    limit: '900 kB',
  },
  {
    name: 'Core - NPM',
    path: 'dist/rudder-sdk-js/index.js',
    gzip: true,
    limit: '40 kB',
  },
];
