/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
export default [
  {
    name: 'Core ESM - NPM',
    path: 'dist/npm/modern/esm/index.mjs',
    limit: '8 KiB',
  },
  {
    name: 'Core CJS - NPM',
    path: 'dist/npm/modern/cjs/index.cjs',
    limit: '24 KiB',
  },
  {
    name: 'Core - NPM',
    path: 'dist/npm/modern/umd/index.js',
    limit: '24 KiB',
  },
  {
    name: 'Core Legacy - CDN',
    path: 'dist/cdn/legacy/iife/rsa.min.js',
    limit: '47 KiB',
  },
  {
    name: 'Core - CDN',
    path: 'dist/cdn/modern/iife/rsa.min.js',
    limit: '24.5 KiB',
  },
];
