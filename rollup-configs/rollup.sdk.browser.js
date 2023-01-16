/* eslint-disable import/no-extraneous-dependencies */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import visualizer from 'rollup-plugin-visualizer';
import filesize from 'rollup-plugin-filesize';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import * as dotenv from 'dotenv';

dotenv.config();
const version = process.env.VERSION || 'dev-snapshot';
const moduleType = process.env.NPM === 'true' ? 'npm' : 'cdn';
const sourceMapType =
  process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true';
const outDir = `dist`;
const distName = 'rudder-analytics';
const modName = 'rudderanalytics';

const fileNamePrefix = `${distName}${process.env.STAGING === 'true' ? '-staging' : ''}`;
const fileNameSuffix = process.env.PROD_DEBUG === 'inline' ? '-map' : '';
const outFilePath =
  process.env.ENV === 'prod'
    ? `${outDir}/${fileNamePrefix}${fileNameSuffix}.min.js`
    : `${outDir}/${fileNamePrefix}.js`;

const outputFiles = [
  {
    file: outFilePath,
    format: 'iife',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: 'es5',
    },
  },
];

export default {
  input: 'src/core/analytics.js',
  external: ['Xmlhttprequest', 'universal-analytics'],
  output: outputFiles,
  watch: {
    include: ['src/**'],
  },
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') {
      return;
    }

    warn(warning);
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.browser': process.env.NODE_ENV !== 'true',
      'process.prod': process.env.ENV === 'prod',
      'process.package_version': version,
      'process.module_type': moduleType,
    }),
    resolve({
      jsnext: true,
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    json(),
    babel({
      inputSourceMap: true,
      compact: true,
      babelHelpers: 'bundled',
      exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
    }),
    process.env.UGLIFY === 'true' &&
      terser({
        // remove all comments
        format: {
          comments: false,
        },
      }),
    process.env.VISUALIZER === 'true' &&
      process.env.UGLIFY === 'true' &&
      visualizer({
        filename: `./stats/stats.html`,
        title: `Rollup Visualizer - ${distName}`,
        sourcemap: true,
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    filesize({
      showBeforeSizes: 'build',
      showBrotliSize: true,
    }),
    process.env.DEV_SERVER &&
      htmlTemplate({
        template: process.env.EXAMPLE_PATH || 'examples/html/script-test.html',
        target: 'index.html',
        attrs: ['async', 'defer'],
        replaceVars: {
          __WRITE_KEY__: process.env.WRITE_KEY,
          __DATAPLANE_URL__: process.env.DATAPLANE_URL,
          __CONFIG_SERVER_HOST__:
            process.env.CONFIG_SERVER_HOST || 'https://api.dev.rudderlabs.com',
        },
      }),
    process.env.DEV_SERVER &&
      serve({
        open: true,
        openPage: '/index.html',
        contentBase: ['dist', 'src/integrations'],
        host: 'localhost',
        port: 3001,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }),
    process.env.DEV_SERVER && livereload(),
  ],
};
