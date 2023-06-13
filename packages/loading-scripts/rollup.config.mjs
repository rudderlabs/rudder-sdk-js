/* eslint-disable import/no-extraneous-dependencies */
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
import { DEFAULT_EXTENSIONS } from '@babel/core';
import * as dotenv from 'dotenv';

dotenv.config();
const remotePluginsBasePath = process.env.REMOTE_MODULES_BASE_PATH || 'http://localhost:3002/cdn/';
const sourceMapType =
  process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true';
const outDirRoot = `dist/`;
const outDirCDN = `${outDirRoot}legacy`;
const distName = 'loading-script';
const modName = 'script';

export function getDefaultConfig(distName) {
  const isLocalServerEnabled = process.env.DEV_SERVER;

  return {
    watch: {
      include: ['src/**', 'public/**'],
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
        __SDK_BUNDLE_FILENAME__: distName,
        __WRITE_KEY__: process.env.WRITE_KEY,
        __DATAPLANE_URL__: process.env.DATAPLANE_URL,
        __CONFIG_SERVER_HOST__: process.env.CONFIG_SERVER_HOST || 'https://api.dev.rudderlabs.com',
        __DEST_SDK_BASE_URL__: process.env.DEST_SDK_BASE_URL,
        __PLUGINS_BASE_URL__: remotePluginsBasePath,
      }),
      resolve({
        jsnext: true,
        browser: true,
        preferBuiltins: false,
        extensions: ['.js', '.ts', '.mjs'],
      }),
      nodePolyfills({
        include: ['crypto'],
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
      }),
      process.env.UGLIFY === 'true' &&
        terser({
          safari10: true,
          ecma: 2015,
          format: {
            comments: false,
          },
        }),
      filesize({
        showBeforeSizes: 'build',
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
        htmlTemplate({
          template: process.env.TEST_FILE_PATH || 'public/index.html',
          target: 'index.html',
          attrs: [],
          noInject: true,
          replaceVars: {
            __WRITE_KEY__: process.env.WRITE_KEY,
            __DATAPLANE_URL__: process.env.DATAPLANE_URL,
            __CONFIG_SERVER_HOST__:
              process.env.CONFIG_SERVER_HOST || 'https://api.dev.rudderlabs.com',
            __DEST_SDK_BASE_URL__: process.env.DEST_SDK_BASE_URL,
            __PLUGINS_BASE_URL__: remotePluginsBasePath,
            __SDK_BUNDLE_FILENAME__: distName,
          },
        }),
      isLocalServerEnabled &&
        serve({
          open: true,
          openPage: `/legacy/index.html`,
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

const outputFilesCdn = [
  {
    entryFileNames: `${distName}${process.env.UGLIFY === 'true' ? '.min' : ''}.js`,
    dir: outDirCDN,
    format: 'iife',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: 'es5',
    },
  },
];

const buildConfig = () => {
  return {
    ...getDefaultConfig(distName),
  };
};

const buildEntries = () => {
  return [
    {
      ...buildConfig(),
      input: 'src/index.ts',
      output: outputFilesCdn,
    },
  ];
};

export default buildEntries();
