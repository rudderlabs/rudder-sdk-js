import path from 'path';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import { visualizer } from 'rollup-plugin-visualizer';
import filesize from 'rollup-plugin-filesize';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import * as dotenv from 'dotenv';
import pkg from './package.json' with { type: 'json' };

dotenv.config({ quiet: true });
const isLegacyBuild = process.env.BROWSERSLIST_ENV !== 'modern';
const variantSubfolder = isLegacyBuild ? '/legacy' : '/modern';
const sourceMapType =
  process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true';
const outDirNpmRoot = `dist/npm`;
const outDirCDNRoot = `dist/cdn`;
const outDirNpm = `${outDirNpmRoot}${variantSubfolder}`;
const outDirCDN = `${outDirCDNRoot}${variantSubfolder}/plugins`;
const distName = 'rsa-plugins';
const modName = 'rudderAnalyticsRemotePlugins';
const remotePluginsExportsFilename = `${distName}.js`;
/**
 * A function that determines the file name of an exposed plugin in the CDN bundle. The SDK
 * imports the plugins by this name, so it is fixed (also `.min` in unminified builds).
 * @param {string} exposeKey Expose key of the plugin, e.g. `./BeaconQueue`
 * @returns {string} The file name, e.g. `rsa-plugins-remote-BeaconQueue.min.js`
 */
const getRemotePluginFileName = exposeKey => `${distName}-remote-${exposeKey.slice(2)}.min.js`;
const moduleType = process.env.MODULE_TYPE || 'cdn';
const isNpmPackageBuild = moduleType === 'npm';
const isCDNPackageBuild = moduleType === 'cdn';
const pluginsMap = {
  './BeaconQueue': './src/beaconQueue/index.ts',
  './CustomConsentManager': './src/customConsentManager/index.ts',
  './DeviceModeDestinations': './src/deviceModeDestinations/index.ts',
  './DeviceModeTransformation': './src/deviceModeTransformation/index.ts',
  './ExternalAnonymousId': './src/externalAnonymousId/index.ts',
  './GoogleLinker': './src/googleLinker/index.ts',
  './IubendaConsentManager': './src/iubendaConsentManager/index.ts',
  './KetchConsentManager': './src/ketchConsentManager/index.ts',
  './NativeDestinationQueue': './src/nativeDestinationQueue/index.ts',
  './OneTrustConsentManager': './src/oneTrustConsentManager/index.ts',
  './StorageEncryption': './src/storageEncryption/index.ts',
  './StorageEncryptionLegacy': './src/storageEncryptionLegacy/index.ts',
  './StorageMigrator': './src/storageMigrator/index.ts',
  './XhrQueue': './src/xhrQueue/index.ts',
};

// Resolve the workspace packages to their sources
export const sourceAliasEntries = [
  {
    find: '@rudderstack/analytics-js-plugins',
    replacement: path.resolve('../analytics-js-plugins/src'),
  },
  {
    find: '@rudderstack/analytics-js-common',
    replacement: path.resolve('../analytics-js-common/src'),
  },
  {
    find: '@rudderstack/analytics-js-cookies',
    replacement: path.resolve('../analytics-js-cookies/src'),
  },
  {
    find: '@rudderstack/analytics-js-integrations',
    replacement: path.resolve('../analytics-js-integrations/src'),
  },
];

/**
 * A function that returns the Rollup configuration shared by the builds of the package
 * @param {string} distName Name of the bundle, used in the visualizer stats
 * @param {object} [options]
 * @param {boolean} [options.forVite] The configuration is for the CDN remote built by Vite
 * (vite.config.mjs) with @module-federation/vite. Vite provides aliasing, node resolution,
 * CommonJS and JSON support itself, so those plugins are skipped
 * @returns {import('rollup').RollupOptions} The Rollup configuration
 */
