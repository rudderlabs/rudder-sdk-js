const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const zlib = require('node:zlib');
const test = require('node:test');
const {
  sha384,
  generateManifest,
  resourceCatalog,
  validateCompleteness,
  writeManifest,
  loadPublication,
  listKeys,
  preflight,
  upload,
  verify,
  contentType,
  assertMovingDestinations,
  assertRollbackDestinations,
} = require('./publication');
const { awsInterface } = require('./aws');
const { listing, prepare, archives } = require('./prepare');

async function temp(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cdn-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  return root;
}

async function put(root, file, body = 'body') {
  await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true });
  await fs.writeFile(path.join(root, file), body);
}

async function completeTree(root, sdk = '@rudderstack/analytics-js', repo) {
  const catalog = await resourceCatalog(repo);
  const files = [];
  if (sdk === '@rudderstack/analytics-js-loading-scripts') {
    files.push('loader.js', 'loader.min.js', 'loader-gtm.js', 'loader-gtm.min.js');
  } else {
    for (const variant of ['legacy', 'modern']) {
      const prefix = variant === 'legacy' && sdk === 'rudder-sdk-js' ? '' : `${variant}/`;
      files.push(`${prefix}${sdk === 'rudder-sdk-js' ? 'rudder-analytics' : 'rsa'}.min.js`);
      for (const name of catalog.integrations.keys())
        files.push(`${prefix}js-integrations/${name}.min.js`);
    }
    if (sdk === '@rudderstack/analytics-js')
      files.push(
        'modern/plugins/rsa-plugins.js',
        ...catalog.plugins.map(name => `modern/plugins/rsa-plugins-remote-${name}.min.js`),
      );
    files.push(...files.map(file => `${file}.map`));
  }
  for (const file of files) await put(root, file);
  return files;
}

function gnuTar(t) {
  const { execFileSync } = require('node:child_process');
  let tar;
  for (const candidate of [process.env.CDN_TAR, 'tar', 'gtar'].filter(Boolean)) {
    try {
      if (execFileSync(candidate, ['--version'], { encoding: 'utf8' }).includes('GNU tar')) {
        tar = candidate;
        break;
      }
    } catch {
      /* Try the next installed tar. */
    }
  }
  if (!tar) {
    t.skip('GNU tar is not installed');
    return undefined;
  }
  return tar;
}

const bodies = { 'core.js': Buffer.from('core'), 'chunk.js': Buffer.from('chunk') };
const publication = {
  root: '/local',
  prefix: '3.0.0/',
  objects: Object.fromEntries(Object.entries(bodies).map(([key, body]) => [key, sha384(body)])),
};
function mock(existing = Object.keys(bodies)) {
  const calls = { puts: [], gets: [], sleeps: [], http: [] };
  return {
    calls,
    list: async () => ({ Contents: existing.map(key => ({ Key: `3.0.0/${key}` })) }),
    get: async key => {
      calls.gets.push(key);
      return bodies[key.slice(6)];
    },
    put: async (...args) => {
      calls.puts.push(args);
    },
    http: async key => {
      calls.http.push(key);
      return { status: 200, body: bodies[key.slice(6)] };
    },
    sleep: async ms => {
      calls.sleeps.push(ms);
    },
  };
}

test('manifest contains sorted SRI digests, includes nested files and excludes itself', async t => {
  const root = await temp(t);
  await fs.mkdir(path.join(root, 'nested'));
  await fs.writeFile(path.join(root, 'z.js'), 'core');
  await fs.writeFile(path.join(root, 'nested/a.js'), 'chunk');
  const sdk = { name: '@rudderstack/analytics-js-loading-scripts', version: '3.0.0' };
  await completeTree(root, sdk.name);
  const hashes = await writeManifest(root, { sdk });
  const manifestBody = await fs.readFile(path.join(root, 'manifest.json'));
  const manifest = JSON.parse(manifestBody);
  assert.deepEqual(Object.keys(manifest), ['schemaVersion', 'sdk', 'resources']);
  assert.equal(manifest.schemaVersion, 1);
  assert.deepEqual(manifest.sdk, sdk);
  assert.deepEqual(
    manifest.resources,
    ['loader-gtm.js', 'loader-gtm.min.js', 'loader.js', 'loader.min.js', 'nested/a.js', 'z.js'].map(
      file => ({
        type: file.startsWith('loader') ? 'loader' : 'other',
        variant: null,
        path: file,
        integrity: hashes[file],
        size: file === 'nested/a.js' ? 5 : 4,
      }),
    ),
  );
  assert.ok(manifestBody.toString().endsWith('\n'));
  assert.equal(
    hashes['z.js'],
    `sha384-${require('node:crypto').createHash('sha384').update('core').digest('base64')}`,
  );
  assert.equal(hashes['manifest.json'], sha384(manifestBody));
  assert.deepEqual((await loadPublication(root, 'js-sdk-loader-scripts/3.0.0/')).objects, hashes);
  await fs.utimes(path.join(root, 'z.js'), 100, 100);
  assert.deepEqual(await writeManifest(root, { sdk }), hashes);
  await fs.writeFile(path.join(root, 'z.js'), 'changed');
  await assert.rejects(
    loadPublication(root, 'js-sdk-loader-scripts/3.0.0/'),
    /changed after manifest/,
  );
  await assert.rejects(loadPublication(root, 'v3/'), /versioned prefix/);
  await assert.rejects(loadPublication(root, '3.0.0'), /trailing slash/);
});

