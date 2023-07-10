/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core ESM - NPM',
    path: 'dist/npm/modern/esm/index.js',
    gzip: true,
    limit: '11 kB',
  },
  {
    name: 'Core CJS - NPM',
    path: 'dist/npm/modern/cjs/index.js',
    gzip: true,
    limit: '23.5 kB',
  },
  {
    name: 'Core Legacy - CDN',
    path: 'dist/cdn/legacy/iife/rsa.min.js',
    gzip: true,
    limit: '48 kB',
  },
  {
    name: 'Core - CDN',
    path: 'dist/cdn/modern/iife/rsa.min.js',
    gzip: true,
    limit: '23.5 kB',
  },
];
