import { readdir } from 'fs/promises';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import del from 'rollup-plugin-delete';
import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });

const SERVER_PORT = 3003;
const baseCdnUrl = process.env.BASE_CDN_URL ? process.env.BASE_CDN_URL.replace(/\/+$/, '') : 'https://cdn.rudderlabs.com';
const DEFAULT_SDK_VERSION = 'v3';

const sdkVersion = process.env.SDK_VERSION || DEFAULT_SDK_VERSION;
const isLegacySdk = sdkVersion === 'v1.1';
const cdnVersionPath = `${process.env.SDK_CDN_VERSION_PATH_PREFIX || ''}${sdkVersion}`;
const isDMT = process.env.IS_DMT === 'true';
const isDevEnvTestBook = process.env.IS_DEV_TESTBOOK === 'true';
const distributionType = process.env.DISTRIBUTION_TYPE || 'cdn';
const buildType = process.env.BUILD_TYPE || 'legacy';

const randomId = Math.random().toString(36).slice(2, 10);
const declarationDir = `./dist/dts-${sdkVersion}-${distributionType}-${randomId}`;

const getDirectoryNames = async sourcePath =>
  (await readdir(sourcePath, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

const featuresList = await getDirectoryNames(`./public/${sdkVersion}`);

const getDistPath = () => `dist/${sdkVersion}/${distributionType}`;

const getHTMLSource = featureName => {
  const folderPath = featureName ? `public/${sdkVersion}/${featureName}/` : `public/${sdkVersion}/`;

  switch (distributionType) {
    case 'cdn':
      return `${folderPath}index-cdn.html`;
    case 'npm':
      return `${folderPath}index-npm.html`;
    case 'npm_bundled':
      return `${folderPath}index-npm-bundled.html`;
    default:
      return `${folderPath}index-local.html`;
  }
};

const getJSSource = () => {
  switch (distributionType) {
    case 'npm':
      return isLegacySdk ? 'src/index-npm-v1.1.ts' : 'src/index-npm.ts';
    case 'npm_bundled':
      return 'src/index-npm-bundled.ts';
    case 'cdn':
    default:
      return 'src/index.ts';
  }
};

const getDestinationSDKBaseURL = () => {
  if (process.env.DEST_SDK_BASE_URL) {
    return process.env.DEST_SDK_BASE_URL || '';
  }

  switch (distributionType) {
    case 'cdn':
      return ''; // This is automatically determined in the HTML page
    case 'npm':
      return isLegacySdk
        ? `${baseCdnUrl}/${cdnVersionPath}/js-integrations/`
        : `${baseCdnUrl}/${cdnVersionPath}/${buildType}/js-integrations/`;
    case 'npm_bundled':
      return `${baseCdnUrl}/${cdnVersionPath}/${buildType}/js-integrations/`;
    default:
      return `http://localhost:${SERVER_PORT}/js-integrations/`;
  }
};

const getPluginsBaseURL = () => {
  if (process.env.PLUGINS_SDK_BASE_URL) {
    return process.env.PLUGINS_SDK_BASE_URL || '';
  }

  switch (distributionType) {
    case 'cdn':
      return ''; // This is automatically determined in the HTML page
    case 'npm_bundled':
      return ''; // This is not needed for npm_bundled
    case 'npm':
      return `${baseCdnUrl}/${cdnVersionPath}/${buildType}/plugins/`;
    default:
      return `http://localhost:${SERVER_PORT}/plugins/`;
  }
};

const getCopyTargets = () => {
  // Remove the allAggregatorCopy from copy targets; it will be handled by htmlTemplate now
  switch (distributionType) {
    case 'cdn':
      return [];
    case 'npm':
    case 'npm_bundled':
      return [];
    default:
      const baseCopyTargets = isLegacySdk
        ? [
            {
              src: `../analytics-v1.1/dist/cdn/${buildType}/rudder-analytics.min.js`,
              dest: getDistPath(),
              rename: 'rudder-analytics.min.js',
            },
            {
              src: `../analytics-v1.1/dist/cdn/${buildType}/rudder-analytics.min.js.map`,
              dest: getDistPath(),
              rename: 'rudder-analytics.min.js.map',
            },
            {
              src: `../analytics-js-integrations/dist/cdn/${buildType}/js-integrations/*`,
              dest: `${getDistPath()}/js-integrations`,
            },
          ]
        : [
            {
              src: `../analytics-js/dist/cdn/${buildType}/iife/rsa.min.js`,
              dest: getDistPath(),
              rename: 'rsa.min.js',
            },
            {
              src: `../analytics-js/dist/cdn/${buildType}/iife/rsa.min.js.map`,
              dest: getDistPath(),
              rename: 'rsa.min.js.map',
            },
            {
              src: `../analytics-js-integrations/dist/cdn/${buildType}/js-integrations/*`,
              dest: `${getDistPath()}/js-integrations`,
            },
            {
              src: `../analytics-js-plugins/dist/cdn/${buildType}/plugins/*`,
              dest: `${getDistPath()}/plugins`,
            },
          ];
      return baseCopyTargets;
  }
};

const getBuildConfig = featureName => ({
  watch: {
    include: ['src/**'],
  },
  external: [],
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
      __PACKAGE_VERSION__: `'${sdkVersion}'`,
      __MODULE_TYPE__: `'${distributionType}'`,
      WRITE_KEY: process.env.WRITE_KEY,
      DATA_PLANE_URL: process.env.DATAPLANE_URL,
      CONFIG_SERVER_HOST: process.env.CONFIG_SERVER_HOST,
      APP_DEST_SDK_BASE_URL: getDestinationSDKBaseURL(),
      APP_PLUGINS_SDK_BASE_URL: getPluginsBaseURL(),
      FEATURE: featureName,
      IS_DEV_TESTBOOK: isDevEnvTestBook,
      IS_DMT: isDMT,
    }),
    resolve({
      jsnext: true,
      browser: true,
      preferBuiltins: false,
      extensions: [...DEFAULT_EXTENSIONS, '.ts'],
    }),
    nodePolyfills({
      include: ['crypto'],
    }),
    commonjs({
      include: [/analytics-v1.1/, /node_modules/],
      requireReturnsDefault: 'auto',
    }),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true,
      tsconfigOverride: { compilerOptions: { declarationDir } },
    }),
    babel({
      inputSourceMap: true,
      compact: true,
      babelHelpers: 'bundled',
      exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
      extensions: [...DEFAULT_EXTENSIONS, '.ts'],
      sourcemap: true,
    }),
    !featureName &&
      copy({
        targets: getCopyTargets(),
      }),
    htmlTemplate({
      template: getHTMLSource(featureName),
      target: 'index.html',
      attrs: ['async', 'defer'],
      replaceVars: {
        __WRITE_KEY__: process.env.WRITE_KEY,
        __DATAPLANE_URL__: process.env.DATAPLANE_URL,
        __CONFIG_SERVER_HOST__: process.env.CONFIG_SERVER_HOST || '',
        __DEST_SDK_BASE_URL__: getDestinationSDKBaseURL(),
        __PLUGINS_SDK_BASE_URL__: getPluginsBaseURL(),
        __BASE_CDN_URL__: baseCdnUrl,
        __CDN_VERSION_PATH__: `${cdnVersionPath}` || '',
        __FEATURE__: featureName,
        __IS_DEV_TESTBOOK__: isDevEnvTestBook,
        __IS_DMT__: isDMT,
      },
    }),
    // Dedicated htmlTemplate for all/index.html aggregator (only in main build config)
    !featureName && htmlTemplate({
      template: 'public/all/index.html',
      target: 'dist/all/index.html',
      attrs: ['async', 'defer'],
      replaceVars: {
        __WRITE_KEY__: process.env.WRITE_KEY,
        __DATAPLANE_URL__: process.env.DATAPLANE_URL,
        __CONFIG_SERVER_HOST__: process.env.CONFIG_SERVER_HOST || '',
        __DEST_SDK_BASE_URL__: getDestinationSDKBaseURL(),
        __PLUGINS_SDK_BASE_URL__: getPluginsBaseURL(),
        __BASE_CDN_URL__: baseCdnUrl,
        __CDN_VERSION_PATH__: `${cdnVersionPath}` || '',
        __FEATURE__: featureName,
        __IS_DEV_TESTBOOK__: isDevEnvTestBook,
        __IS_DMT__: isDMT,
      },
    }),
    !featureName &&
      process.env.DEV_SERVER &&
      serve({
        open: !featureName,
        openPage: `/index.html`,
        contentBase: [getDistPath()],
        host: 'localhost',
        port: SERVER_PORT,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }),
    process.env.DEV_SERVER && livereload(),
    del({ hook: 'writeBundle', targets: declarationDir }),
  ],
  input: getJSSource(),
  output: [
    {
      file: !featureName
        ? `${getDistPath()}/testBook.js`
        : `${getDistPath()}/${featureName}/testBook.js`,
      format: 'iife',
      name: 'RudderSanityTestBook',
      sourcemap: true,
      generatedCode: {
        preset: 'es5',
      },
    },
  ],
});

const buildConfigs = [
  getBuildConfig(),
  ...featuresList.map(featureName => getBuildConfig(featureName)),
];

export default buildConfigs;