test('empty trees and symlinks fail manifest generation', async t => {
  const root = await temp(t);
  await assert.rejects(writeManifest(root), /Empty/);
  await fs.symlink('/outside', path.join(root, 'link'));
  await assert.rejects(generateManifest(root), /Unsupported/);
});

test('preflight empty prefix permits all uploads', async () => {
  const io = mock([]);
  const matching = await preflight(publication, io);
  assert.equal(matching.size, 0);
  await upload(publication, io, matching);
  assert.equal(io.calls.puts.length, 2);
  assert.deepEqual(io.calls.puts[0], ['3.0.0/core.js', '/local/core.js', 'text/javascript']);
});

test('preflight partial match skips matching keys', async () => {
  const io = mock(['core.js']);
  const matching = await preflight(publication, io);
  await upload(publication, io, matching);
  assert.deepEqual([...matching], ['core.js']);
  assert.equal(io.calls.puts.length, 1);
  assert.equal(io.calls.puts[0][0], '3.0.0/chunk.js');
});

test('preflight full match skips all uploads', async () => {
  const io = mock();
  await upload(publication, io, await preflight(publication, io));
  assert.equal(io.calls.puts.length, 0);
});

for (const condition of ['mismatch', 'extra key', 'AWS failure']) {
  test(`preflight fails on ${condition}`, async () => {
    const io = mock(condition === 'extra key' ? ['unexpected.js'] : ['core.js']);
    if (condition === 'mismatch') io.get = async () => Buffer.from('different');
    if (condition === 'AWS failure')
      io.list = async () => {
        throw new Error('AccessDenied');
      };
    await assert.rejects(
      preflight(publication, io),
      condition === 'AWS failure' ? /AccessDenied/ : /Release a new version/,
    );
    assert.equal(io.calls.puts.length, 0);
  });
}

test('S3 enumeration paginates fully with trailing slash; pagination and AWS errors fail closed', async () => {
  const tokens = [];
  const io = {
    list: async (prefix, token) => {
      assert.equal(prefix, '3.0.0/');
      tokens.push(token);
      return token
        ? { Contents: [{ Key: '3.0.0/chunk.js' }] }
        : {
            Contents: [{ Key: '3.0.0/core.js' }],
            IsTruncated: true,
            NextContinuationToken: 'next',
          };
    },
  };
  assert.deepEqual(await listKeys(io, '3.0.0/'), ['3.0.0/core.js', '3.0.0/chunk.js']);
  assert.deepEqual(tokens, [undefined, 'next']);
  io.list = async () => ({ IsTruncated: true });
  await assert.rejects(listKeys(io, '3.0.0/'), /pagination/);
  io.list = async (_, token) => {
    if (token) throw new Error('AWS failed');
    return { IsTruncated: true, NextContinuationToken: 'next' };
  };
  await assert.rejects(listKeys(io, '3.0.0/'), /AWS failed/);
});

for (const condition of ['identical', 'mismatch', 'AWS failure']) {
  test(`conditional collision: ${condition}`, async () => {
    const io = mock();
    io.put = async () => {
      throw Object.assign(new Error(condition), {
        code: condition === 'AWS failure' ? 'AccessDenied' : 'PreconditionFailed',
      });
    };
    if (condition === 'mismatch') io.get = async () => Buffer.from('changed');
    if (condition === 'identical') await upload(publication, io, new Set());
    else
      await assert.rejects(
        upload(publication, io, new Set()),
        condition === 'mismatch' ? /collision differs.*Release a new version/ : /AWS failure/,
      );
  });
}

