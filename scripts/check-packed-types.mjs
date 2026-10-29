#!/usr/bin/env node
// Type-checks the packed tarball of the package in the cwd from a bare consumer project
// (skipLibCheck: false, no other packages installed), as published packages ship without dependencies.
// Usage (from a package dir, after build): node ../../scripts/check-packed-types.mjs [consumer.ts]
// An optional consumer file is appended to every generated consumer module to check real usage.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const tsc = require.resolve('typescript/bin/tsc');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const specifiers = Object.keys(pkg.exports ?? { '.': null })
  .filter(key => !key.includes('*') && !key.endsWith('.json'))
  .map(key => path.posix.join(pkg.name, key));

// The mixed ESM + CJS programs load both .d.mts and .d.cts, so they catch conflicting global declarations
const configs = [
  { module: 'esnext', moduleResolution: 'bundler', files: ['index.ts'] },
  { module: 'node16', moduleResolution: 'node16', files: ['index.mts'] },
  { module: 'node16', moduleResolution: 'node16', files: ['index.cts'] },
  { module: 'node16', moduleResolution: 'node16', files: ['index.mts', 'index.cts'] },
  { module: 'nodenext', moduleResolution: 'nodenext', files: ['index.mts'] },
  { module: 'nodenext', moduleResolution: 'nodenext', files: ['index.cts'] },
  { module: 'nodenext', moduleResolution: 'nodenext', files: ['index.mts', 'index.cts'] },
  // node10 ignores `exports` and resolves through `types`/`typesVersions`
  {
    module: 'commonjs',
    moduleResolution: 'node10',
    files: ['index.ts'],
    ignoreDeprecations: '6.0',
  },
];

const workDir = mkdtempSync(path.join(tmpdir(), 'check-packed-types-'));
let failed = false;

try {
  const [{ filename }] = JSON.parse(
    execFileSync('npm', ['pack', '--json', '--pack-destination', workDir], { encoding: 'utf8' }),
  );
  const installDir = path.join(workDir, 'node_modules', pkg.name);
  mkdirSync(installDir, { recursive: true });
  execFileSync('tar', [
    '-xzf',
    path.join(workDir, filename),
    '-C',
    installDir,
    '--strip-components=1',
  ]);

  const consumer = process.argv[2] ? readFileSync(process.argv[2], 'utf8') : '';
  const source =
    specifiers.map((spec, i) => `import * as m${i} from '${spec}';\nvoid m${i};\n`).join('') +
    consumer;
  for (const file of ['index.ts', 'index.mts', 'index.cts']) {
    writeFileSync(path.join(workDir, file), source);
  }
  writeFileSync(
    path.join(workDir, 'package.json'),
    JSON.stringify({ type: 'module', private: true }),
  );

  for (const { files, ...compilerOptions } of configs) {
    const label = `module: ${compilerOptions.module}, ${files.join(' + ')}`;
    const tsconfig = path.join(
      workDir,
      `tsconfig.${compilerOptions.module}.${files.join('+')}.json`,
    );
    writeFileSync(
      tsconfig,
      JSON.stringify({
        compilerOptions: {
          ...compilerOptions,
          target: 'es2020',
          lib: ['es2020', 'dom'],
          types: [],
          strict: true,
          skipLibCheck: false,
          noEmit: true,
        },
        files,
      }),
    );
    try {
      execFileSync(process.execPath, [tsc, '-p', tsconfig], { stdio: 'inherit' });
      console.log(`✔ ${pkg.name} types compile (${label})`);
    } catch {
      console.error(`✖ ${pkg.name} types fail to compile (${label})`);
      failed = true;
    }
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
}

process.exit(failed ? 1 : 0);
