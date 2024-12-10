/* eslint-disable import/no-extraneous-dependencies */
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
import htmlTemplate from 'rollup-plugin-generate-html-template';
import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import alias from '@rollup/plugin-alias';
import * as dotenv from 'dotenv';
import { DEFAULT_EXTENSIONS } from '@babel/core';

dotenv.config();

const isContentScriptBuild = process.env.NO_EXTERNAL_HOST;
let bugsnagSDKUrl = 'https://d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js';
let polyfillIoUrl = 'https://polyfill-fastly.io/v3/polyfill.min.js';
let googleAdsSDKUrl = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

// For Chrome extension as content script any references in code to third party URLs
// throw violations at approval phase even if relevant code is not used
if (isContentScriptBuild) {
  bugsnagSDKUrl = '';
  polyfillIoUrl = '';
  googleAdsSDKUrl = '';
}

export function getOutputFilePath(dirPath, distName) {
  const fileNamePrefix = `${distName}`;
  const fileNameSuffix = process.env.PROD_DEBUG === 'inline' ? '-map' : '';
  let outFilePath = '';

  if (process.env.ENV === 'prod') {
    outFilePath = `${dirPath}/${fileNamePrefix}${fileNameSuffix}.min.js`;
  } else {
    outFilePath = `${dirPath}/${fileNamePrefix}.js`;
  }
  return outFilePath;
}

export function getDefaultConfig(distName) {
  const version = process.env.VERSION || 'dev-snapshot';
  const moduleType = process.env.NPM === 'true' ? 'npm' : 'cdn';
  const isLocalServerEnabled = moduleType === 'cdn' && process.env.DEV_SERVER;
  const sourceMapType =
    process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true';

  return {
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
        __PACKAGE_VERSION__: version,
        __MODULE_TYPE__: moduleType,
        __RS_BUGSNAG_API_KEY__: process.env.BUGSNAG_API_KEY || '{{__RS_BUGSNAG_API_KEY__}}',
        __RS_BUGSNAG_RELEASE_STAGE__: process.env.BUGSNAG_RELEASE_STAGE || 'production',
        __RS_POLYFILLIO_SDK_URL__: polyfillIoUrl,
        __RS_BUGSNAG_SDK_URL__: bugsnagSDKUrl,
        __RS_GOOGLE_ADS_SDK_URL__: googleAdsSDKUrl,
      }),
      alias({
        entries: [
          {
            find: '@rudderstack/analytics-js-common',
            replacement: path.resolve('../analytics-js-common/src'),
          },
        ],
      }),
      nodePolyfills(),
      resolve({
        jsnext: true,
        browser: true,
        preferBuiltins: false,
        extensions: ['.js', '.ts', '.mjs'],
      }),
      commonjs({
        include: /node_modules/,
        requireReturnsDefault: 'auto',
      }),
      json(),
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
        plugins: ['../../babel-plugin-mark-private.mjs'],
      }),
      process.env.UGLIFY === 'true' &&
        terser({
          format: {
            comments: false,
          },
          mangle: {
            properties: {
              regex: /^private_/, // Only mangle properties starting with 'private_'
            },
          },
        }),
      process.env.VISUALIZER === 'true' &&
        process.env.UGLIFY === 'true' &&
        visualizer({
          filename: `./stats/${distName}.html`,
          title: `Rollup Visualizer - ${distName}`,
          sourcemap: true,
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      filesize({
        showBrotliSize: true,
      }),
      isLocalServerEnabled &&
        htmlTemplate({
          template: process.env.TEST_FILE_PATH || 'public/index.html',
          target: 'index.html',
          attrs: ['async', 'defer'],
          replaceVars: {
            __WRITE_KEY__: process.env.WRITE_KEY,
            __DATAPLANE_URL__: process.env.DATAPLANE_URL,
            __CONFIG_SERVER_HOST__: process.env.CONFIG_SERVER_HOST || '',
            __DEST_SDK_BASE_URL__: process.env.DEST_SDK_BASE_URL,
          },
        }),
      isLocalServerEnabled &&
        serve({
          open: true,
          openPage: `/cdn/${
            process.env.BROWSERSLIST_ENV === 'modern' ? 'modern' : 'legacy'
          }/index.html`,
          contentBase: ['dist'],
          host: 'localhost',
          port: 3004,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }),
      isLocalServerEnabled && livereload(),
    ],
  };
}
