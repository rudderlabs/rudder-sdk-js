/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core ESM - NPM',
    path: 'dist/npm/modern/esm/index.js',
    limit: '8 KiB',
  },
  {
    name: 'Core CJS - NPM',
    path: 'dist/npm/modern/cjs/index.js',
    limit: '23 KiB',
  },
  {
    name: 'Core - NPM',
    path: 'dist/npm/modern/umd/index.js',
    limit: '23.5 KiB',
  },
  {
    name: 'Core Legacy - CDN',
    path: 'dist/cdn/legacy/iife/rsa.min.js',
    limit: '44 KiB',
  },
  {
    name: 'Core - CDN',
    path: 'dist/cdn/modern/iife/rsa.min.js',
    limit: '23.5 KiB',
  },
];
