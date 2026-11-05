import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const variants = ['modern', 'legacy'];
const version = '3.36.0-beta+metadata';
const hash = bytes => `sha384-${createHash('sha384').update(bytes).digest('base64')}`;
const fixture = variant => ({
  schemaVersion: 1,
  package: { name: '@rudderstack/analytics-js', version },
  variant,
  files: { 'rsa.min.js': { integrity: hash(`${variant} release bytes\n`), size: 21 } },
  futureField: { ignored: true },
});

const readCore = root => {
  const moduleUrl = pathToFileURL(join(__dirname, '../config/pinned-core.mjs')).href;
  return spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { readPinnedCore } from ${JSON.stringify(moduleUrl)}; process.stdout.write(JSON.stringify(readPinnedCore()));`,
    ],
    { encoding: 'utf8', env: { ...process.env, PINNED_CORE_DIR: root } },
  );
};

// Metadata-only fixtures deliberately have neither package.json nor core files.
describe('pinned core inputs', () => {
  let root;
  const output = variant => join(root, `${variant}/iife`);
  const writeMetadata = (variant, metadata) => {
    writeFileSync(join(output(variant), 'build-metadata.json'), JSON.stringify(metadata));
  };

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'pinned-core-'));
    for (const variant of variants) {
      mkdirSync(output(variant), { recursive: true });
      writeMetadata(variant, fixture(variant));
    }
  });

  afterEach(() => rmSync(root, { recursive: true, force: true }));

  it('reads the supplied metadata version and hashes, ignoring unknown fields', () => {
    for (const variant of variants) {
      const metadata = fixture(variant);
      metadata.files['rsa.min.js'].futureField = 'ignored';
      metadata.files['unrelated.js'] = { futureField: true };
      writeMetadata(variant, metadata);
    }
    const result = readCore(root);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      version,
      modern: fixture('modern').files['rsa.min.js'].integrity,
      legacy: fixture('legacy').files['rsa.min.js'].integrity,
    });
  });

  it('matches the real file SHA-384 when metadata and core files both exist', () => {
    const expected = { version };
    for (const variant of variants) {
      const bytes = Buffer.from(`${variant} actual final core bytes\n`);
      writeFileSync(join(output(variant), 'rsa.min.js'), bytes);
      const metadata = fixture(variant);
      metadata.files['rsa.min.js'] = { integrity: hash(bytes), size: bytes.length };
      writeMetadata(variant, metadata);
      expected[variant] = hash(bytes);
    }
    const result = readCore(root);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual(expected);
  });

  it.each(variants)('fails clearly when %s metadata is missing', variant => {
    rmSync(join(output(variant), 'build-metadata.json'));
    const result = readCore(root);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(`${variant}/iife/build-metadata.json`);
    expect(result.stderr).toContain('requires valid core metadata');
    expect(result.stderr).toContain('Run after the production core build');
  });

  it.each(variants)('fails clearly when %s metadata is malformed', variant => {
    writeFileSync(join(output(variant), 'build-metadata.json'), '{');
    const result = readCore(root);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(`${variant}/iife/build-metadata.json`);
    expect(result.stderr).toContain('requires valid core metadata');
  });

  it.each(variants)('fails clearly when the %s rsa.min.js entry is missing', variant => {
    const metadata = fixture(variant);
    delete metadata.files['rsa.min.js'];
    writeMetadata(variant, metadata);
    const result = readCore(root);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(`${variant}/iife/build-metadata.json`);
    expect(result.stderr).toContain('requires rsa.min.js with SHA-384 integrity');
  });

  it.each([undefined, '', 'sha256-invalid'])('rejects invalid integrity %s', integrity => {
    const metadata = fixture('modern');
    metadata.files['rsa.min.js'].integrity = integrity;
    writeMetadata('modern', metadata);
    const result = readCore(root);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('requires rsa.min.js with SHA-384 integrity');
  });

  it.each([undefined, '', 123])('rejects invalid package.version %s', invalidVersion => {
    const metadata = fixture('modern');
    metadata.package.version = invalidVersion;
    writeMetadata('modern', metadata);
    const result = readCore(root);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('requires package.version');
  });

  it('rejects mismatched modern and legacy versions', () => {
    const metadata = fixture('legacy');
    metadata.package.version = 'different-release';
    writeMetadata('legacy', metadata);
    const result = readCore(root);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('requires matching package.version');
  });
});
