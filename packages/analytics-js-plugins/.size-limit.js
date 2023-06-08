/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Remote Module Federation Mapping - CDN',
    path: 'dist/cdn/modern/plugins/rudder-analytics-plugins.js',
    gzip: true,
    limit: '0.5 kB',
  },
  {
    name: 'Remote Module Federated Plugins - CDN',
    path: 'dist/cdn/modern/plugins/rudder-analytics-plugins-*.js',
    gzip: true,
    limit: '21 kB',
  },
];
