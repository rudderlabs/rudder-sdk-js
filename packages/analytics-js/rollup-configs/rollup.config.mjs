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
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import dts from 'rollup-plugin-dts';
import federation from '@originjs/vite-plugin-federation';
import * as dotenv from 'dotenv';
import pkg from '../package.json' assert { type: 'json' };

const remotePluginsBasePath = process.env.REMOTE_MODULES_BASE_PATH || 'http://localhost:3002';
const variantSubfolder = process.env.BROWSERSLIST_ENV === 'modern' ? '/modern' : '/legacy';
const sourceMapType =
  process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true';
const outDir = `dist${variantSubfolder}`;
const distName = 'rudder-analytics';
const modName = 'rudderanalytics';

export function getDefaultConfig(distName, moduleType = 'npm') {
  const version = process.env.VERSION || 'dev-snapshot';
  const isLocalServerEnabled = moduleType === 'cdn' && process.env.DEV_SERVER;
  dotenv.config();

  return {
    //preserveEntrySignatures: false,
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
        'process.package_version': version,
        'process.module_type': moduleType,
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
      // TODO: keep checking for updates on when the sourcemaps will be fixed and remove patch
      //  https://github.com/originjs/vite-plugin-federation/issues/355
      //  https://github.com/originjs/vite-plugin-federation/issues/336
      federation({
        remotes: {
          remotePlugins: `${remotePluginsBasePath}/modern/remotePlugins.js`,
        },
        //sourcemap: sourceMapType,
      }),
      process.env.UGLIFY === 'true' &&
        terser({
          safari10: process.env.BROWSERSLIST_ENV !== 'modern',
          ecma: process.env.BROWSERSLIST_ENV === 'modern' ? 2017 : 2015,
          format: {
            comments: false,
          },
        }),
      moduleType === 'npm' &&
        copy({
          targets: [
            { src: 'types/index.d.ts', dest: outDir },
            { src: 'package.json', dest: outDir },
            { src: 'README.md', dest: outDir },
            { src: 'CHANGELOG.md', dest: outDir },
            { src: 'LICENSE', dest: outDir },
          ],
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
          attrs: ['async', 'defer'],
          replaceVars: {
            __WRITE_KEY__: process.env.WRITE_KEY,
            __DATAPLANE_URL__: process.env.DATAPLANE_URL,
            __CONFIG_SERVER_HOST__:
              process.env.CONFIG_SERVER_HOST || 'https://api.dev.rudderlabs.com',
            __DEST_SDK_BASE_URL__: process.env.DEST_SDK_BASE_URL,
          },
        }),
      isLocalServerEnabled &&
        serve({
          open: true,
          openPage: `/${
            process.env.BROWSERSLIST_ENV === 'modern' ? 'modern' : 'legacy'
          }/iife/index.html`,
          contentBase: ['dist'],
          host: 'localhost',
          port: 3001,
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
    dir: outDir + '/esm/',
    format: 'esm',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: process.env.BROWSERSLIST_ENV === 'modern' ? 'es2015' : 'es5',
    },
  },
  {
    dir: outDir + '/cjs',
    format: 'cjs',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: process.env.BROWSERSLIST_ENV === 'modern' ? 'es2015' : 'es5',
    },
  },
  {
    dir: outDir + '/umd',
    format: 'umd',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: process.env.BROWSERSLIST_ENV === 'modern' ? 'es2015' : 'es5',
    },
  },
];
const outputFilesCdn = [
  {
    dir: outDir + '/iife',
    format: 'iife',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: process.env.BROWSERSLIST_ENV === 'modern' ? 'es2015' : 'es5',
    },
  },
];

const buildConfig = moduleType => {
  return {
    ...getDefaultConfig(distName, moduleType),
  };
};

const buildEntries = process.env.ONLY_IIFE === 'true' ? [
  {
    ...buildConfig('cdn'),
    input: 'src/index.ts',
    output: outputFilesCdn,
  }
] : [
  {
    ...buildConfig(),
    input: 'src/index.ts',
    output: outputFilesNpm,
  },
  {
    ...buildConfig('cdn'),
    input: 'src/index.ts',
    output: outputFilesCdn,
  },
  {
    input: `dist/dts/packages/analytics-js/src/index.d.ts`,
    plugins: [dts()],
    output: {
      file: `${outDir}/index.d.ts`,
      format: 'es',
    },
  },
];

export default buildEntries;
