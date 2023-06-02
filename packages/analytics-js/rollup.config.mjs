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
import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-typescript2';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import alias from '@rollup/plugin-alias';
import federation from '@originjs/vite-plugin-federation';
import externalGlobals from 'rollup-plugin-external-globals';
import * as dotenv from 'dotenv';
import pkg from './package.json' assert { type: 'json' };

dotenv.config();
const remotePluginsBasePath = process.env.REMOTE_MODULES_BASE_PATH || 'http://localhost:3002/cdn/';
const isLegacyBuild = process.env.BROWSERSLIST_ENV !== 'modern';
const variantSubfolder = isLegacyBuild ? '/legacy' : '/modern';
const sourceMapType =
  process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true';
const outDirNpmRoot = `dist/npm`;
const outDirCDNRoot = `dist/cdn`;
const outDirNpm = `${outDirNpmRoot}${variantSubfolder}`;
const outDirCDN = `${outDirCDNRoot}${variantSubfolder}`;
const distName = 'rudder-analytics';
const modName = 'rudderanalytics';
const remotePluginsExportsFilename = `rudder-analytics-plugins`;
const remotePluginsHostPromise = 'Promise.resolve(window.RudderStackGlobals && window.RudderStackGlobals.app && window.RudderStackGlobals.app.pluginsCDNPath ? "" + window.RudderStackGlobals.app.pluginsCDNPath + "/' + `${remotePluginsExportsFilename}.js` + '" : ' + `"${remotePluginsBasePath}/${remotePluginsExportsFilename}.js` + '")';
const moduleType = process.env.MODULE_TYPE || 'cdn';
const isNpmPackageBuild = moduleType === 'npm';
const isCDNPackageBuild = moduleType === 'cdn';

export function getDefaultConfig(distName) {
  const version = process.env.VERSION || 'dev-snapshot';
  const isLocalServerEnabled = isCDNPackageBuild && process.env.DEV_SERVER;

  return {
    watch: {
      include: ['src/**', 'public/**'],
    },
    external: [
      /rudderAnalyticsRemotePlugins\/.*/,
      ...Object.keys(pkg.peerDependencies || {})
    ],
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
          rudderAnalyticsRemotePlugins: {
            // use promise to set the path to allow override via loadOption value in case of proxy
            external: remotePluginsHostPromise,
            externalType: 'promise'
          },
        }
      }),
      process.env.UGLIFY === 'true' &&
        terser({
          safari10: isLegacyBuild,
          ecma: isLegacyBuild ? 2015 : 2017,
          format: {
            comments: false,
          },
        }),
      isNpmPackageBuild && !isLegacyBuild &&
        copy({
          targets: [
            { src: 'package.json', dest: outDirNpmRoot },
            { src: 'README.md', dest: outDirNpmRoot },
            { src: 'CHANGELOG.md', dest: outDirNpmRoot },
            { src: 'LICENSE', dest: outDirNpmRoot },
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
            __PLUGINS_BASE_URL__: remotePluginsBasePath,
            __SDK_BUNDLE_FILENAME__: distName,
          },
        }),
      isLocalServerEnabled &&
        serve({
          open: true,
          openPage: `/cdn/${isLegacyBuild ? 'legacy' : 'modern'}/iife/index.html`,
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
    entryFileNames: `index.js`,
    dir: outDirNpm + '/esm/',
    format: 'esm',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
  {
    entryFileNames: `index.js`,
    dir: outDirNpm + '/cjs',
    format: 'cjs',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
  {
    entryFileNames: `index.js`,
    dir: outDirNpm + '/umd',
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
    entryFileNames: `${distName}${process.env.UGLIFY === 'true' ? '.min' : ''}.js`,
    dir: outDirCDN + '/iife',
    format: 'iife',
    name: modName,
    sourcemap: sourceMapType,
    generatedCode: {
      preset: isLegacyBuild ? 'es5' : 'es2015',
    },
  },
];

const buildConfig = () => {
  return {
    ...getDefaultConfig(distName),
  };
};

const buildEntries = () => {
  const outputFiles = isCDNPackageBuild ? outputFilesCdn : outputFilesNpm;

  if(isCDNPackageBuild) {
    return[{
      ...buildConfig(),
      input: 'src/browser.ts',
      output: outputFiles,
    }];
  }

  return [
    {
      ...buildConfig(),
      input: 'src/index.ts',
      output: outputFiles,
    },
    {
      input: `dist/dts/packages/analytics-js/src/index.d.ts`,
      plugins: [
        alias({
          entries: [
            {
              find: '@rudderstack/analytics-js',
              replacement: path.resolve('./dist/dts/packages/analytics-js/src'),
            },
            {
              find: '@rudderstack/analytics-js-plugins',
              replacement: path.resolve('./dist/dts/packages/analytics-js-plugins/src'),
            }
          ]
        }),
        dts(),
        del({ hook: "buildEnd", targets: "./dist/dts" }),
      ],
      output: {
        file: `${outDirNpmRoot}/index.d.ts`,
        format: 'es',
      },
    }
  ];
}

export default buildEntries();