test('loader collisions fail on changed bytes', async () => {
  const io = mock();
  io.put = async () => {
    throw Object.assign(new Error('collision'), { code: 'PreconditionFailed' });
  };
  io.get = async () => Buffer.from('old loader');
  await assert.rejects(
    upload({ ...publication, prefix: 'js-sdk-loader-scripts/3.4.1/' }, io, new Set()),
    /Release a new version/,
  );
});

for (const condition of ['mismatch', 'missing', 'extra', 'HTTP 404', 'redirect', 'network error']) {
  test(`post-deploy verification fails on ${condition}`, async () => {
    const io = mock(
      condition === 'missing'
        ? ['core.js']
        : condition === 'extra'
          ? [...Object.keys(bodies), 'extra.js']
          : undefined,
    );
    if (condition === 'mismatch') io.http = async () => ({ status: 200, body: Buffer.from('bad') });
    if (condition === 'HTTP 404' || condition === 'redirect')
      io.http = async () => ({
        status: condition === 'redirect' ? 302 : 404,
        body: Buffer.alloc(0),
      });
    if (condition === 'network error')
      io.http = async () => {
        throw new Error('timeout');
      };
    await assert.rejects(verify(publication, io), /Release a new version/);
    if (condition === 'missing' || condition === 'extra') assert.equal(io.calls.http.length, 0);
  });
}

test('CDN retries with exponential backoff and succeeds on matching bytes', async () => {
  const io = mock();
  const attempts = {};
  io.http = async key => ({
    status: (attempts[key] = (attempts[key] || 0) + 1) < 3 ? 503 : 200,
    body: bodies[key.slice(6)],
  });
  await verify(publication, io);
  assert.deepEqual(
    io.calls.sleeps.sort((a, b) => a - b),
    [1000, 1000, 2000, 2000],
  );
});

test('CDN verification concurrency never exceeds eight', async () => {
  const manifest = Object.fromEntries(
    Array.from({ length: 30 }, (_, index) => [`${index}.js`, sha384('body')]),
  );
  let active = 0;
  let maximum = 0;
  let completed = 0;
  await verify(
    { ...publication, objects: manifest },
    {
      list: async () => ({ Contents: Object.keys(manifest).map(key => ({ Key: `3.0.0/${key}` })) }),
      http: async () => {
        active += 1;
        maximum = Math.max(maximum, active);
        await new Promise(resolve => setTimeout(resolve, 2));
        active -= 1;
        completed += 1;
        return { status: 200, body: Buffer.from('body') };
      },
    },
  );
  assert.equal(maximum, 8);
  assert.equal(completed, 30);
});

test('AWS adapter uses conditional puts and explicit content/cache headers; propagates other errors', async () => {
  const calls = [];
  let failure;
  const io = awsInterface(
    { bucket: 'bucket', distribution: 'dist', baseUrl: 'https://cdn.test' },
    async (command, args) => {
      calls.push([command, args]);
      if (failure) throw { stderr: failure };
      return {
        stdout: JSON.stringify(
          args.includes('create-invalidation') ? { Invalidation: { Id: 'id' } } : {},
        ),
      };
    },
  );
  await io.put('3.0.0/core.js', '/body', 'text/javascript');
  assert.deepEqual(calls[0][1], [
    's3api',
    'put-object',
    '--bucket',
    'bucket',
    '--key',
    '3.0.0/core.js',
    '--body',
    '/body',
    '--content-type',
    'text/javascript',
    '--cache-control',
    'max-age=3600',
    '--if-none-match',
    '*',
  ]);
  await io.list('3.0.0/', 'token');
  assert.ok(calls[1][1].includes('--no-paginate'));
  assert.deepEqual(calls[1][1].slice(-2), ['--continuation-token', 'token']);
  await io.invalidate('3.0.0/');
  assert.ok(calls[2][1].includes('/3.0.0/*'));
  assert.ok(calls[3][1].includes('invalidation-completed'));
  failure = 'An error occurred (PreconditionFailed) when calling the PutObject operation';
  await assert.rejects(io.put('key', 'body', 'type'), error => error.code === 'PreconditionFailed');
  failure = 'AccessDenied';
  await assert.rejects(io.put('key', 'body', 'type'), error => error.code === undefined);
  assert.equal(contentType('manifest.json'), 'application/json');
  assert.equal(contentType('core.js.map'), 'application/octet-stream');
  assert.equal(contentType('list.html'), 'text/html');
  assert.equal(contentType('archive.tar.gz'), 'application/x-tar');
});

test('HTTP adapter hashes decoded gzip bodies', async t => {
  const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    response.end(zlib.gzipSync('decoded body'));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const io = awsInterface({ baseUrl: `http://127.0.0.1:${server.address().port}` });
  assert.deepEqual(await io.http('3.0.0/core.js'), {
    status: 200,
    body: Buffer.from('decoded body'),
  });
});

