/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
module.exports = [
  {
    name: 'Common - No bundling',
    path: 'dist/npm/**/*.js',
    import: '*',
    limit: '6 KiB',
  },
];
