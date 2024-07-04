/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
export default [
  {
    name: 'Service Worker Module ESM - NPM',
    path: 'dist/npm/esm/index.mjs',
    limit: '24 KiB',
  },
  {
    name: 'Service Worker Module CJS - NPM',
    path: 'dist/npm/cjs/index.cjs',
    limit: '24 KiB',
  },
  {
    name: 'Service Worker Module NPM',
    path: 'dist/npm/umd/index.js',
    limit: '25 KiB',
  },
];
