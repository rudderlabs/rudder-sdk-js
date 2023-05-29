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
import externalGlobals from 'rollup-plugin-external-globals';
import * as dotenv from 'dotenv';
import pkg from '../package.json' assert { type: 'json' };

const remotePluginsBasePath = process.env.REMOTE_MODULES_BASE_PATH || 'http://localhost:3002';
const isLegacyBuild = process.env.BROWSERSLIST_ENV !== 'modern';
const variantSubfolder = isLegacyBuild ? '/legacy' : '/modern';
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
      include: ['src/**', 'public/**'],
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
        __BUNDLE_ALL_PLUGINS__: isLegacyBuild,
        __PACKAGE_VERSION__: version,
        __MODULE_TYPE__: moduleType,
        __RS_BUGSNAG_API_KEY__: process.env.BUGSNAG_API_KEY || '{{__RS_BUGSNAG_API_KEY__}}',
        __RS_BUGSNAG_RELEASE_STAGE__: process.env.BUGSNAG_RELEASE_STAGE || 'production',
        __SDK_BUNDLE_FILENAME__: distName,
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
      isLegacyBuild &&
        externalGlobals({
          './modernBuildPluginImports': 'null',
        }),
      !isLegacyBuild &&
        externalGlobals({
          './legacyBuildPluginImports': 'null',
        }),
      !isLegacyBuild &&
        federation({
          remotes: {
            remotePlugins: `${remotePluginsBasePath}/modern/remotePlugins.js`,
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
            __SDK_BUNDLE_FILENAME__: distName,
          },
        }),
      isLocalServerEnabled &&
        serve({
          open: true,
          openPage: `/${isLegacyBuild ? 'legacy' : 'modern'}/iife/index.html`,
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
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
  {
    dir: outDir + '/cjs',
    format: 'cjs',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
  {
    dir: outDir + '/umd',
    format: 'umd',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
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
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
];

const buildConfig = moduleType => {
  return {
    ...getDefaultConfig(distName, moduleType),
  };
};

const buildEntries =
  process.env.ONLY_IIFE === 'true'
    ? [
        {
          ...buildConfig('cdn'),
          input: 'src/index.ts',
          output: outputFilesCdn,
        },
      ]
    : [
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
