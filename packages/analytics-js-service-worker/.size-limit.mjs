/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 *
 * When a limit does need raising, set it to at least 10% above the measured
 * size. Limits raised to just above the current size make the next unrelated
 * change fail this check, and the bundle then grows one bump at a time with no
 * review of the trend.
 */
export default [
  {
    name: 'Service Worker - Legacy - NPM (ESM)',
    path: 'dist/npm/legacy/esm/index.mjs',
    import: '*',
    limit: '38 KiB',
  },
  {
    name: 'Service Worker - Legacy - NPM (CJS)',
    path: 'dist/npm/legacy/cjs/index.cjs',
    import: '*',
    limit: '38 KiB',
  },
  {
    name: 'Service Worker - Legacy - NPM (UMD)',
    path: 'dist/npm/legacy/umd/index.js',
    import: '*',
    limit: '38 KiB',
  },
  {
    name: 'Service Worker - Modern - NPM (ESM)',
    path: 'dist/npm/modern/esm/index.mjs',
    import: '*',
    limit: '33 KiB',
  },
  {
    name: 'Service Worker - Modern - NPM (CJS)',
    path: 'dist/npm/modern/cjs/index.cjs',
    import: '*',
    limit: '33.5 KiB',
  },
  {
    name: 'Service Worker - Modern - NPM (UMD)',
    path: 'dist/npm/modern/umd/index.js',
    import: '*',
    limit: '33 KiB',
  },
];
