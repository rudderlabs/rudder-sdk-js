/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core (v1.1) - NPM (ESM)',
    path: 'dist/npm/index.es.js',
    import: '*',
    limit: '32 KiB',
  },
  {
    name: 'Core (v1.1) - NPM (CJS)',
    path: 'dist/npm/index.cjs.js',
    import: '*',
    limit: '32 KiB',
  },
  {
    name: 'Core (v1.1) - NPM (UMD)',
    path: 'dist/npm/index.js',
    import: '*',
    limit: '32 KiB',
  },
  {
    name: 'Core (Content Script - v1.1) - NPM (ESM)',
    path: 'dist/npm/content-script/index.es.js',
    import: '*',
    limit: '30.5 KiB',
  },
  {
    name: 'Core (Content Script - v1.1) - NPM (CJS)',
    path: 'dist/npm/content-script/index.cjs.js',
    import: '*',
    limit: '30.5 KiB',
  },
  {
    name: 'Core (Content Script - v1.1) - NPM (UMD)',
    path: 'dist/npm/content-script/index.js',
    import: '*',
    limit: '30 KiB',
  },
  {
    name: 'Core - Legacy - CDN',
    path: 'dist/cdn/legacy/rudder-analytics.min.js',
    limit: '32 KiB',
  },
  {
    name: 'Core - Modern - CDN',
    path: 'dist/cdn/modern/rudder-analytics.min.js',
    limit: '32 KiB',
  },
];