test('listing is deterministic, uses local digests, escapes HTML and excludes itself/archive', async t => {
  const root = await temp(t);
  await fs.mkdir(path.join(root, 'components'));
  await fs.writeFile(path.join(root, 'components/a&b.js'), 'body');
  await fs.writeFile(path.join(root, 'components/all.tar.gz'), 'archive');
  await listing(root, 'components', 'Plugins', 'all.tar.gz', 'https://cdn.test', '3.0.0/');
  const file = path.join(root, 'components/list.html');
  const first = await fs.readFile(file, 'utf8');
  await listing(root, 'components', 'Plugins', 'all.tar.gz', 'https://cdn.test', '3.0.0/');
  assert.equal(await fs.readFile(file, 'utf8'), first);
  assert.ok(first.includes(sha384('body')));
  assert.ok(first.includes('a&amp;b.js'));
  assert.ok(first.includes('a%26b.js'));
  assert.ok(!first.includes('Last Updated'));
  assert.ok(!first.includes('list.html'));
});

test('prepare assembles complete SDK, legacy and loader trees with distinct listing URLs', async t => {
  const repo = await temp(t);
  const put = async (file, body = 'body') => {
    const destination = path.join(repo, file);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, body);
  };
  for (const [pkg, version] of [
    ['analytics-js', '3.0.0'],
    ['analytics-v1.1', '1.0.0'],
    ['loading-scripts', '3.4.1'],
  ])
    await put(
      `packages/${pkg}/package.json`,
      JSON.stringify({
        name:
          pkg === 'analytics-js'
            ? '@rudderstack/analytics-js'
            : pkg === 'analytics-v1.1'
              ? 'rudder-sdk-js'
              : '@rudderstack/analytics-js-loading-scripts',
        version,
      }),
    );
  await put(
    'packages/analytics-js-legacy-utilities/src/config_to_integration_names.js',
    "const configToIntNames = {\n  GA: 'GA',\n};",
  );
  await put(
    'packages/analytics-js-integrations/src/constants/Destinations.ts',
    "export const GA_DISPLAY_NAME = 'Google Analytics';",
  );
  await put(
    'packages/analytics-js-plugins/rollup.config.mjs',
    "const pluginsMap = {\n  './BeaconQueue': './src/beaconQueue/index.ts',\n};",
  );
  const tree = path.join(repo, 'tree');
  const v3Files = await completeTree(tree, '@rudderstack/analytics-js', repo);
  for (const file of v3Files) {
    const destination = file.includes('/js-integrations/')
      ? `analytics-js-integrations/dist/cdn/${file}`
      : file.includes('/plugins/')
        ? `analytics-js-plugins/dist/cdn/${file}`
        : `analytics-js/dist/cdn/${file.replace('/', '/iife/')}`;
    await put(`packages/${destination}`);
  }
  const legacyFiles = await completeTree(tree, 'rudder-sdk-js', repo);
  for (const file of legacyFiles.filter(file => !file.includes('js-integrations/')))
    await put(
      `packages/analytics-v1.1/dist/cdn/${file.startsWith('modern/') ? file : `legacy/${file}`}`,
    );
  for (const file of ['loader.js', 'loader.min.js', 'loader-gtm.js', 'loader-gtm.min.js'])
    await put(`packages/loading-scripts/dist/${file}`);
  const output = path.join(repo, 'out');
  await prepare(repo, output, 'https://cdn.test');
  for (const [name, prefix, count] of [
    ['sdk', '3.0.0/', 16],
    ['legacy', '1.0.0/', 11],
    ['loader', 'js-sdk-loader-scripts/3.4.1/', 5],
  ]) {
    const loaded = await loadPublication(path.join(output, name), prefix, { repo });
    assert.equal(Object.keys(loaded.objects).length, count);
  }
  const legacyHtml = await fs.readFile(
    path.join(output, 'legacy/js-integrations/list.html'),
    'utf8',
  );
  assert.ok(legacyHtml.includes('https://cdn.test/1.0.0/js-integrations/GA.min.js'));
  const first = await fs.readFile(path.join(output, 'sdk/manifest.json'));
  await prepare(repo, output, 'https://cdn.test');
  assert.deepEqual(await fs.readFile(path.join(output, 'sdk/manifest.json')), first);
});

