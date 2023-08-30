import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import * as dotenv from 'dotenv';

dotenv.config();
const remotePluginsBasePath = process.env.REMOTE_MODULES_BASE_PATH || 'http://localhost:3002/cdn/';
const outDirRoot = `dist`;
const distName = 'loading-script';
const modName = 'script';
const shouldUglify = process.env.UGLIFY === 'true';

export function getDefaultConfig(distName) {
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
        __SDK_BUNDLE_FILENAME__: distName,
        __WRITE_KEY__: process.env.WRITE_KEY,
        __DATAPLANE_URL__: process.env.DATAPLANE_URL,
        __CONFIG_SERVER_HOST__: process.env.CONFIG_SERVER_HOST || '',
        __DEST_SDK_BASE_URL__: process.env.DEST_SDK_BASE_URL,
        __PLUGINS_BASE_URL__: remotePluginsBasePath,
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
        ecma: 2015,
        keep_fnames: true,
        format: {
          beautify: !shouldUglify,
          comments: false,
          braces: true,
          indent_level: 2,
          max_line_len: 120,
        },
        compress: shouldUglify ? {
          evaluate: false,
          join_vars: false,
          toplevel: true,
          top_retain: [
            'sdkBaseUrl',
            'sdkName',
            'asyncScript',
            'loadOptions'
          ],
          booleans: false
        } : false,
        mangle: shouldUglify ? {
          eval: false,
          reserved: [
            'sdkBaseUrl',
            'sdkName',
            'asyncScript',
            'loadOptions'
          ],
          toplevel: true,
          safari10: true,
        } : false,
      })
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
