import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { configToIntNames } from '../packages/analytics-js-legacy-utilities/src/config_to_integration_names.js';

const workspace = fileURLToPath(new URL('../', import.meta.url));
const loaderFiles = ['loader.js', 'loader.min.js', 'loader-gtm.js', 'loader-gtm.min.js'];
const inventories = ['analytics-js', 'analytics-js-plugins', 'analytics-js-integrations'].flatMap(
  name =>
    ['legacy', 'modern'].map(variant => ({
      name,
      variant,
      directory: `packages/${name}/dist/cdn/${variant}/${name === 'analytics-js' ? 'iife' : name === 'analytics-js-plugins' ? 'plugins' : 'js-integrations'}`,
    })),
);
inventories.push({
  name: 'loading-scripts',
  variant: null,
  directory: 'packages/loading-scripts/dist',
});

// Independently enumerate clean plugin/integration outputs. Core and loaders
// use known production names so development leftovers are not inventoried.
async function discover(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (relative === 'build-metadata.json') continue;
    if (entry.isDirectory())
      files.push(...(await discover(path.join(directory, entry.name), `${relative}/`)));
    else {
      assert.ok(entry.isFile(), relative);
      files.push(relative);
    }
  }
  return files.sort();
}

test(
  'real CDN inventories ignore leftovers, support loader build order and hash final bytes',
  { timeout: 1200000 },
  async () => {
    const log = path.join(os.tmpdir(), 'sdk-6103-build-metadata-build.log');
    await writeFile(log, '');
    const run = promisify(execFile);
    async function build(name, script, extra = []) {
      try {
        const result = await run('npm', ['run', script, ...extra], {
          cwd: path.join(workspace, 'packages', name),
          env: { ...process.env, NX_DAEMON: 'false' },
          maxBuffer: 100 * 1024 * 1024,
        });
        await writeFile(log, result.stdout + result.stderr, { flag: 'a' });
      } catch (error) {
        await writeFile(log, (error.stdout ?? '') + (error.stderr ?? ''), { flag: 'a' });
        throw new Error(`CDN build failed (exit ${error.code}); see ${log}`, { cause: error });
      }
    }
    for (const { directory } of inventories)
      await rm(path.join(workspace, directory), { recursive: true, force: true });
    // A single-integration rebuild invalidates a previously complete inventory.
    const partial = path.join(
      workspace,
      'packages/analytics-js-integrations/dist/cdn/legacy/js-integrations',
    );
    await mkdir(partial, { recursive: true });
    await writeFile(path.join(partial, 'build-metadata.json'), 'stale inventory');
    await build('analytics-js-integrations', 'build:integration:cli', ['--intg=GA4']);
    await assert.rejects(readFile(path.join(partial, 'build-metadata.json')), { code: 'ENOENT' });
    const loaderDirectory = path.join(workspace, 'packages/loading-scripts/dist');
    async function verifyLoaders(expected) {
      const metadata = JSON.parse(
        await readFile(path.join(loaderDirectory, 'build-metadata.json'), 'utf8'),
      );
      assert.deepEqual(Object.keys(metadata.files), [...expected].sort());
      for (const file of expected) {
        const bytes = await readFile(path.join(loaderDirectory, file));
        assert.deepEqual(metadata.files[file], {
          integrity: `sha384-${createHash('sha384').update(bytes).digest('base64')}`,
          size: bytes.length,
        });
      }
    }
    const minifiedLoaders = loaderFiles.filter(file => file.includes('.min.'));
    // A clean modern-only build must not require unminified loaders.
    await build('loading-scripts', 'build:browser:modern');
    await verifyLoaders(minifiedLoaders);
    await build('loading-scripts', 'build:browser');
    await verifyLoaders(loaderFiles);
    // Rebuild in the other order and prune files removed since the last build.
    for (const file of minifiedLoaders) await rm(path.join(loaderDirectory, file));
    await build('loading-scripts', 'build:browser');
    await verifyLoaders(loaderFiles.filter(file => !file.includes('.min.')));
    await build('loading-scripts', 'build:browser:modern');
    await verifyLoaders(loaderFiles);
    await build('analytics-js', 'build:browser:dev');
    const coreDirectory = path.join(workspace, 'packages/analytics-js/dist/cdn/legacy/iife');
    await readFile(path.join(coreDirectory, 'rsa.js'));
    await readFile(path.join(coreDirectory, 'rsa.js.map'));
    for (const name of ['analytics-js', 'analytics-js-plugins', 'analytics-js-integrations']) {
      await build(name, 'build:browser');
      await build(name, 'build:browser:modern');
    }
    for (const { name, variant, directory } of inventories) {
      const absolute = path.join(workspace, directory);
      const metadata = JSON.parse(
        await readFile(path.join(absolute, 'build-metadata.json'), 'utf8'),
      );
      const pkg = JSON.parse(
        await readFile(path.join(workspace, `packages/${name}/package.json`), 'utf8'),
      );
      assert.equal(metadata.schemaVersion, 1);
      assert.deepEqual(metadata.package, { name: pkg.name, version: pkg.version });
      assert.equal(metadata.variant, variant);
      const files =
        name === 'loading-scripts'
          ? [...loaderFiles].sort()
          : name === 'analytics-js'
            ? ['rsa.min.js', 'rsa.min.js.map']
            : await discover(absolute);
      assert.deepEqual(Object.keys(metadata.files), files, directory);
      assert.ok(files.length > 0);
      assert.ok(!files.some(file => /\.d\.(ts|mts|cts)(\.map)?$/.test(file)));
      for (const file of files) {
        const bytes = await readFile(path.join(absolute, file));
        assert.deepEqual(
          metadata.files[file],
          {
            integrity: `sha384-${createHash('sha384').update(bytes).digest('base64')}`,
            size: bytes.length,
          },
          `${directory}/${file}`,
        );
      }
      if (name === 'analytics-js-integrations') {
        assert.deepEqual(
          files,
          Object.values(configToIntNames)
            .flatMap(integration => [`${integration}.min.js`, `${integration}.min.js.map`])
            .sort(),
        );
      } else if (name === 'analytics-js') {
        assert.deepEqual(files, ['rsa.min.js', 'rsa.min.js.map']);
      } else if (name === 'analytics-js-plugins') {
        assert.ok(metadata.files['rsa-plugins.js']);
        assert.ok(metadata.files['rsa-plugins-common.min.js']);
        if (variant === 'modern')
          assert.ok(files.some(file => file.startsWith('rsa-plugins-remote-')));
      }
    }
  },
);