test('rollback only permits the three moving destinations', () => {
  assertRollbackDestinations(['v3/', 'v1.1/', 'js-sdk-loader-scripts/latest/']);
  for (const destinations of [
    ['3.0.0/', 'v1.1/', 'js-sdk-loader-scripts/latest/'],
    ['v3/', 'v3/', 'v1.1/'],
    ['v3/', 'v1.1/', 'js-sdk-loader-scripts/3.4.1/'],
  ])
    assert.throws(() => assertRollbackDestinations(destinations), /Rollback destinations/);
});

test('archives are byte-identical after mtime changes and exclude generated files', async t => {
  const { execFileSync } = require('node:child_process');
  const tar = gnuTar(t);
  if (!tar) return;
  const repo = await temp(t);
  const directories = [
    'packages/analytics-js-integrations/dist/cdn/legacy/js-integrations',
    'packages/analytics-js-integrations/dist/cdn/modern/js-integrations',
    'packages/analytics-js-plugins/dist/cdn/modern/plugins',
  ];
  for (const directory of directories) {
    await fs.mkdir(path.join(repo, directory), { recursive: true });
    await fs.writeFile(path.join(repo, directory, 'z.js'), 'last');
    await fs.writeFile(path.join(repo, directory, 'a.js'), 'first');
    await fs.writeFile(path.join(repo, directory, 'list.html'), 'timestamp from prior deploy');
  }
  await archives(repo, tar);
  const filename = path.join(repo, directories[0], 'all_integration_sdks.tar.gz');
  const first = await fs.readFile(filename);
  for (const directory of directories) {
    await fs.utimes(path.join(repo, directory, 'a.js'), 1000, 1000);
    await fs.writeFile(path.join(repo, directory, 'list.html'), 'changed listing');
  }
  await archives(repo, tar);
  assert.deepEqual(await fs.readFile(filename), first);
  const contents = execFileSync(tar, ['-tvzf', filename], { encoding: 'utf8' });
  assert.ok(contents.includes('0/0'));
  assert.ok(contents.includes('1970-01-01'));
  assert.ok(!contents.includes('list.html'));
  assert.ok(!contents.includes('all_integration_sdks.tar.gz'));
  assert.ok(contents.indexOf('a.js') < contents.indexOf('z.js'));
});

test('all prefixes are preflighted before uploads; each prefix waits for invalidation before CDN checks', async () => {
  const { publishAll } = require('./publication');
  const events = [];
  const publications = ['3.0.0/', '1.0.0/', 'js-sdk-loader-scripts/3.4.1/'].map(prefix => ({
    ...publication,
    prefix,
    objects: { 'core.js': sha384('core') },
  }));
  const uploaded = new Set();
  await publishAll(publications, {
    list: async prefix => {
      events.push(`list ${prefix}`);
      return { Contents: uploaded.has(prefix) ? [{ Key: `${prefix}core.js` }] : [] };
    },
    put: async key => {
      events.push(`put ${key}`);
      uploaded.add(key.slice(0, -7));
    },
    invalidate: async prefix => {
      events.push(`wait ${prefix}`);
    },
    http: async key => {
      events.push(`http ${key}`);
      return { status: 200, body: Buffer.from('core') };
    },
  });
  assert.deepEqual(
    events.slice(0, 3),
    publications.map(({ prefix }) => `list ${prefix}`),
  );
  for (const { prefix } of publications)
    assert.deepEqual(
      events.slice(
        events.indexOf(`put ${prefix}core.js`),
        events.indexOf(`http ${prefix}core.js`) + 1,
      ),
      [`put ${prefix}core.js`, `wait ${prefix}`, `list ${prefix}`, `http ${prefix}core.js`],
    );
  let puts = 0;
  await assert.rejects(
    publishAll(publications, {
      list: async prefix => ({ Contents: prefix === '1.0.0/' ? [{ Key: '1.0.0/extra.js' }] : [] }),
      put: async () => {
        puts += 1;
      },
    }),
    /Unexpected existing key/,
  );
  assert.equal(puts, 0);
});

