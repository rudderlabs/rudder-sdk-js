import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { rollup } from 'rollup';
import { cdnBuildMetadata, metadataFilename, writeBuildMetadata } from './build-metadata.mjs';

const pkg = { name: '@rudderstack/test', version: '1.2.3', ignored: true };
async function fixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'build-metadata-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

test('sorted, deterministic schema hashes final bytes and nested assets', async t => {
  const directory = await fixture(t);
  await mkdir(path.join(directory, 'nested'));
  await writeFile(path.join(directory, 'z.js'), 'final bytes');
  await writeFile(path.join(directory, 'nested/a.js.map'), Buffer.from([0, 255, 10]));
  const emitted = ['z.js', 'nested/a.js.map'];
  const metadata = await writeBuildMetadata(directory, pkg, 'modern', emitted);
  assert.deepEqual(metadata, {
    schemaVersion: 1,
    package: { name: pkg.name, version: pkg.version },
    variant: 'modern',
    files: {
      'nested/a.js.map': {
        integrity: `sha384-${createHash('sha384')
          .update(Buffer.from([0, 255, 10]))
          .digest('base64')}`,
        size: 3,
      },
      'z.js': {
        integrity: `sha384-${createHash('sha384').update('final bytes').digest('base64')}`,
        size: 11,
      },
    },
  });
  const first = await readFile(path.join(directory, metadataFilename), 'utf8');
  await writeBuildMetadata(directory, pkg, 'modern', emitted.reverse());
  assert.equal(await readFile(path.join(directory, metadataFilename), 'utf8'), first);
  assert.equal(first, `${JSON.stringify(metadata, null, 2)}\n`);
  await writeFile(path.join(directory, 'z.js'), 'changed');
  assert.equal((await writeBuildMetadata(directory, pkg, 'modern', emitted)).files['z.js'].size, 7);
});

test('leftover files and symlinks are ignored; only emitted files are recorded', async t => {
  const directory = await fixture(t);
  await writeFile(path.join(directory, 'rsa.min.js'), 'current');
  for (const leftover of [
    'rsa.js',
    'rsa.js.map',
    'old-chunk.js',
    'index.d.ts',
    'index.d.mts.map',
    'artifact.tmp',
    'jest-output.json',
    'archive.tar.gz',
    'index.html',
  ])
    await writeFile(path.join(directory, leftover), 'stale');
  await symlink('absent.js', path.join(directory, 'leftover-link.js'));
  const metadata = await writeBuildMetadata(directory, pkg, 'legacy', ['rsa.min.js']);
  assert.deepEqual(Object.keys(metadata.files), ['rsa.min.js']);
  assert.equal(await readFile(path.join(directory, 'rsa.js'), 'utf8'), 'stale');
  await assert.rejects(
    writeBuildMetadata(directory, pkg, 'legacy', ['missing.js']),
    /Missing emitted CDN artifact: missing.js/,
  );
});

test('invalid emitted paths, declarations and symlinks are rejected', async t => {
  const directory = await fixture(t);
  for (const files of [
    [],
    ['../outside.js'],
    ['/outside.js'],
    ['index.d.cts.map'],
    [metadataFilename],
  ]) {
    await assert.rejects(writeBuildMetadata(directory, pkg, null, files), /deployable relative/);
  }
  await writeFile(path.join(directory, 'a.js'), 'asset');
  await symlink('a.js', path.join(directory, 'link.js'));
  await assert.rejects(
    writeBuildMetadata(directory, pkg, null, ['link.js']),
    /Unsupported CDN artifact/,
  );
});

const loaderFiles = ['loader.js', 'loader.min.js', 'loader-gtm.js', 'loader-gtm.min.js'];

for (const name of ['analytics-js', 'analytics-js-plugins', 'analytics-js-integrations']) {
  const hook =
    name === 'analytics-js-integrations' ? 'invalidate-build-metadata' : 'cdn-build-metadata';
  for (const variant of ['legacy', 'modern']) {
    test(`${name} ${variant} CDN config registers the ${hook} hook`, async () => {
      const env = {
        ...process.env,
        MODULE_TYPE: 'cdn',
        BROWSERSLIST_ENV: variant,
        INTG_NAME: 'GA4',
      };
      delete env.DEV_SERVER;
      const { stdout } = await promisify(execFile)(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          `import assert from 'node:assert/strict';
           import configs from './rollup.config.mjs';
           const cdnConfigs = configs.filter(config =>
             [config.output].flat().some(output =>
               (output.dir ?? output.file).startsWith('dist/cdn/${variant}/')));
           assert.equal(cdnConfigs.length, 1);
           for (const config of cdnConfigs) {
             assert.ok(Array.isArray(config.plugins));
             assert.ok(config.plugins.some(plugin => plugin?.name === '${hook}'));
           }
           console.log('CDN metadata hooks verified');`,
        ],
        { cwd: new URL(`../packages/${name}/`, import.meta.url), env },
      );
      assert.match(stdout, /CDN metadata hooks verified/);
    });
  }
}

