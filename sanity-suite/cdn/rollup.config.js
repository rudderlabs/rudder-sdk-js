/* eslint-disable import/no-extraneous-dependencies */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import * as dotenv from 'dotenv';
import replace from "@rollup/plugin-replace";

dotenv.config();

export default {
  watch: {
    include: ['src/**', 'public/**'],
  },
  plugins: [
    replace({
      preventAssignment: true,
      'WRITE_KEY': process.env.WRITE_KEY,
      'DATA_PLANE_URL': process.env.DATAPLANE_URL,
      'CONTROL_PLANE_URL': process.env.CONFIG_SERVER_HOST || 'https://api.dev.rudderlabs.com',
      'DEST_SDK_BASE_URL': process.env.DEST_SDK_BASE_URL
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
      babelHelpers: 'bundled',
      exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
    }),
    process.env.DEV_SERVER &&
    htmlTemplate({
      template: process.env.TEST_FILE_PATH || 'public/index.html',
      target: 'index.html',
      attrs: ['async', 'defer'],
      replaceVars: {
        __WRITE_KEY__: process.env.WRITE_KEY,
        __DATAPLANE_URL__: process.env.DATAPLANE_URL,
        __CONFIG_SERVER_HOST__:
          process.env.CONFIG_SERVER_HOST || 'https://api.dev.rudderlabs.com',
        __DEST_SDK_BASE_URL__: process.env.DEST_SDK_BASE_URL,
        __CDN_VERSION_PATH__: process.env.CDN_VERSION_PATH || ''
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
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'iife',
      name: 'RudderSanityTest',
      sourcemap: 'inline',
      generatedCode: {
        preset: 'es5',
      },
    },
  ],
};
