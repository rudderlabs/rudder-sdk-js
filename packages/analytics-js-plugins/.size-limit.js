/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Remote Plugins - CDN',
    path: 'dist/modern/remotePlugins.js',
    gzip: true,
    limit: '0.5 kB',
  },
  {
    name: 'Remote Plugins - CDN',
    path: 'dist/modern/__federation_expose_*.js',
    gzip: true,
    limit: '11 kB',
  },
];
