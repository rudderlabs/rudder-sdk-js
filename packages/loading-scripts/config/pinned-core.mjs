import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { config } from 'dotenv';

// Core metadata describes the final CDN bytes, including every plugin's changes.
export function readPinnedCore(
  coreDir = process.env.PINNED_CORE_DIR ||
    fileURLToPath(new URL('../../analytics-js/dist/cdn/', import.meta.url)),
) {
  const cdnDir = resolve(coreDir);
  const readMetadata = variant => {
    const file = resolve(cdnDir, `${variant}/iife/build-metadata.json`);
    let metadata;
    try {
      metadata = JSON.parse(readFileSync(file, 'utf8'));
    } catch (cause) {
      throw new Error(
        `Pinned loader requires valid core metadata: cannot read ${file}. Run after the production core build on the artifacts being uploaded.`,
        { cause },
      );
    }
    const version = metadata?.package?.version;
    if (typeof version !== 'string' || !version.trim()) {
      throw new Error(`Pinned loader requires package.version in ${file}`);
    }
    const integrity = metadata?.files?.['rsa.min.js']?.integrity;
    if (typeof integrity !== 'string' || !/^sha384-[A-Za-z0-9+/]{64}$/.test(integrity)) {
      throw new Error(`Pinned loader requires rsa.min.js with SHA-384 integrity in ${file}`);
    }
    // Read only the required fields; future metadata additions are ignored.
    return { version, integrity };
  };
  const modern = readMetadata('modern');
  const legacy = readMetadata('legacy');
  if (modern.version !== legacy.version) {
    throw new Error(
      `Pinned loader requires matching package.version in modern and legacy core metadata: ${modern.version} !== ${legacy.version}`,
    );
  }
  return { version: modern.version, modern: modern.integrity, legacy: legacy.integrity };
}

// Nx runtime inputs include ignored build artifacts, including custom directories.
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  // Resolve relative overrides as the build command does, from the loader package.
  process.chdir(dirname(fileURLToPath(new URL('../package.json', import.meta.url))));
  config({ quiet: true });
  process.stdout.write(JSON.stringify(readPinnedCore()));
}
