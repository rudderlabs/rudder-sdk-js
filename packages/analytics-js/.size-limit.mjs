/**
 * DO NOT EDIT the size limits configured in this file.
 * Should you update them, please contact CODEOWNERS.
 */
export default [
  {
    name: 'Core - Legacy - NPM (ESM)',
    path: 'dist/npm/legacy/esm/index.mjs',
    import: '*',
    limit: '48 KiB',
  },
  {
    name: 'Core - Legacy - NPM (CJS)',
    path: 'dist/npm/legacy/cjs/index.cjs',
    import: '*',
    limit: '48 KiB',
  },
  {
    name: 'Core - Legacy - NPM (UMD)',
    path: 'dist/npm/legacy/umd/index.js',
    import: '*',
    limit: '48 KiB',
  },
  {
    name: 'Core - Legacy - CDN',
    path: 'dist/cdn/legacy/iife/rsa.min.js',
    limit: '48 KiB',
  },
  {
    name: 'Core - Modern - NPM (ESM)',
    path: 'dist/npm/modern/esm/index.mjs',
    import: '*',
    limit: '27 KiB',
  },
  {
    name: 'Core - Modern - NPM (CJS)',
    path: 'dist/npm/modern/cjs/index.cjs',
    import: '*',
    limit: '27.2 KiB',
  },
  {
    name: 'Core - Modern - NPM (UMD)',
    path: 'dist/npm/modern/umd/index.js',
    import: '*',
    limit: '27 KiB',
  },
  {
    name: 'Core - Modern - CDN',
    path: 'dist/cdn/modern/iife/rsa.min.js',
    limit: '27.5 KiB',
  },
  {
    name: 'Core (Bundled) - Legacy - NPM (ESM)',
    path: 'dist/npm/legacy/bundled/esm/index.mjs',
    import: '*',
    limit: '48 KiB',
  },
  {
    name: 'Core (Bundled) - Legacy - NPM (CJS)',
    path: 'dist/npm/legacy/bundled/cjs/index.cjs',
    import: '*',
    limit: '48 KiB',
  },
  {
    name: 'Core (Bundled) - Legacy - NPM (UMD)',
    path: 'dist/npm/legacy/bundled/umd/index.js',
    import: '*',
    limit: '48 KiB',
  },
  {
    name: 'Core (Bundled) - Modern - NPM (ESM)',
    path: 'dist/npm/modern/bundled/esm/index.mjs',
    import: '*',
    limit: '39 KiB',
  },
  {
    name: 'Core (Bundled) - Modern - NPM (CJS)',
    path: 'dist/npm/modern/bundled/cjs/index.cjs',
    import: '*',
    limit: '39.2 KiB',
  },
  {
    name: 'Core (Bundled) - Modern - NPM (UMD)',
    path: 'dist/npm/modern/bundled/umd/index.js',
    import: '*',
    limit: '39 KiB',
  },
  {
    name: 'Core (Content Script) - Legacy - NPM (ESM)',
    path: 'dist/npm/legacy/content-script/esm/index.mjs',
    import: '*',
    limit: '48 KiB',
  },
  {
    name: 'Core (Content Script) - Legacy - NPM (CJS)',
    path: 'dist/npm/legacy/content-script/cjs/index.cjs',
    import: '*',
    limit: '48 KiB',
  },
  {
    name: 'Core (Content Script) - Legacy - NPM (UMD)',
    path: 'dist/npm/legacy/content-script/umd/index.js',
    import: '*',
    limit: '48 KiB',
  },
  {
    name: 'Core (Content Script) - Modern - NPM (ESM)',
    path: 'dist/npm/modern/content-script/esm/index.mjs',
    import: '*',
    limit: '39 KiB',
  },
  {
    name: 'Core (Content Script) - Modern - NPM (CJS)',
    path: 'dist/npm/modern/content-script/cjs/index.cjs',
    import: '*',
    limit: '39.2 KiB',
  },
  {
    name: 'Core (Content Script) - Modern - NPM (UMD)',
    path: 'dist/npm/modern/content-script/umd/index.js',
    import: '*',
    limit: '39 KiB',
  },
];