test('npm start loader configs keep the metadata hook with DEV_SERVER and no VERSION', async () => {
  const env = { ...process.env, DEV_SERVER: 'true' };
  delete env.VERSION;
  const { stdout } = await promisify(execFile)(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import assert from 'node:assert/strict';
       import configs from './rollup.config.mjs';
       assert.equal(configs.length, 2);
       for (const config of configs) {
         assert.ok(config.plugins.some(plugin => plugin?.name === 'cdn-build-metadata'));
       }
       console.log('start metadata hooks verified');
       // Config creation starts the local server; exit before building or opening a browser.
       process.exit(0);`,
    ],
    { cwd: new URL('../packages/loading-scripts/', import.meta.url), env },
  );
  assert.match(stdout, /start metadata hooks verified/);
});

function permutations(files) {
  return files.length === 0
    ? [[]]
    : files.flatMap((file, index) =>
        permutations(files.filter((_, i) => i !== index)).map(rest => [file, ...rest]),
      );
}

test('loader Rollup outputs support modern-only and all build orders', async t => {
  const root = await fixture(t);
  const source = path.join(root, 'input.js');
  await writeFile(source, 'console.log("loader");');
  const bundle = await rollup({ input: source, plugins: [cdnBuildMetadata(pkg, null)] });
  t.after(() => bundle.close());
  const orders = [loaderFiles.filter(file => file.includes('.min.')), ...permutations(loaderFiles)];
  for (const [index, order] of orders.entries()) {
    const directory = path.join(root, String(index));
    await mkdir(directory);
    await writeFile(path.join(directory, 'index.html'), 'dev server');
    const written = [];
    for (const file of order) {
      await bundle.write({ file: path.join(directory, file), format: 'iife' });
      written.push(file);
      const metadata = JSON.parse(await readFile(path.join(directory, metadataFilename), 'utf8'));
      assert.deepEqual(Object.keys(metadata.files), [...written].sort());
      assert.equal(metadata.variant, null);
    }
  }
});

test('Rollup rebuild updates its entries, preserves other outputs and prunes missing files', async t => {
  const root = await fixture(t);
  const directory = path.join(root, 'dist');
  const source = path.join(root, 'input.js');
  await writeFile(source, 'console.log("loader");');
  const bundle = await rollup({ input: source, plugins: [cdnBuildMetadata(pkg, null)] });
  t.after(() => bundle.close());
  for (const file of loaderFiles) {
    await bundle.write({ file: path.join(directory, file), format: 'iife' });
  }
  const before = JSON.parse(await readFile(path.join(directory, metadataFilename), 'utf8'));
  await rm(path.join(directory, 'loader-gtm.min.js'));
  // An output overwritten outside this write must no longer claim its old hash.
  await writeFile(path.join(directory, 'loader-gtm.js'), 'dev-snapshot');
  await bundle.write({
    file: path.join(directory, 'loader.js'),
    format: 'iife',
    banner: '// rebuilt',
  });
  const after = JSON.parse(await readFile(path.join(directory, metadataFilename), 'utf8'));
  assert.deepEqual(Object.keys(after.files), ['loader.js', 'loader.min.js']);
  assert.notDeepEqual(after.files['loader.js'], before.files['loader.js']);
  assert.deepEqual(after.files['loader.min.js'], before.files['loader.min.js']);
  const bytes = await readFile(path.join(directory, 'loader.js'));
  assert.deepEqual(after.files['loader.js'], {
    integrity: `sha384-${createHash('sha384').update(bytes).digest('base64')}`,
    size: bytes.length,
  });
  assert.ok(!(await readdir(directory)).some(file => file.endsWith('.tmp')));
  await assert.rejects(writeBuildMetadata(directory, pkg, null, ['missing.js']));
  assert.deepEqual(
    JSON.parse(await readFile(path.join(directory, metadataFilename), 'utf8')),
    after,
  );
});

test('every write preserves unchanged entries but does not retain another package version', async t => {
  const directory = await fixture(t);
  await writeFile(path.join(directory, 'old.min.js'), 'old');
  await writeFile(path.join(directory, 'new.min.js'), 'new');
  await writeBuildMetadata(directory, pkg, 'modern', ['old.min.js']);
  const metadata = await writeBuildMetadata(directory, pkg, 'modern', ['new.min.js']);
  assert.deepEqual(Object.keys(metadata.files), ['new.min.js', 'old.min.js']);
  const updated = await writeBuildMetadata(directory, { ...pkg, version: '2.0.0' }, 'modern', [
    'old.min.js',
  ]);
  assert.deepEqual(Object.keys(updated.files), ['old.min.js']);
});

test('rebuild with inline maps retains unchanged leftovers and drops changed obsolete chunks', async t => {
  const root = await fixture(t);
  const directory = path.join(root, 'cdn');
  const source = path.join(root, 'rsa.min.js');
  await writeFile(source, 'console.log("production");');
  let emitObsoleteChunk = true;
  const bundle = await rollup({
    input: source,
    plugins: [
      cdnBuildMetadata(pkg, 'modern'),
      {
        name: 'obsolete-plugin-chunk',
        generateBundle() {
          if (emitObsoleteChunk)
            this.emitFile({ type: 'asset', fileName: 'old-plugin.js', source: 'old plugin' });
        },
      },
    ],
  });
  t.after(() => bundle.close());
  await bundle.write({ dir: directory, format: 'iife', sourcemap: true });
  const before = JSON.parse(await readFile(path.join(directory, metadataFilename), 'utf8'));
  emitObsoleteChunk = false;
  await writeFile(path.join(directory, 'old-plugin.js'), 'changed plugin');
  await bundle.write({ dir: directory, format: 'iife', sourcemap: 'inline' });
  const after = JSON.parse(await readFile(path.join(directory, metadataFilename), 'utf8'));
  // Switching map modes leaves an unchanged external map on disk. The rule
  // retains it because its recorded bytes still match; clean releases remove it.
  assert.deepEqual(Object.keys(after.files), ['rsa.min.js', 'rsa.min.js.map']);
  assert.deepEqual(after.files['rsa.min.js.map'], before.files['rsa.min.js.map']);
  assert.notDeepEqual(after.files['rsa.min.js'], before.files['rsa.min.js']);
  await readFile(path.join(directory, 'old-plugin.js'));
  await writeFile(path.join(directory, 'rsa.min.js.map'), 'stale map bytes');
  await bundle.write({ dir: directory, format: 'iife', sourcemap: 'inline' });
  const final = JSON.parse(await readFile(path.join(directory, metadataFilename), 'utf8'));
  assert.deepEqual(Object.keys(final.files), ['rsa.min.js']);
  await readFile(path.join(directory, 'rsa.min.js.map'));
});

test('final Rollup output hook includes maps and federation assets and waits for final bytes', async t => {
  const root = await fixture(t);
  const directory = path.join(root, 'cdn');
  const source = path.join(root, 'input.js');
  await writeFile(source, 'export const value = 1;');
  const bundle = await rollup({
    input: source,
    plugins: [
      cdnBuildMetadata(pkg, 'modern'),
      {
        name: 'federation-and-final-bytes',
        generateBundle() {
          this.emitFile({ type: 'asset', fileName: 'nested/remoteEntry.js', source: 'remote' });
        },
        async writeBundle() {
          await new Promise(resolve => setTimeout(resolve, 10));
          await writeFile(path.join(directory, 'nested/remoteEntry.js'), 'final remote');
        },
      },
    ],
  });
  t.after(() => bundle.close());
  await bundle.write({ dir: directory, format: 'es', sourcemap: true, banner: '// banner' });
  const metadata = JSON.parse(await readFile(path.join(directory, metadataFilename), 'utf8'));
  assert.deepEqual(Object.keys(metadata.files), [
    'input.js',
    'input.js.map',
    'nested/remoteEntry.js',
  ]);
  assert.equal(metadata.files['nested/remoteEntry.js'].size, 12);
  const bytes = await readFile(path.join(directory, 'input.js'));
  assert.match(bytes.toString(), /banner/);
  assert.equal(
    metadata.files['input.js'].integrity,
    `sha384-${createHash('sha384').update(bytes).digest('base64')}`,
  );
});