test('moving destination validator accepts only allowed SDK and legacy prefixes', () => {
  for (const base of [
    '',
    'staging/latest/',
    'dev/latest/',
    'beta/PR-123/abcdef0/',
    `beta/PR-42/${'a'.repeat(40)}/`,
  ]) {
    assertMovingDestinations([`${base}v3`, `${base}v1.1`]);
  }
  for (const invalid of [
    '',
    '3.128.0',
    '3.128.0-hotfix',
    'v3/',
    '/v3',
    'v3\n',
    'v3 ',
    'staging/latest/3.128.0/v3',
    'dev/latest/1.2.3-hotfix/v3',
    'beta/PR-123/3.128.0abc/v3',
    'staging/latest/v3/../../3.128.0',
    'staging/latest//v3',
    'staging/latest/%76%33',
    's3://bucket/v3',
    'staging/other/v3',
    'sanity-suite/v3',
    'beta/PR-0/abcdef0/v3',
    'beta/PR-123/not-a-sha/v3',
    'beta/PR-123/abcdef/v3',
    `beta/PR-123/${'a'.repeat(41)}/v3`,
    'beta/pr-123/abcdef0/v3',
  ]) {
    assert.throws(() => assertMovingDestinations([invalid, 'v1.1']), /Unsafe moving destination/);
    assert.throws(
      () => assertMovingDestinations(['v3', invalid.replace(/v3$/, 'v1.1')]),
      /Unsafe moving destination/,
    );
  }
  assert.throws(() => assertMovingDestinations(['v1.1', 'v3']), /Unsafe moving destination/);
  assert.throws(() => assertMovingDestinations(['v3']), /Both moving destination inputs/);
});

test('archive SHA-384 is independent of source file and directory modes', async t => {
  const { execFileSync } = require('node:child_process');
  const tar = gnuTar(t);
  if (!tar) return;
  const repo = await temp(t);
  const directories = [
    [
      'packages/analytics-js-integrations/dist/cdn/legacy/js-integrations',
      'all_integration_sdks.tar.gz',
    ],
    [
      'packages/analytics-js-integrations/dist/cdn/modern/js-integrations',
      'all_integration_sdks.tar.gz',
    ],
    ['packages/analytics-js-plugins/dist/cdn/modern/plugins', 'all_plugins.tar.gz'],
  ];
  for (const [directory] of directories) {
    const root = path.join(repo, directory);
    await fs.mkdir(path.join(root, 'nested'), { recursive: true });
    await fs.writeFile(path.join(root, 'script.js'), 'script');
    await fs.writeFile(path.join(root, 'nested/chunk.js'), 'chunk');
    await fs.chmod(root, 0o700);
    await fs.chmod(path.join(root, 'nested'), 0o700);
    await fs.chmod(path.join(root, 'script.js'), 0o600);
    await fs.chmod(path.join(root, 'nested/chunk.js'), 0o644);
  }
  await archives(repo, tar);
  const hashes = [];
  for (const [directory, filename] of directories)
    hashes.push(sha384(await fs.readFile(path.join(repo, directory, filename))));
  for (const [directory] of directories) {
    const root = path.join(repo, directory);
    await fs.chmod(root, 0o3777);
    await fs.chmod(path.join(root, 'nested'), 0o2755);
    await fs.chmod(path.join(root, 'script.js'), 0o7777);
    await fs.chmod(path.join(root, 'nested/chunk.js'), 0o755);
  }
  const sourceModes = await Promise.all(
    directories.map(
      async ([directory]) => (await fs.stat(path.join(repo, directory, 'script.js'))).mode & 0o7777,
    ),
  );
  await archives(repo, tar);
  for (const [index, [directory, filename]] of directories.entries()) {
    const archive = path.join(repo, directory, filename);
    assert.equal(sha384(await fs.readFile(archive)), hashes[index]);
    for (const line of execFileSync(tar, ['-tvzf', archive], { encoding: 'utf8' })
      .trim()
      .split('\n')) {
      assert.equal(line.slice(0, 10), line.startsWith('d') ? 'drwxr-xr-x' : '-rw-r--r--');
    }
    // The normalization applies to archive headers, without modifying build outputs.
    assert.equal(
      (await fs.stat(path.join(repo, directory, 'script.js'))).mode & 0o7777,
      sourceModes[index],
    );
  }
});

