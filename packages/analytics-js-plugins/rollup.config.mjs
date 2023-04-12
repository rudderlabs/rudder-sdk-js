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
import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import federation from '@originjs/vite-plugin-federation';
import dts from 'rollup-plugin-dts';
import * as dotenv from 'dotenv';
import pkg from './package.json' assert { type: 'json' };

const isLegacyBuild = process.env.BROWSERSLIST_ENV !== 'modern';
const variantSubfolder = isLegacyBuild ? '/legacy' : '/modern';
const sourceMapType =
  process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true';
const outDir = `dist${variantSubfolder}`;
const distName = 'rudder-analytics-plugins';
const modName = 'rudderanalyticsplugins';

export function getDefaultConfig(distName) {
  const version = process.env.VERSION || 'dev-snapshot';
  const isLocalServerEnabled = process.env.DEV_SERVER;
  dotenv.config();

  return {
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
      }),
      resolve({
        jsnext: true,
        browser: true,
        preferBuiltins: false,
        extensions: ['.js', '.ts'],
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
      }),
      !isLegacyBuild &&
      federation({
        name: 'remotePlugins',
        filename: 'remotePlugins.js',
        exposes: {
          './StorageEncryptionV1': './src/storageEncryption/storageEncryptionV1.ts',
          './GoogleLinker': './src/googleLinker/googleLinker.ts',
          './RemotePlugin': './src/pocToDelete/RemotePlugin.ts',
          './RemotePlugin2': './src/pocToDelete/RemotePlugin2.ts',
          './LoadIntegrations': './src/pocToDelete/LoadIntegrations.ts',
        },
      }),
      process.env.UGLIFY === 'true' &&
        terser({
          safari10: isLegacyBuild,
          ecma: isLegacyBuild ? 2015 : 2017,
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
        serve({
          contentBase: ['dist'],
          host: 'localhost',
          port: 3002,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }),
      isLocalServerEnabled && livereload(),
    ],
  };
}

const outputFiles = [
  {
    dir: outDir,
    format: 'esm',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
];

const buildConfig = {
  ...getDefaultConfig(distName),
};

export default [
  {
    ...buildConfig,
    input: 'src/index.ts',
    output: outputFiles,
  },
  {
    input: `dist/dts/packages/analytics-js-plugins/src/index.d.ts`,
    plugins: [dts()],
    output: {
      file: `${outDir}/index.d.ts`,
      format: 'es',
    },
  },
];
