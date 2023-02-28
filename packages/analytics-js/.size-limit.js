/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Core - CDN',
    path: 'dist/legacy/iife/index.js',
    gzip: true,
    limit: '38 kB',
  },
  {
    name: 'Core - NPM',
    path: 'dist/legacy/esm/index.js',
    gzip: true,
    limit: '37.5 kB',
  },
];
