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

const getHTMLSource = () => {
  switch (process.env.TEST_PACKAGE) {
    case 'cdn':
      return 'public/index-cdn.html';
    case 'npm':
      return 'public/index-npm.html';
    default:
      return 'public/index-local.html';
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

const getCopyTargets = () => {
  switch (process.env.TEST_PACKAGE) {
    case 'cdn':
      return [];
    case 'npm':
      return [];
    default:
      return [
        { src: '../dist/legacy/rudder-analytics.min.js', dest: 'dist' },
        { src: '../dist/legacy/rudder-analytics.min.js.map', dest: 'dist' },
      ];
  }
};

const buildConfig = {
  watch: {
    include: ['src/**', 'public/**'],
  },
  plugins: [
    replace({
      preventAssignment: true,
      WRITE_KEY: process.env.WRITE_KEY,
      DATA_PLANE_URL: process.env.DATAPLANE_URL,
      CONFIG_SERVER_HOST: process.env.CONFIG_SERVER_HOST || 'https://api.dev.rudderlabs.com',
      DEST_SDK_BASE_URL: process.env.DEST_SDK_BASE_URL,
      CDN_VERSION_PATH: process.env.CDN_VERSION_PATH || '',
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
    copy({
      targets: getCopyTargets(),
    }),
    json(),
    htmlTemplate({
      template: getHTMLSource(),
      target: 'index.html',
      attrs: ['async', 'defer'],
      replaceVars: {
        __WRITE_KEY__: process.env.WRITE_KEY,
        __DATAPLANE_URL__: process.env.DATAPLANE_URL,
        __CONFIG_SERVER_HOST__: process.env.CONFIG_SERVER_HOST || 'https://api.dev.rudderlabs.com',
        __DEST_SDK_BASE_URL__: process.env.DEST_SDK_BASE_URL,
        __CDN_VERSION_PATH__: process.env.CDN_VERSION_PATH || '',
      },
    }),
    process.env.DEV_SERVER &&
      serve({
        open: true,
        openPage: `/index.html`,
        contentBase: ['dist'],
        host: 'localhost',
        port: 3001,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }),
    process.env.DEV_SERVER && livereload(),
  ],
  input: getJSSource(),
  output: [
    {
      file: 'dist/testBook.js',
      format: 'iife',
      name: 'RudderSanityTestBook',
      sourcemap: 'inline',
      generatedCode: {
        preset: 'es5',
      },
    },
  ],
};

export default buildConfig;
