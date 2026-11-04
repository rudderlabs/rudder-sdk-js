import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

describe('pinned core inputs', () => {
  it('hashes only the supplied release directory and reads its package version', () => {
    const root = mkdtempSync(join(tmpdir(), 'pinned-core-'));
    try {
      const version = 'test-release-beta';
      writeFileSync(join(root, 'package.json'), JSON.stringify({ version }));
      const expected = { version };
      for (const variant of ['modern', 'legacy']) {
        const bytes = Buffer.from(`${variant} release bytes\n`);
        const output = join(root, `dist/cdn/${variant}/iife`);
        mkdirSync(output, { recursive: true });
        writeFileSync(join(output, 'rsa.min.js'), bytes);
        expected[variant] = `sha384-${createHash('sha384').update(bytes).digest('base64')}`;
      }
      const moduleUrl = pathToFileURL(join(__dirname, '../config/pinned-core.mjs')).href;
      const result = spawnSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          `import { readPinnedCore } from ${JSON.stringify(moduleUrl)}; process.stdout.write(JSON.stringify(readPinnedCore()));`,
        ],
        { encoding: 'utf8', env: { ...process.env, PINNED_CORE_DIR: join(root, 'dist/cdn') } },
      );
      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout)).toEqual(expected);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.each(['modern', 'legacy'])('fails when the final %s core is missing', missing => {
    const root = mkdtempSync(join(tmpdir(), 'pinned-core-'));
    try {
      writeFileSync(join(root, 'package.json'), JSON.stringify({ version: 'test-version' }));
      const present = missing === 'modern' ? 'legacy' : 'modern';
      const output = join(root, `dist/cdn/${present}/iife`);
      mkdirSync(output, { recursive: true });
      writeFileSync(join(output, 'rsa.min.js'), 'core bytes');
      const moduleUrl = pathToFileURL(join(__dirname, '../config/pinned-core.mjs')).href;
      const result = spawnSync(
        process.execPath,
        [
          '--input-type=module',
          '-e',
          `import { readPinnedCore } from ${JSON.stringify(moduleUrl)}; readPinnedCore(process.argv[1]);`,
          join(root, 'dist/cdn'),
        ],
        { encoding: 'utf8' },
      );
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain(`${missing}/iife/rsa.min.js`);
      expect(result.stderr).toContain('requires existing release artifacts');
      expect(result.stderr).toContain('Run after the production core build');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
