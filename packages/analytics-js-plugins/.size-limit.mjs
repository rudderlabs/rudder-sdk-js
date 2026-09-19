/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 *
 * When a limit does need raising, set it to at least 10% above the measured
 * size. Limits raised to just above the current size make the next unrelated
 * change fail this check, and the bundle then grows one bump at a time with no
 * review of the trend.
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
    limit: '15.5 KiB',
  },
  {
    name: 'Plugins - Modern - CDN',
    path: 'dist/cdn/modern/plugins/rsa-plugins-*.min.js',
    limit: '6.5 KiB',
  },
];
