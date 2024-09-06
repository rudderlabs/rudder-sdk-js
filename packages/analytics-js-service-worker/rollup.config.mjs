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
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import alias from '@rollup/plugin-alias';
import * as dotenv from 'dotenv';

dotenv.config();

const isLegacyBuild = process.env.BROWSERSLIST_ENV !== 'modern';
const variantSubfolder = isLegacyBuild ? '/legacy' : '/modern';
const sourceMapType =
  process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true';
const outDirNpmRoot = `dist/npm`;
const outDir = `${outDirNpmRoot}${variantSubfolder}`;
const distName = 'index';
const modName = 'rudderServiceWorker';

export function getDefaultConfig(distName) {
  const version = process.env.VERSION || 'dev-snapshot';

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
      }),
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
        inputSourceMap: true,
        compact: true,
        babelHelpers: 'bundled',
        exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
        extensions: [...DEFAULT_EXTENSIONS, '.ts'],
        sourcemap: sourceMapType,
        plugins: ['../../babel-plugin-mark-private.mjs'],
      }),
      nodePolyfills({
        include: null,
      }),
      process.env.UGLIFY === 'true' &&
        terser({
          safari10: isLegacyBuild,
          ecma: isLegacyBuild ? 2015 : 2017,
          format: {
            comments: false,
          },
          mangle: {
            properties: {
              regex: /^private_/, // Only mangle properties starting with 'private_'
            },
          },
        }),
      copy({
        targets: [{ src: 'types/index.d.ts', dest: outDir }],
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
    ],
  };
}

const outputFilesNpm = [
  {
    entryFileNames: `index.mjs`,
    dir: outDir + '/esm/',
    format: 'esm',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
  {
    entryFileNames: `index.cjs`,
    dir: outDir + '/cjs/',
    format: 'cjs',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
  {
    entryFileNames: `index.js`,
    dir: outDir + '/umd',
    format: 'umd',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
];

const buildEntries = [
  {
    ...getDefaultConfig(distName),
    input: 'src/index.ts',
    output: outputFilesNpm,
  },
  {
    input: `dist/dts/packages/analytics-js-service-worker/src/index.d.ts`,
    plugins: [
      alias({
        entries: [
          {
            find: '@rudderstack/analytics-js-service-worker',
            replacement: path.resolve('./dist/dts/packages/analytics-js-service-worker/src'),
          },
          {
            find: '@rudderstack/analytics-js-common',
            replacement: path.resolve('./dist/dts/packages/analytics-js-common/src'),
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

export default buildEntries;
