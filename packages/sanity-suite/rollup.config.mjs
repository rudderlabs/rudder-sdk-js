/* eslint-disable import/no-extraneous-dependencies */
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
import * as dotenv from 'dotenv';

dotenv.config();

const serverPort = 3003;
const cdnURLProd = 'https://cdn.rudderlabs.com';
const defaultSdkVersion = 'v3';
const sdkVersion = process.env.SDK_VERSION || defaultSdkVersion;
const isLegacy = sdkVersion === 'v1.1';
const cdnVersionPath = `${process.env.SDK_CDN_VERSION_PATH_PREFIX || ''}${sdkVersion}`;
const isDMT = process.env.IS_DMT === 'true';
const isDevEnvTestBook = process.env.IS_DEV_TESTBOOK === 'true';
const distributionType = process.env.DISTRIBUTION_TYPE || 'cdn';
const buildType = process.env.BUILD_TYPE || 'modern';

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
    default:
      return `${folderPath}index-local.html`;
  }
};

const getJSSource = () => {
  switch (distributionType) {
    case 'npm':
      return isLegacy ? 'src/index-npm-v1.1.ts' : 'src/index-npm.ts';
    case 'cdn':
    default:
      return 'src/index.ts';
  }
};

const getDestinationsURL = () => {
  if (process.env.DEST_SDK_BASE_URL) {
    return process.env.DEST_SDK_BASE_URL;
  }

  switch (distributionType) {
    case 'cdn':
      return `${cdnURLProd}/${cdnVersionPath}/js-integrations/`;
    case 'npm':
      return isLegacy ? `${cdnURLProd}/${cdnVersionPath}/legacy/js-integrations/` : `${cdnURLProd}/${cdnVersionPath}/js-integrations/`;
    default:
      return `http://localhost:${serverPort}/js-integrations/`;
  }
};

const getCopyTargets = () => {
  switch (distributionType) {
    case 'cdn':
      return [];
    case 'npm':
      return [];
    default:
      return isLegacy
        ? [
          {
            src: '../analytics-v1.1/dist/cdn/legacy/rudder-analytics.min.js',
            dest: getDistPath(),
            rename: 'rudder-analytics.min.js',
          },
          {
            src: '../analytics-v1.1/dist/cdn/legacy/rudder-analytics.min.js.map',
            dest: getDistPath(),
            rename: 'rudder-analytics.min.js.map',
          },
          {
            src: '../analytics-js-integrations/dist/cdn/legacy/js-integrations/*',
            dest: `${getDistPath()}/js-integrations`,
          },
        ]
        : [
          {
            src: '../analytics-js/dist/cdn/legacy/iife/rsa.min.js',
            dest: getDistPath(),
            rename: 'rsa.min.js',
          },
          {
            src: '../analytics-js/dist/cdn/legacy/iife/rsa.min.js.map',
            dest: getDistPath(),
            rename: 'rsa.min.js.map',
          },
          {
            src: '../analytics-js-integrations/dist/cdn/legacy/js-integrations/*',
            dest: `${getDistPath()}/js-integrations`,
          },
        ];
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
      __PACKAGE_VERSION__: sdkVersion,
      __MODULE_TYPE__: distributionType,
      WRITE_KEY: process.env.WRITE_KEY,
      DATA_PLANE_URL: process.env.DATAPLANE_URL,
      CONFIG_SERVER_HOST: process.env.CONFIG_SERVER_HOST,
      APP_DEST_SDK_BASE_URL: getDestinationsURL() || '',
      REMOTE_MODULES_BASE_PATH: process.env.REMOTE_MODULES_BASE_PATH || '',
      FEATURE: featureName,
      IS_DEV_TESTBOOK: isDevEnvTestBook,
      IS_DMT: isDMT
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
        __DEST_SDK_BASE_URL__: getDestinationsURL(),
        __REMOTE_MODULES_BASE_PATH__: process.env.REMOTE_MODULES_BASE_PATH,
        __CDN_VERSION_PATH__:`${cdnVersionPath}` || '',
        __FEATURE__: featureName,
        __IS_DEV_TESTBOOK__: isDevEnvTestBook,
        __IS_DMT__: isDMT
      },
    }),
    !featureName &&
      process.env.DEV_SERVER &&
      serve({
        open: !featureName,
        openPage: `/index.html`,
        contentBase: [getDistPath()],
        host: 'localhost',
        port: serverPort,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }),
    process.env.DEV_SERVER && livereload(),
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
