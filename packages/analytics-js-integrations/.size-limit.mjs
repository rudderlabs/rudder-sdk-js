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
    name: 'All Integrations - Legacy - CDN',
    path: 'dist/cdn/legacy/js-integrations/*.min.js',
    limit: '111 KiB',
  },
  {
    name: 'All Integrations - Modern - CDN',
    path: 'dist/cdn/modern/js-integrations/*.min.js',
    limit: '102.5 KiB',
  },
];
