import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';
import {
  getDefaultConfig,
  distName,
  modName,
  remotePluginsExportsFilename,
  getRemotePluginFileName,
  pluginsMap,
  outDirCDN,
  outputFilesCdn,
  sourceAliasEntries,
} from './rollup.config.mjs';

// @module-federation/vite names each expose entry after its key: `./BeaconQueue` → `BeaconQueue`
const exposedEntries = Object.fromEntries(
  Object.keys(pluginsMap).map(key => [key.slice(2), getRemotePluginFileName(key)]),
);

/**
 * Vite plugin that sets the output names of the CDN bundle. @module-federation/vite emits each
 * expose as `<ExposeName>.js` and its chunks as `assets/[name]-[hash].js`. Keep the published
 * names instead: `rsa-plugins-remote-<Plugin>.min.js` for the plugins (the SDK imports them by
 * that name, so it is fixed, minified or not) and `rsa-plugins-<chunk>(.min).js` for shared
 * chunks. The federation plugin is `enforce: 'pre'`, so this config hook runs after it and wins.
 * @param {import('rollup').OutputOptions} cdnOutput CDN output options of rollup.config.mjs
 * @returns {import('vite').Plugin} The Vite plugin
 */
const cdnOutputNames = cdnOutput => ({
  name: 'rudderstack:cdn-output-names',
  apply: 'build',
  config: () => ({
    build: {
      rollupOptions: {
        // Added to the expose entries: the index of all plugins, published next to them as before
        input: { index: 'src/index.ts' },
        output: {
          entryFileNames: chunkInfo => exposedEntries[chunkInfo.name] ?? '[name].js',
          chunkFileNames: cdnOutput.chunkFileNames,
        },
      },
    },
  }),
});

/**
 * Vite plugin that emits `rsa-plugins.js`, a compatibility container for SDK versions built with
 * @originjs/vite-plugin-federation: they import `<pluginsCDNPath>/rsa-plugins.js`, call
 * `init(shareScope)` and then `get('./<Plugin>')`, whose factory returns the plugin module.
 * Nothing is shared, so `init` has nothing to do; `get` rejects for an unknown expose key.
 * @returns {import('vite').Plugin} The Vite plugin
 */
const compatContainer = () => ({
  name: 'rudderstack:compat-remote-entry',
  apply: 'build',
  generateBundle() {
    const names = Object.keys(pluginsMap).map(key => key.slice(2));
    // Opaque to bundlers (`webpackIgnore`, name built at runtime), so that tools bundling this
    // file (size-limit) do not pull the plugins in, as with the OriginJS remote entry
    const [prefix, suffix] = getRemotePluginFileName('./%').split('%');
    this.emitFile({
      type: 'asset',
      fileName: remotePluginsExportsFilename,
      source:
        `var n=${JSON.stringify(names)},p="./${prefix}";export function init(){}` +
        'export function get(k){var x=k.slice(2);return n.indexOf(x)<0?' +
        'Promise.reject(new Error("Module "+k+" does not exist in container.")):' +
        `import(/* webpackIgnore: true */p+x+"${suffix}").then(function(e){return function(){return e}})}\n`,
    });
  },
});

/**
 * Vite configuration of the CDN bundle: one ES module per plugin, which the SDK loads with a
 * dynamic import of `<pluginsCDNPath>/rsa-plugins-remote-<Plugin>.min.js`. The SDK and the plugins
 * share nothing, so the remote uses the `hostProvidesAllShared` mode of @module-federation/vite:
 * no Module Federation runtime and no remote entry, only the expose entries and `mf-manifest.json`.
 * @returns {import('vite').UserConfig} The Vite configuration
 */
export default defineConfig(() => {
  const rollupConfig = getDefaultConfig(distName, { forVite: true });
  const [cdnOutput] = outputFilesCdn;
  const plugins = rollupConfig.plugins.filter(Boolean);
  // Same position as the OriginJS plugin had: after Babel, before Terser
  const babelIndex = plugins.findIndex(plugin => plugin.name === 'babel');

  plugins.splice(
    babelIndex + 1,
    0,
    federation({
      name: modName,
      exposes: pluginsMap,
      shared: {},
      dts: false,
      experiments: { hostProvidesAllShared: true },
    }),
    cdnOutputNames(cdnOutput),
    compatContainer(),
  );

  return {
    configFile: false,
    // Chunks are imported relative to each other, so the bundle works from any base path
    // (versioned CDN directories, proxied plugins URL)
    base: './',
    publicDir: false,
    // TypeScript and syntax lowering are done by the same Rollup TypeScript and Babel plugins as
    // the other builds, so the output targets the package browserslist
    esbuild: false,
    resolve: {
      alias: sourceAliasEntries,
      extensions: ['.js', '.ts', '.mjs'],
      mainFields: ['browser', 'module', 'jsnext:main', 'jsnext', 'main'],
    },
    plugins,
    build: {
      outDir: outDirCDN,
      emptyOutDir: true,
      target: 'esnext',
      // Terser runs as a Rollup plugin when UGLIFY=true, as in the other builds
      minify: false,
      cssCodeSplit: false,
      modulePreload: false,
      reportCompressedSize: false,
      sourcemap: cdnOutput.sourcemap,
      commonjsOptions: {
        include: /node_modules/,
        requireReturnsDefault: 'auto',
      },
      rollupOptions: {
        external: rollupConfig.external,
        onwarn: rollupConfig.onwarn,
        output: {
          format: 'es',
          generatedCode: cdnOutput.generatedCode,
          manualChunks: cdnOutput.manualChunks,
        },
      },
    },
  };
});
