/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
export default [
  {
    name: 'Cookies Utils - Legacy - NPM (ESM)',
    path: 'dist/npm/legacy/esm/index.mjs',
    import: "*",
    limit: '2 KiB',
  },
  {
    name: 'Cookies Utils - Legacy - NPM (CJS)',
    path: 'dist/npm/legacy/cjs/index.cjs',
    import: "*",
    limit: '2 KiB',
  },
  {
    name: 'Cookies Utils - Legacy - NPM (UMD)',
    path: 'dist/npm/legacy/umd/index.js',
    import: "*",
    limit: '2 KiB',
  },
  {
    name: 'Cookies Utils - Modern - NPM (ESM)',
    path: 'dist/npm/modern/esm/index.mjs',
    import: "*",
    limit: '1.5 KiB',
  },
  {
    name: 'Cookies Utils - Modern - NPM (CJS)',
    path: 'dist/npm/modern/cjs/index.cjs',
    import: "*",
    limit: '1.5 KiB',
  },
  {
    name: 'Cookies Utils - Modern - NPM (UMD)',
    path: 'dist/npm/modern/umd/index.js',
    import: "*",
    limit: '1.5 KiB',
  }
];
