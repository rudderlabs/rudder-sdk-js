/* eslint-disable import/no-extraneous-dependencies */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import * as dotenv from 'dotenv';

dotenv.config();

const serverPort = 3001;
const prodCDNURL = 'https://cdn.rudderlabs.com';
const defaultVersion = 'v1.1';
// TODO: get this lst from public folder subfolders
const featuresList = ['eventFiltering', 'preloadBuffer'];

const getDistPath = () => {
  let distPath = process.env.TEST_PACKAGE ? `/${process.env.TEST_PACKAGE}` : '';

  if (process.env.TEST_PACKAGE === 'cdn') {
    distPath += `/${process.env.CDN_VERSION_PATH || defaultVersion}`;
  }

  if (process.env.STAGING) {
    distPath += '/staging';
  }

  return `dist${distPath}`;
};

const getHTMLSource = (featureName) => {
  const folderPath = featureName ? `public/${featureName}` : `public`;

  switch (process.env.TEST_PACKAGE) {
    case 'cdn':
      return `${folderPath}/index-cdn.html`;
    case 'npm':
      return `${folderPath}/index-npm.html`;
    default:
      return `${folderPath}/index-local.html`;
  }
};

const getJSSource = () => {
  switch (process.env.TEST_PACKAGE) {
    case 'cdn':
      return 'src/index.js';
    case 'npm':
      return 'src/index-npm.js';
    default:
      return 'src/index.js';
  }
};

const getDestinationsURL = () => {
  if (process.env.DEST_SDK_BASE_URL) {
    return process.env.DEST_SDK_BASE_URL;
  }

  let versionPath = defaultVersion;

  switch (process.env.TEST_PACKAGE) {
    case 'cdn':
      versionPath = process.env.CDN_VERSION_PATH || defaultVersion;

      if (process.env.STAGING) {
        versionPath += '/staging';
      }
      return `${prodCDNURL}/${versionPath}/js-integrations/`;
    case 'npm':
      return `${prodCDNURL}/${versionPath}/js-integrations/`;
    default:
      return `http://localhost:${serverPort}/js-integrations/`;
  }
};

const getCopyTargets = () => {
  switch (process.env.TEST_PACKAGE) {
    case 'cdn':
      return [];
    case 'npm':
      return [];
    default:
      return [
        { src: '../dist/legacy/rudder-analytics.min.js', dest: getDistPath() },
        { src: '../dist/legacy/rudder-analytics.min.js.map', dest: getDistPath() },
        { src: '../dist/legacy/js-integrations/*', dest: `${getDistPath()}/js-integrations` },
      ];
  }
};

const getBuildConfig = (featureName) => ({
  watch: {
    include: ['src/**', 'public/**', '__mocks__/**'],
  },
  plugins: [
    replace({
      preventAssignment: true,
      WRITE_KEY: process.env.WRITE_KEY,
      FEATURE_PRELOAD_BUFFER_WRITE_KEY: process.env.FEATURE_PRELOAD_BUFFER_WRITE_KEY,
      FEATURE_EVENT_FILTERING_WRITE_KEY: process.env.FEATURE_EVENT_FILTERING_WRITE_KEY,
      DATA_PLANE_URL: process.env.DATAPLANE_URL,
      CONFIG_SERVER_HOST: process.env.CONFIG_SERVER_HOST || 'https://api.dev.rudderlabs.com',
      DEST_SDK_BASE_URL: getDestinationsURL(),
      CDN_VERSION_PATH:
        `${process.env.CDN_VERSION_PATH}/${process.env.STAGING ? 'staging/' : ''}` || '',
      STAGING_FILE_PATH: process.env.STAGING ? '-staging' : '',
      FEATURE: featureName,
    }),
    resolve({
      jsnext: true,
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      inputSourceMap: true,
      babelHelpers: 'bundled',
      exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
    }),
    !featureName &&
      copy({
        targets: getCopyTargets(),
      }),
    json(),
    htmlTemplate({
      template: getHTMLSource(featureName),
      target: 'index.html',
      attrs: ['async', 'defer'],
      replaceVars: {
        __WRITE_KEY__: process.env.WRITE_KEY,
        __FEATURE_PRELOAD_BUFFER_WRITE_KEY__: process.env.FEATURE_PRELOAD_BUFFER_WRITE_KEY,
        __FEATURE_EVENT_FILTERING_WRITE_KEY__: process.env.FEATURE_EVENT_FILTERING_WRITE_KEY,
        __DATAPLANE_URL__: process.env.DATAPLANE_URL,
        __CONFIG_SERVER_HOST__: process.env.CONFIG_SERVER_HOST || 'https://api.dev.rudderlabs.com',
        __DEST_SDK_BASE_URL__: getDestinationsURL(),
        __CDN_VERSION_PATH__:
          `${process.env.CDN_VERSION_PATH}/${process.env.STAGING ? 'staging/' : ''}` || '',
        __STAGING_FILE_PATH__: process.env.STAGING ? '-staging' : '',
        __FEATURE__: featureName,
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
      sourcemap: 'inline',
      generatedCode: {
        preset: 'es5',
      },
    },
  ],
});

const buildConfigs = [
  getBuildConfig(),
  ...featuresList.map((featureName) => getBuildConfig(featureName)),
];

export default buildConfigs;
