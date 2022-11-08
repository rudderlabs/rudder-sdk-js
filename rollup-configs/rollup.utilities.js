/* eslint-disable import/no-extraneous-dependencies */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import json from '@rollup/plugin-json';
import visualizer from 'rollup-plugin-visualizer';
import filesize from 'rollup-plugin-filesize';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import * as dotenv from 'dotenv';

export function getOutputFilePath(dirPath, distName) {
  const fileNamePrefix = `${distName}${process.env.STAGING === 'true' ? '-staging' : ''}`;
  const fileNameSuffix = process.env.PROD_DEBUG === 'inline' ? '-map' : '';
  let outFilePath = '';

  if (process.env.ENV === 'prod') {
    outFilePath = `${dirPath}/${fileNamePrefix}${fileNameSuffix}.min.js`;
  } else {
    outFilePath = `${dirPath}/${fileNamePrefix}.js`;
  }
  return outFilePath;
}

export function getOutputConfiguration(outDir, modName, outFilePath) {
  const outputFiles = [];

  if (process.env.NPM === 'true') {
    outputFiles.push({
      file: `${outDir}/index.js`,
      format: 'umd',
      name: modName,
    });

    outputFiles.push({
      file: `${outDir}/index.es.js`,
      format: 'esm',
      name: modName,
    });
  } else {
    outputFiles.push({
      file: outFilePath,
      format: 'iife',
      name: modName,
      sourcemap: process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true',
    });
  }

  return outputFiles;
}

export function getDefaultConfig(distName) {
  const version = process.env.VERSION || 'dev-snapshot';
  const moduleType = process.env.NPM === 'true' ? 'npm' : 'cdn';
  dotenv.config();

  return {
    watch: {
      include: [
        'utils/**',
        'src/**',
        'metrics/**',
        'session/**',
        'service-worker/**',
        'packages/**',
        'integrations/**',
        'cookieConsent/**',
      ],
    },
    external: [],
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
        /* namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        Xmlhttprequest: ["Xmlhttprequest"]
      } */
      }),
      json(),
      globals(),
      builtins(),
      babel({
        inputSourceMap: true,
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
          filename: `./stats/${distName}.html`,
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
          template: 'tests/html/script-test.html',
          target: 'index.html',
          attrs: ['async', 'defer'],
          replaceVars: {
            __WRITE_KEY__: process.env.WRITE_KEY,
            __DATAPLANE_URL__: process.env.DATAPLANE_URL,
          },
        }),
      process.env.DEV_SERVER &&
        serve({
          open: true,
          openPage: '/index.html',
          contentBase: ['dist'],
          host: 'localhost',
          port: 3001,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }),
      process.env.DEV_SERVER && livereload(),
    ],
  };
}
