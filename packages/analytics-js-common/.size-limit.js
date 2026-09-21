/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 *
 * When a limit does need raising, set it to at least 10% above the measured
 * size. Limits raised to just above the current size make the next unrelated
 * change fail this check, and the bundle then grows one bump at a time with no
 * review of the trend.
 */
module.exports = [
  {
    name: 'Common - No bundling',
    path: 'dist/npm/**/*.js',
    import: '*',
    limit: '6.5 KiB',
  },
];
