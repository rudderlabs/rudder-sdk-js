import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
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
  await bundle.write({
    file: path.join(directory, 'loader.js'),
    format: 'iife',
    banner: '// rebuilt',
  });
  const after = JSON.parse(await readFile(path.join(directory, metadataFilename), 'utf8'));
  assert.deepEqual(
    Object.keys(after.files),
    loaderFiles.filter(file => file !== 'loader-gtm.min.js').sort(),
  );
  assert.notDeepEqual(after.files['loader.js'], before.files['loader.js']);
  assert.deepEqual(after.files['loader.min.js'], before.files['loader.min.js']);
  assert.deepEqual(after.files['loader-gtm.js'], before.files['loader-gtm.js']);
  const bytes = await readFile(path.join(directory, 'loader.js'));
  assert.deepEqual(after.files['loader.js'], {
    integrity: `sha384-${createHash('sha384').update(bytes).digest('base64')}`,
    size: bytes.length,
  });
  assert.ok(!(await readdir(directory)).some(file => file.endsWith('.tmp')));
  await assert.rejects(writeBuildMetadata(directory, pkg, null, ['missing.js'], { upsert: true }));
  assert.deepEqual(
    JSON.parse(await readFile(path.join(directory, metadataFilename), 'utf8')),
    after,
  );
});

test('orchestrator writes replace the inventory, and upserts do not retain another package version', async t => {
  const directory = await fixture(t);
  await writeFile(path.join(directory, 'old.min.js'), 'old');
  await writeFile(path.join(directory, 'new.min.js'), 'new');
  await writeBuildMetadata(directory, pkg, 'modern', ['old.min.js']);
  const metadata = await writeBuildMetadata(directory, pkg, 'modern', ['new.min.js']);
  assert.deepEqual(Object.keys(metadata.files), ['new.min.js']);
  const updated = await writeBuildMetadata(
    directory,
    { ...pkg, version: '2.0.0' },
    'modern',
    ['old.min.js'],
    { upsert: true },
  );
  assert.deepEqual(Object.keys(updated.files), ['old.min.js']);
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
