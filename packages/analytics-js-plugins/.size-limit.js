/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Remote Module Federation Mapping - CDN',
    path: 'dist/modern/remotePlugins.js',
    gzip: true,
    limit: '0.5 kB',
  },
  {
    name: 'Remote Module Federated Plugins - CDN',
    path: 'dist/modern/__federation_expose_*.js',
    gzip: true,
    limit: '20 kB',
  },
];