test('catalog gives every integration its SDK name and display name; classifies all resource types', async t => {
  const { resourceCatalog } = require('./publication');
  const catalog = await resourceCatalog();
  const root = await temp(t);
  const files = [
    ...[...catalog.integrations.keys()].flatMap(name => [
      `legacy/js-integrations/${name}.min.js`,
      `modern/js-integrations/${name}-map.min.js`,
    ]),
    ...catalog.plugins.map(name => `modern/plugins/rsa-plugins-remote-${name}.min.js`),
    'modern/rsa.min.js',
    'legacy/rsa.min.js.map',
    'loader.js',
    'modern/plugins/list.html',
    'modern/plugins/all_plugins.tar.gz',
    'modern/plugins/rsa-plugins-common.min.js',
    'modern/unknown.txt',
  ];
  for (const file of files) {
    await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await fs.writeFile(path.join(root, file), 'body');
  }
  const manifest = await generateManifest(root);
  const byPath = new Map(manifest.resources.map(resource => [resource.path, resource]));
  const integrations = manifest.resources.filter(resource => resource.type === 'integration');
  assert.equal(integrations.length, catalog.integrations.size * 2);
  for (const entry of integrations) {
    assert.equal(entry.displayName, catalog.integrations.get(entry.name).displayName);
    assert.ok(['legacy', 'modern'].includes(entry.variant));
  }
  for (const name of catalog.plugins)
    assert.equal(byPath.get(`modern/plugins/rsa-plugins-remote-${name}.min.js`).name, name);
  for (const [file, type] of [
    ['modern/rsa.min.js', 'core'],
    ['legacy/rsa.min.js.map', 'sourcemap'],
    ['loader.js', 'loader'],
    ['modern/plugins/list.html', 'listing'],
    ['modern/plugins/all_plugins.tar.gz', 'archive'],
    ['modern/plugins/rsa-plugins-common.min.js', 'plugin'],
    ['modern/unknown.txt', 'other'],
  ])
    assert.equal(byPath.get(file).type, type);
  await fs.writeFile(path.join(root, 'modern/js-integrations/Unknown.min.js'), 'body');
  await assert.rejects(generateManifest(root), /Unknown integration file/);
  await fs.rm(path.join(root, 'modern/js-integrations/Unknown.min.js'));
  await fs.writeFile(path.join(root, 'modern/js-integrations/Unknown.min.js.map'), 'body');
  await assert.rejects(generateManifest(root), /Unknown integration file/);
});

test('schema readers ignore additive fields and reject breaking schema versions and changed sizes', async t => {
  const root = await temp(t);
  await completeTree(root);
  await fs.writeFile(path.join(root, 'modern/rsa.min.js'), 'core');
  const sdk = { name: '@rudderstack/analytics-js', version: '3.0.0' };
  await writeManifest(root, { sdk });
  const file = path.join(root, 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(file));
  manifest.future = true;
  manifest.sdk.future = 'metadata';
  manifest.resources[0].future = { nested: true };
  await fs.writeFile(file, JSON.stringify(manifest));
  const loaded = await loadPublication(root, '3.0.0/');
  assert.equal(loaded.objects['manifest.json'], sha384(await fs.readFile(file)));
  manifest.resources[0].size += 1;
  await fs.writeFile(file, JSON.stringify(manifest));
  await assert.rejects(loadPublication(root, '3.0.0/'), /changed after manifest/);
  manifest.schemaVersion = 2;
  await fs.writeFile(file, JSON.stringify(manifest));
  await assert.rejects(loadPublication(root, '3.0.0/'), /Unsupported manifest schema/);
});

test('manifest is uploaded only after every resource verifies, then verified through CDN; reruns preflight it', async t => {
  const { publishAll } = require('./publication');
  const root = await temp(t);
  await completeTree(root);
  await fs.writeFile(path.join(root, 'modern/rsa.min.js'), 'core');
  await writeManifest(root, { sdk: { name: '@rudderstack/analytics-js', version: '3.0.0' } });
  const loaded = await loadPublication(root, '3.0.0/');
  const stored = new Map();
  const events = [];
  let failResource = true;
  const io = {
    list: async () => ({ Contents: [...stored.keys()].map(Key => ({ Key })) }),
    get: async key => stored.get(key),
    put: async (key, file) => {
      events.push(`put ${key}`);
      stored.set(key, await fs.readFile(file));
    },
    invalidate: async () => {
      events.push('invalidate');
    },
    http: async key => {
      events.push(`http ${key}`);
      return { status: 200, body: failResource ? Buffer.from('bad') : stored.get(key) };
    },
    sleep: async () => {},
  };
  await assert.rejects(publishAll([loaded], io), /CDN verification failed/);
  assert.ok(!stored.has('3.0.0/manifest.json'));
  failResource = false;
  events.length = 0;
  await publishAll([loaded], io);
  assert.ok(
    events.indexOf('http 3.0.0/modern/rsa.min.js') < events.indexOf('put 3.0.0/manifest.json'),
  );
  assert.ok(events.indexOf('put 3.0.0/manifest.json') < events.indexOf('http 3.0.0/manifest.json'));
  events.length = 0;
  await publishAll([loaded], io);
  assert.ok(!events.some(event => event.startsWith('put ')));
  stored.set('3.0.0/manifest.json', Buffer.from('changed'));
  await assert.rejects(preflight(loaded, io), /Existing object differs/);
});

