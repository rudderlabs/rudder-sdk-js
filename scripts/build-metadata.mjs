import { createHash, randomUUID } from 'node:crypto';
import { lstat, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const metadataFilename = 'build-metadata.json';

export async function removeBuildMetadata(directory) {
  await rm(path.join(directory, metadataFilename), { force: true });
}

function validateFiles(files) {
  if (
    files.length === 0 ||
    files.some(
      file =>
        file === metadataFilename ||
        path.isAbsolute(file) ||
        file.split('/').includes('..') ||
        /\.d\.(?:ts|mts|cts)(?:\.map)?$/.test(file),
    )
  ) {
    throw new Error('Expected a nonempty set of deployable relative artifact paths');
  }
}

async function isArtifactFile(directory, file) {
  try {
    if (!(await lstat(path.join(directory, file))).isFile()) {
      throw new Error(`Unsupported CDN artifact: ${file}`);
    }
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

// Readers must ignore unknown top-level and per-file fields. Future metadata is
// additive; integrity is one field, not the purpose or identity of the schema.
// Only emitted paths are hashed; unrelated files in the directory are ignored.
export async function writeBuildMetadata(
  directory,
  pkg,
  variant,
  emittedFiles,
  { upsert = false } = {},
) {
  const expected = [...new Set(emittedFiles)].sort();
  validateFiles(expected);
  const files = {};
  if (upsert) {
    let previous;
    try {
      previous = JSON.parse(await readFile(path.join(directory, metadataFilename), 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (
      previous?.package.name === pkg.name &&
      previous.package.version === pkg.version &&
      previous.variant === variant
    ) {
      const entries = Object.keys(previous.files);
      if (entries.length > 0) validateFiles(entries);
      for (const file of entries) {
        if (!expected.includes(file) && (await isArtifactFile(directory, file))) {
          files[file] = previous.files[file];
        }
      }
    }
  }
  for (const file of expected) {
    if (!(await isArtifactFile(directory, file))) {
      throw new Error(`Missing emitted CDN artifact: ${file}`);
    }
    const bytes = await readFile(path.join(directory, file));
    files[file] = {
      integrity: `sha384-${createHash('sha384').update(bytes).digest('base64')}`,
      size: bytes.length,
    };
  }
  const metadata = {
    schemaVersion: 1,
    package: { name: pkg.name, version: pkg.version },
    variant,
    files: Object.fromEntries(
      Object.keys(files)
        .sort()
        .map(file => [file, files[file]]),
    ),
  };
  const temporary = path.join(directory, `.${metadataFilename}.${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, `${JSON.stringify(metadata, null, 2)}\n`);
    await rename(temporary, path.join(directory, metadataFilename));
  } finally {
    await rm(temporary, { force: true });
  }
  return metadata;
}

export function cdnBuildMetadata(pkg, variant) {
  return {
    name: 'cdn-build-metadata',
    writeBundle: {
      order: 'post',
      sequential: true,
      async handler(output, bundle) {
        // Rollup includes external maps and federation assets in this bundle.
        // Configs writing the same directory run sequentially in one process.
        await writeBuildMetadata(
          output.dir ?? path.dirname(output.file),
          pkg,
          variant,
          Object.keys(bundle),
          { upsert: true },
        );
      },
    },
  };
}
