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
const isLegacyBuild = process.env.BROWSERSLIST_ENV !== 'modern';
const variantSubfolder = isLegacyBuild ? '/legacy' : '/modern';
const bundledPluginsList = process.env.BUNDLED_PLUGINS;
const isDynamicCustomBuild = Boolean(bundledPluginsList);
const isModuleFederatedBuild = !isDynamicCustomBuild && !isLegacyBuild;
const sourceMapType =
  process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true';
const cdnPath = isDynamicCustomBuild ? `dynamicCdnBundle`: `cdn`
const remotePluginsBasePath = process.env.REMOTE_MODULES_BASE_PATH || `http://localhost:3002/${cdnPath}/`;
const outDirNpmRoot = `dist/npm`;
const outDirCDNRoot = isDynamicCustomBuild ? `dist/${cdnPath}`: `dist/${cdnPath}`;
const outDirNpm = `${outDirNpmRoot}${variantSubfolder}${isDynamicCustomBuild ? '/bundled' :''}`;
const outDirCDN = `${outDirCDNRoot}${variantSubfolder}`;
const distName = 'rsa';
const modName = 'rudderanalytics';
const remotePluginsExportsFilename = `rsa-plugins`;
const remotePluginsHostPromise = 'Promise.resolve(window.RudderStackGlobals && window.RudderStackGlobals.app && window.RudderStackGlobals.app.pluginsCDNPath ? "" + window.RudderStackGlobals.app.pluginsCDNPath + "/' + `${remotePluginsExportsFilename}.js` + '" : ' + `"${remotePluginsBasePath}/${remotePluginsExportsFilename}.js` + '")';
const moduleType = process.env.MODULE_TYPE || 'cdn';
const isNpmPackageBuild = moduleType === 'npm';
const isCDNPackageBuild = moduleType === 'cdn';

// Configuration to exclude plugin imports for generated bundle
const getExternalsConfig = () => {
  const externalGlobalsConfig = {}

  if(isModuleFederatedBuild) {
    externalGlobalsConfig['./bundledBuildPluginImports'] = '{}';
    return externalGlobalsConfig;
  } else {
    externalGlobalsConfig['./federatedModulesBuildPluginImports'] = '{}';
  }

  if(bundledPluginsList === 'all') {
    return externalGlobalsConfig;
  }

  if(isDynamicCustomBuild) {
    if (!bundledPluginsList.includes('BeaconQueue')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/beaconQueue'] = '{}';
    }

    if (!bundledPluginsList.includes('Bugsnag')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/bugsnag'] = '{}';
    }

    if (!bundledPluginsList.includes('DeviceModeDestinations')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/deviceModeDestinations'] = '{}';
    }

    if (!bundledPluginsList.includes('DeviceModeTransformation')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/deviceModeTransformation'] = '{}';
    }

    if (!bundledPluginsList.includes('ErrorReporting')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/errorReporting'] = '{}';
    }

    if (!bundledPluginsList.includes('ExternalAnonymousId')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/externalAnonymousId'] = '{}';
    }

    if (!bundledPluginsList.includes('GoogleLinker')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/googleLinker'] = '{}';
    }

    if (!bundledPluginsList.includes('KetchConsentManager')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/ketchConsentManager'] = '{}';
    }

    if (!bundledPluginsList.includes('NativeDestinationQueue')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/nativeDestinationQueue'] = '{}';
    }

    if (!bundledPluginsList.includes('OneTrustConsentManager')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/oneTrustConsentManager'] = '{}';
    }

    if (!bundledPluginsList.includes('StorageEncryption')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/storageEncryption'] = '{}';
    }

    if (!bundledPluginsList.includes('StorageEncryptionLegacy')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/storageEncryptionLegacy'] = '{}';
    }

    if (!bundledPluginsList.includes('StorageMigrator')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/storageMigrator'] = '{}';
    }

    if (!bundledPluginsList.includes('XhrQueue') && bundledPluginsList.includes('BeaconQueue')) {
      externalGlobalsConfig['@rudderstack/analytics-js-plugins/xhrQueue'] = '{}';
    }
  }

  return externalGlobalsConfig;
}

// Output in console to assist debugging bundle builds
const configSummaryOutput = () => {
  if(isDynamicCustomBuild) {
    console.log(`Custom Bundle. Including plugins: ${bundledPluginsList}`);
  }

  if(isLegacyBuild) {
    console.log(`Legacy Bundle.`)
  }

  if(isModuleFederatedBuild) {
    console.log(`Federated Modules Bundle.`)
  }

  console.log(`Replaces imports in build time: `, getExternalsConfig());
}

export function getDefaultConfig(distName) {
  const version = process.env.VERSION || 'dev-snapshot';
  const isLocalServerEnabled = isCDNPackageBuild && process.env.DEV_SERVER;
  configSummaryOutput();

  return {
    watch: {
      include: ['src/**'],
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
        __BUNDLE_ALL_PLUGINS__: isLegacyBuild || isDynamicCustomBuild,
        __IS_DYNAMIC_CUSTOM_BUNDLE__: isDynamicCustomBuild,
        __BUNDLED_PLUGINS_LIST__: bundledPluginsList ?? '',
        __IS_LEGACY_BUILD__: isLegacyBuild,
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
      externalGlobals(getExternalsConfig()),
      !isLegacyBuild &&
      federation({
        remotes: {
          rudderAnalyticsRemotePlugins: {
            // use promise to set the path to allow override via loadOption value in case of proxy
            // https://github.com/originjs/vite-plugin-federation#externaltype-urlpromise
            external: remotePluginsHostPromise,
            externalType: 'promise',
            format: 'esm'
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
          attrs: ['async'],
          replaceVars: {
            __WRITE_KEY__: process.env.WRITE_KEY,
            __DATAPLANE_URL__: process.env.DATAPLANE_URL,
            __CONFIG_SERVER_HOST__:
              process.env.CONFIG_SERVER_HOST || '',
            __DEST_SDK_BASE_URL__: process.env.DEST_SDK_BASE_URL,
            __PLUGINS_BASE_URL__: remotePluginsBasePath,
            __SDK_BUNDLE_FILENAME__: distName,
          },
        }),
      isLocalServerEnabled &&
        serve({
          open: true,
          openPage: `/${cdnPath}/${isLegacyBuild ? 'legacy' : 'modern'}/iife/index.html`,
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
            },
            {
              find: '@rudderstack/analytics-js-common',
              replacement: path.resolve('./dist/dts/packages/analytics-js-common/src'),
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
