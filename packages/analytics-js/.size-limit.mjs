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
    name: 'Core - Legacy - NPM (ESM)',
    path: 'dist/npm/legacy/esm/index.mjs',
    import: '*',
    limit: '55 KiB',
  },
  {
    name: 'Core - Legacy - NPM (CJS)',
    path: 'dist/npm/legacy/cjs/index.cjs',
    import: '*',
    limit: '55.5 KiB',
  },
  {
    name: 'Core - Legacy - NPM (UMD)',
    path: 'dist/npm/legacy/umd/index.js',
    import: '*',
    limit: '55 KiB',
  },
  {
    name: 'Core - Legacy - CDN',
    path: 'dist/cdn/legacy/iife/rsa.min.js',
    limit: '55 KiB',
  },
  {
    name: 'Core - Modern - NPM (ESM)',
    path: 'dist/npm/modern/esm/index.mjs',
    import: '*',
    limit: '32 KiB',
  },
  {
    name: 'Core - Modern - NPM (CJS)',
    path: 'dist/npm/modern/cjs/index.cjs',
    import: '*',
    limit: '32 KiB',
  },
  {
    name: 'Core - Modern - NPM (UMD)',
    path: 'dist/npm/modern/umd/index.js',
    import: '*',
    limit: '32 KiB',
  },
  {
    name: 'Core - Modern - CDN',
    path: 'dist/cdn/modern/iife/rsa.min.js',
    limit: '32.5 KiB',
  },
  {
    name: 'Core (Bundled) - Legacy - NPM (ESM)',
    path: 'dist/npm/legacy/bundled/esm/index.mjs',
    import: '*',
    limit: '55 KiB',
  },
  {
    name: 'Core (Bundled) - Legacy - NPM (CJS)',
    path: 'dist/npm/legacy/bundled/cjs/index.cjs',
    import: '*',
    limit: '55.5 KiB',
  },
  {
    name: 'Core (Bundled) - Legacy - NPM (UMD)',
    path: 'dist/npm/legacy/bundled/umd/index.js',
    import: '*',
    limit: '55 KiB',
  },
  {
    name: 'Core (Bundled) - Modern - NPM (ESM)',
    path: 'dist/npm/modern/bundled/esm/index.mjs',
    import: '*',
    limit: '46.5 KiB',
  },
  {
    name: 'Core (Bundled) - Modern - NPM (CJS)',
    path: 'dist/npm/modern/bundled/cjs/index.cjs',
    import: '*',
    limit: '47 KiB',
  },
  {
    name: 'Core (Bundled) - Modern - NPM (UMD)',
    path: 'dist/npm/modern/bundled/umd/index.js',
    import: '*',
    limit: '46.5 KiB',
  },
  {
    name: 'Core (Content Script) - Legacy - NPM (ESM)',
    path: 'dist/npm/legacy/content-script/esm/index.mjs',
    import: '*',
    limit: '55 KiB',
  },
  {
    name: 'Core (Content Script) - Legacy - NPM (CJS)',
    path: 'dist/npm/legacy/content-script/cjs/index.cjs',
    import: '*',
    limit: '55.5 KiB',
  },
  {
    name: 'Core (Content Script) - Legacy - NPM (UMD)',
    path: 'dist/npm/legacy/content-script/umd/index.js',
    import: '*',
    limit: '55 KiB',
  },
  {
    name: 'Core (Content Script) - Modern - NPM (ESM)',
    path: 'dist/npm/modern/content-script/esm/index.mjs',
    import: '*',
    limit: '46.5 KiB',
  },
  {
    name: 'Core (Content Script) - Modern - NPM (CJS)',
    path: 'dist/npm/modern/content-script/cjs/index.cjs',
    import: '*',
    limit: '47 KiB',
  },
  {
    name: 'Core (Content Script) - Modern - NPM (UMD)',
    path: 'dist/npm/modern/content-script/umd/index.js',
    import: '*',
    limit: '46.5 KiB',
  },
  {
    name: 'Core (Lite) - Legacy - NPM (ESM)',
    path: 'dist/npm/legacy/lite/esm/index.mjs',
    import: '*',
    limit: '42.5 KiB',
  },
  {
    name: 'Core (Lite) - Legacy - NPM (CJS)',
    path: 'dist/npm/legacy/lite/cjs/index.cjs',
    import: '*',
    limit: '43 KiB',
  },
  {
    name: 'Core (Lite) - Legacy - NPM (UMD)',
    path: 'dist/npm/legacy/lite/umd/index.js',
    import: '*',
    limit: '42.5 KiB',
  },
  {
    name: 'Core (Lite) - Modern - NPM (ESM)',
    path: 'dist/npm/modern/lite/esm/index.mjs',
    import: '*',
    limit: '37.5 KiB',
  },
  {
    name: 'Core (Lite) - Modern - NPM (CJS)',
    path: 'dist/npm/modern/lite/cjs/index.cjs',
    import: '*',
    limit: '37.5 KiB',
  },
  {
    name: 'Core (Lite) - Modern - NPM (UMD)',
    path: 'dist/npm/modern/lite/umd/index.js',
    import: '*',
    limit: '37.5 KiB',
  },
];
