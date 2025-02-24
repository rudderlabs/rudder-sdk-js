import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import * as dotenv from 'dotenv';

dotenv.config();
const outDirRoot = `dist`;
const distName = 'loading-script';
const modName = 'script';
const shouldUglify = process.env.UGLIFY === 'true';

export function getDefaultConfig(distName) {
  const version = process.env.VERSION || 'dev-snapshot';
  const isLocalServerEnabled = process.env.DEV_SERVER;

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
        __WRITE_KEY__: process.env.WRITE_KEY,
        __DATAPLANE_URL__: process.env.DATAPLANE_URL,
        __PACKAGE_VERSION__: version,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
      babel({
        compact: true,
        babelHelpers: 'bundled',
        exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
        extensions: [...DEFAULT_EXTENSIONS, '.ts'],
        sourcemap: false,
      }),
      terser({
        safari10: true,
        ecma: 5,
        keep_fnames: true,
        format: {
          beautify: !shouldUglify,
          comments: false,
          braces: true,
          indent_level: 2,
          max_line_len: 120,
          ecma: 5,
          safari10: true,
          webkit: true,
        },
        compress: shouldUglify
          ? {
              evaluate: false,
              join_vars: false,
              toplevel: true,
              dead_code: false,
              unused: false,
              top_retain: [
                'sdkBaseUrl',
                'sdkVersion',
                'sdkFileName',
                'loadOptions',
                'scriptLoadingMode',
                'rudderanalytics',
              ],
              booleans: false,
            }
          : false,
        mangle: shouldUglify
          ? {
              eval: false,
              keep_fnames: true,
              reserved: [
                'sdkBaseUrl',
                'sdkVersion',
                'sdkFileName',
                'loadOptions',
                'scriptLoadingMode',
                'rudderanalytics',
              ],
              toplevel: true,
              safari10: true,
            }
          : false,
      }),
      isLocalServerEnabled &&
        htmlTemplate({
          template: process.env.TEST_FILE_PATH || 'public/index.html',
          target: 'index.html',
          addToHead: true,
        }),
      isLocalServerEnabled &&
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
      isLocalServerEnabled && livereload(),
    ],
  };
}

const buildEntries = () => {
  return [
    {
      ...getDefaultConfig(distName),
      input: 'src/index.ts',
      output: {
        entryFileNames: `${distName}${shouldUglify ? '.min' : ''}.js`,
        dir: outDirRoot,
        format: 'iife',
        name: modName,
        sourcemap: false,
        generatedCode: {
          preset: 'es5',
        },
      },
    },
  ];
};

export default buildEntries();
