/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 *
 * When a limit does need raising, set it to at least 10% above the measured
 * size. Limits raised to just above the current size make the next unrelated
 * change fail this check, and the bundle then grows one bump at a time with no
 * review of the trend.
 */
module.exports = [
  {
    name: 'Core (v1.1) - NPM (ESM)',
    path: 'dist/npm/index.es.js',
    import: '*',
    limit: '33 KiB',
  },
  {
    name: 'Core (v1.1) - NPM (CJS)',
    path: 'dist/npm/index.cjs.js',
    import: '*',
    limit: '33.5 KiB',
  },
  {
    name: 'Core (v1.1) - NPM (UMD)',
    path: 'dist/npm/index.js',
    import: '*',
    limit: '33 KiB',
  },
  {
    name: 'Core (Content Script - v1.1) - NPM (ESM)',
    path: 'dist/npm/content-script/index.es.js',
    import: '*',
    limit: '32.5 KiB',
  },
  {
    name: 'Core (Content Script - v1.1) - NPM (CJS)',
    path: 'dist/npm/content-script/index.cjs.js',
    import: '*',
    limit: '32.5 KiB',
  },
  {
    name: 'Core (Content Script - v1.1) - NPM (UMD)',
    path: 'dist/npm/content-script/index.js',
    import: '*',
    limit: '32.5 KiB',
  },
  {
    name: 'Core (v1.1) - Legacy - CDN',
    path: 'dist/cdn/legacy/rudder-analytics.min.js',
    limit: '34.5 KiB',
  },
  {
    name: 'Core (v1.1) - Modern - CDN',
    path: 'dist/cdn/modern/rudder-analytics.min.js',
    limit: '33 KiB',
  },
];