for (const file of [
  'legacy/js-integrations/Comscore.min.js',
  'modern/js-integrations/Comscore.min.js',
  'legacy/js-integrations/Comscore.min.js.map',
  'modern/js-integrations/Comscore.min.js.map',
  'legacy/rsa.min.js',
  'modern/rsa.min.js',
  'legacy/rsa.min.js.map',
  'modern/rsa.min.js.map',
  'modern/plugins/rsa-plugins.js',
  'modern/plugins/rsa-plugins.js.map',
  'modern/plugins/rsa-plugins-remote-BeaconQueue.min.js',
  'modern/plugins/rsa-plugins-remote-BeaconQueue.min.js.map',
]) {
  test(`publication rejects missing production file: ${file}`, async t => {
    const root = await temp(t);
    await completeTree(root);
    const sdk = { name: '@rudderstack/analytics-js', version: '3.0.0' };
    await writeManifest(root, { sdk });
    await fs.rm(path.join(root, file));
    await assert.rejects(writeManifest(root, { sdk }), error => error.message.includes(file));
    // Rebuilding an inventory and its hashes cannot make an incomplete release valid.
    await fs.writeFile(
      path.join(root, 'manifest.json'),
      JSON.stringify(await generateManifest(root, { sdk })),
    );
    await assert.rejects(loadPublication(root, '3.0.0/'), error => error.message.includes(file));
  });
}

for (const file of [
  'rudder-analytics.min.js',
  'modern/rudder-analytics.min.js',
  'rudder-analytics.min.js.map',
  'modern/rudder-analytics.min.js.map',
  'js-integrations/Comscore.min.js',
  'modern/js-integrations/Comscore.min.js.map',
]) {
  test(`legacy publication rejects missing file: ${file}`, async t => {
    const root = await temp(t);
    await completeTree(root, 'rudder-sdk-js');
    await fs.rm(path.join(root, file));
    await assert.rejects(
      writeManifest(root, { sdk: { name: 'rudder-sdk-js', version: '1.0.0' } }),
      error => error.message.includes(file),
    );
  });
}

for (const [kind, body] of [
  ['static import', 'import { x } from "./chunks/shared.js";'],
  ['dynamic import', 'import("./chunks/shared.js");'],
  ['federation module map', 'const modules = { "./Plugin": () => load("./chunks/shared.js") };'],
  ['transitive import', 'export { x } from "./chunks/shared.js";'],
]) {
  test(`publication rejects missing plugin chunk from ${kind}`, async t => {
    const root = await temp(t);
    await completeTree(root);
    const entry =
      kind === 'transitive import'
        ? 'modern/plugins/rsa-plugins-remote-BeaconQueue.min.js'
        : 'modern/plugins/rsa-plugins.js';
    await put(root, entry, body);
    await assert.rejects(writeManifest(root), error =>
      error.message.includes('modern/plugins/chunks/shared.js'),
    );
    await put(root, 'modern/plugins/chunks/shared.js', 'export const x = 1;');
    await assert.rejects(writeManifest(root), error =>
      error.message.includes('modern/plugins/chunks/shared.js.map'),
    );
    await put(root, 'modern/plugins/chunks/shared.js.map', '{}');
    await writeManifest(root);
    await loadPublication(root, `${require('../../packages/analytics-js/package.json').version}/`);
  });
}

test('completeness reports all missing files together, including an entirely missing variant and maps', async t => {
  const root = await temp(t);
  await completeTree(root);
  await fs.rm(path.join(root, 'modern/js-integrations'), { recursive: true });
  await fs.rm(path.join(root, 'legacy/rsa.min.js'));
  const manifest = await generateManifest(root);
  const catalog = await resourceCatalog();
  await assert.rejects(validateCompleteness(root, manifest), error => {
    for (const name of catalog.integrations.keys()) {
      assert.ok(error.message.includes(`modern/js-integrations/${name}.min.js\n`));
      assert.ok(error.message.includes(`modern/js-integrations/${name}.min.js.map`));
    }
    assert.ok(error.message.includes('legacy/rsa.min.js'));
    return true;
  });
  for (const file of manifest.resources.filter(resource => resource.path.endsWith('.map')))
    await fs.rm(path.join(root, file.path));
  await assert.rejects(writeManifest(root), /legacy\/js-integrations\/Comscore.min.js.map/);
});

test('a build without published maps can explicitly validate scripts only', async t => {
  const root = await temp(t);
  const files = await completeTree(root);
  for (const file of files.filter(file => file.endsWith('.map')))
    await fs.rm(path.join(root, file));
  await validateCompleteness(root, await generateManifest(root), { publishMaps: false });
});