export function getDefaultConfig(distName, { forVite = false } = {}) {
  const version = process.env.VERSION || 'dev-snapshot';
  const isLocalServerEnabled = isCDNPackageBuild && process.env.DEV_SERVER;

  return {
    watch: {
      include: ['src/**'],
    },
    external: [...Object.keys(pkg.peerDependencies || {})],
    onwarn(warning, warn) {
      // Silence 'this' has been rewritten to 'undefined' warning
      // https://rollupjs.org/guide/en/#error-this-is-undefined
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return;
      }

      warn(warning);
    },
    plugins: [
      replace({
        preventAssignment: true,
        __PACKAGE_VERSION__: `'${version}'`,
        __MODULE_TYPE__: `'${moduleType}'`,
        __RS_BUGSNAG_RELEASE_STAGE__: `'${process.env.BUGSNAG_RELEASE_STAGE || 'production'}'`,
      }),
      !forVite && alias({ entries: sourceAliasEntries }),
      !forVite &&
        resolve({
          jsnext: true,
          browser: true,
          preferBuiltins: false,
          extensions: ['.js', '.ts', '.mjs'],
        }),
      { ...nodePolyfills({ include: ['crypto'] }), enforce: 'pre' },
      !forVite &&
        commonjs({
          include: /node_modules/,
          requireReturnsDefault: 'auto',
        }),
      !forVite && json(),
      typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
      babel({
        compact: true,
        babelHelpers: 'bundled',
        exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
        extensions: [...DEFAULT_EXTENSIONS, '.ts'],
        sourcemap: sourceMapType,
      }),
      process.env.UGLIFY === 'true' &&
        terser({
          safari10: isLegacyBuild,
          ecma: isLegacyBuild ? 2015 : 2017,
          format: {
            comments: false,
          },
        }),
      filesize({
        showBrotliSize: true,
      }),
      process.env.VISUALIZER === 'true' &&
        visualizer({
          filename: `./stats/${distName}.html`,
          title: `Rollup Visualizer - ${distName}`,
          sourcemap: true,
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      isLocalServerEnabled &&
        serve({
          contentBase: ['dist'],
          host: 'localhost',
          port: 3002,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }),
      isLocalServerEnabled && livereload(),
    ],
  };
}

const outputFilesNpm = [
  {
    entryFileNames: `index.mjs`,
    dir: outDirNpm + '/esm/',
    format: 'esm',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
  {
    entryFileNames: `index.cjs`,
    dir: outDirNpm + '/cjs',
    format: 'cjs',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
  {
    entryFileNames: `index.js`,
    dir: outDirNpm + '/umd',
    format: 'umd',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
];

const outputFilesCdn = [
  {
    chunkFileNames: `${distName}-[name]${process.env.UGLIFY === 'true' ? '.min' : ''}.js`,
    dir: outDirCDN,
    format: 'esm',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
    // This will merge generated code chunks for common code based on provided logic
    manualChunks: function (id) {
      if (id.includes('shared-chunks')) {
        // file name without extension
        return path.basename(id).split('.')[0];
      }
    },
  },
];

const buildConfig = () => {
  return {
    ...getDefaultConfig(distName),
  };
};

/**
 * A function that returns the Rollup build entries: the npm bundles (npm builds only) and the
 * bundled type declarations
 * @returns {import('rollup').RollupOptions[]} The Rollup configurations
 */
const buildEntries = () => {
  // The CDN (federated remote) bundle is built by `vite build` (see vite.config.mjs), which also
  // emits the declarations to dist/dts; Rollup then only bundles those declarations.
  const bundleEntries = isCDNPackageBuild
    ? []
    : [
        {
          ...buildConfig(),
          input: 'src/index.ts',
          output: outputFilesNpm,
        },
      ];

  return [
    ...bundleEntries,
    {
      input: `dist/dts/packages/analytics-js-plugins/src/index.d.ts`,
      plugins: [
        alias({
          entries: [
            {
              find: '@rudderstack/analytics-js-plugins',
              replacement: path.resolve('./dist/dts/packages/analytics-js-plugins/src'),
            },
            {
              find: '@rudderstack/analytics-js-common',
              replacement: path.resolve('./dist/dts/packages/analytics-js-common/src'),
            },
            {
              find: '@rudderstack/analytics-js-cookies',
              replacement: path.resolve('./dist/dts/packages/analytics-js-cookies/src'),
            },
            {
              find: '@rudderstack/analytics-js-integrations',
              replacement: path.resolve('./dist/dts/packages/analytics-js-integrations/src'),
            },
          ],
        }),
        dts(),
        del({ hook: 'buildEnd', targets: './dist/dts' }),
      ],
      output: [
        {
          file: `${outDirNpmRoot}/index.d.mts`,
          format: 'es',
        },
        {
          file: `${outDirNpmRoot}/index.d.cts`,
          format: 'es',
        },
      ],
    },
  ];
};

export {
  distName,
  modName,
  remotePluginsExportsFilename,
  getRemotePluginFileName,
  pluginsMap,
  outDirCDN,
  outputFilesCdn,
  sourceMapType,
  isLegacyBuild,
};

// A function, so that importing this file from vite.config.mjs does not instantiate the plugins
export default () => buildEntries();
