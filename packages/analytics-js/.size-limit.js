/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core Legacy - CDN',
    path: 'dist/legacy/iife/index.js',
    gzip: true,
    limit: '35 kB',
  },
  {
    name: 'Core - NPM',
    path: 'dist/legacy/esm/index.js',
    gzip: true,
    limit: '35 kB',
  },
  {
    name: 'Core - CDN',
    path: 'dist/modern/iife/index.js',
    gzip: true,
    limit: '25 kB',
  }
];
