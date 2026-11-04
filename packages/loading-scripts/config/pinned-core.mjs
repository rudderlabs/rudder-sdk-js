import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from 'dotenv';

// These are the final CDN outputs, including every Rollup plugin's changes.
export function readPinnedCore(
  coreDir = process.env.PINNED_CORE_DIR ||
    fileURLToPath(new URL('../../analytics-js/dist/cdn/', import.meta.url)),
) {
  const cdnDir = resolve(coreDir);
  const readRequired = file => {
    try {
      return readFileSync(file);
    } catch (cause) {
      throw new Error(
        `Pinned loader requires existing release artifacts: cannot read ${file}. Run after the production core build on the artifacts being uploaded.`,
        { cause },
      );
    }
  };
  const packageFile = resolve(cdnDir, '../../package.json');
  const { version } = JSON.parse(readRequired(packageFile).toString('utf8'));
  if (typeof version !== 'string' || !version) {
    throw new Error(`Pinned loader requires a version in ${packageFile}`);
  }
  const integrity = variant => {
    const file = resolve(cdnDir, `${variant}/iife/rsa.min.js`);
    return `sha384-${createHash('sha384').update(readRequired(file)).digest('base64')}`;
  };
  return { version, modern: integrity('modern'), legacy: integrity('legacy') };
}

// Nx runtime inputs include ignored build artifacts, including custom directories.
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  // Resolve relative overrides as the build command does, from the loader package.
  process.chdir(dirname(fileURLToPath(new URL('../package.json', import.meta.url))));
  config({ quiet: true });
  process.stdout.write(JSON.stringify(readPinnedCore()));
}
