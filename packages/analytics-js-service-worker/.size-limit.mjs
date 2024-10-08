/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
export default [
  {
    name: 'Service Worker - Legacy - NPM (ESM)',
    path: 'dist/npm/legacy/esm/index.mjs',
    import: '*',
    limit: '31 KiB',
  },
  {
    name: 'Service Worker - Legacy - NPM (CJS)',
    path: 'dist/npm/legacy/cjs/index.cjs',
    import: '*',
    limit: '31 KiB',
  },
  {
    name: 'Service Worker - Legacy - NPM (UMD)',
    path: 'dist/npm/legacy/umd/index.js',
    import: '*',
    limit: '31 KiB',
  },
  {
    name: 'Service Worker - Modern - NPM (ESM)',
    path: 'dist/npm/modern/esm/index.mjs',
    import: '*',
    limit: '26 KiB',
  },
  {
    name: 'Service Worker - Modern - NPM (CJS)',
    path: 'dist/npm/modern/cjs/index.cjs',
    import: '*',
    limit: '26.5 KiB',
  },
  {
    name: 'Service Worker - Modern - NPM (UMD)',
    path: 'dist/npm/modern/umd/index.js',
    import: '*',
    limit: '26 KiB',
  },
];
