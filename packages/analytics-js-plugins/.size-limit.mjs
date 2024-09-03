/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
export default [
  {
    name: 'Plugins Module Federation Mapping - Legacy - CDN',
    path: 'dist/cdn/legacy/plugins/rsa-plugins.js',
    limit: '0.5 KiB',
  },
  {
    name: 'Plugins Module Federation Mapping - Modern - CDN',
    path: 'dist/cdn/modern/plugins/rsa-plugins.js',
    limit: '0.5 KiB',
  },
  {
    name: 'Plugins - Legacy - CDN',
    path: 'dist/cdn/legacy/plugins/rsa-plugins-*.min.js',
    limit: '17.5 KiB',
  },
  {
    name: 'Plugins - Modern - CDN',
    path: 'dist/cdn/modern/plugins/rsa-plugins-*.min.js',
    limit: '7.5 KiB',
  },
];
