const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const zlib = require('node:zlib');
const {
  readVendorPins,
  sha384Integrity,
  downloadVendorScript,
  verifyVendorPin,
  runCli,
} = require('./vendor-sdk-hash');

const integrity = 'sha384-9jvBJyxD6FpmadrAs2JsnqN3fLpTLrfdqY89j3Df12c4U1hb1wHxWIdxpHxWt8TW';
const staleIntegrity = 'sha384-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
const fixturePin = {
  integration: 'Fixture',
  pinnedUrl: 'https://vendor.test/pin.js',
  integrity,
  floatingUrl: 'https://vendor.test/floating.js',
};

function fixture(
  t,
  fields = fixturePin,
  exported = Object.keys(fields).filter(key => key !== 'integration'),
) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vendor-pin-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const constantsDir = path.join(dir, 'Fixture');
  fs.mkdirSync(constantsDir);
  const names = {
    pinnedUrl: 'VENDOR_SDK_PINNED_URL',
    integrity: 'VENDOR_SDK_INTEGRITY',
    floatingUrl: 'VENDOR_SDK_FLOATING_URL',
  };
  fs.writeFileSync(
    path.join(constantsDir, 'constants.js'),
    Object.entries(names)
      .filter(([key]) => fields[key] !== undefined)
      .map(([key, name]) => `const ${name} = '${fields[key]}';`)
      .join('\n') + `\nexport { ${exported.map(key => names[key]).join(', ')} };\n`,
  );
  return dir;
}

async function withServer(t, body) {
  const counts = Object.create(null);
  const routes = Object.create(null);
  const server = http.createServer((req, res) => {
    assert.equal(req.headers['accept-encoding'], 'identity');
    assert.equal(req.headers.origin, 'https://www.test-host.com');
    counts[req.url] = (counts[req.url] || 0) + 1;
    const handler = new Map(Object.entries(routes)).get(req.url);
    if (handler) handler(req, res);
    else {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(
    () =>
      new Promise(resolve => {
        server.close(resolve);
        server.closeAllConnections();
      }),
  );
  const request = (url, options, callback) =>
    http.request(
      {
        hostname: '127.0.0.1',
        port: server.address().port,
        path: new URL(url).pathname,
        ...options,
      },
      callback,
    );
  routes['/pin.js'] = (_req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('vendor-test');
  };
  await body({ request, routes, counts });
}

test('discovers all eight artifacts with full instance support', () => {
  assert.deepEqual(
    readVendorPins().map(pin => pin.integration),
    ['Amplitude', 'Amplitude', 'Bugsnag', 'Iterable', 'Keen', 'LaunchDarkly', 'Sentry', 'Sentry'],
  );
  assert.equal(
    readVendorPins().find(pin => pin.integration === 'LaunchDarkly').pinnedUrl,
    'https://unpkg.com/launchdarkly-js-client-sdk@2.24.2/dist/ldclient.min.js',
  );
  assert.equal(sha384Integrity(Buffer.from('vendor-test')), integrity);
});

test('generates and verifies two matching downloads', async t =>
  withServer(t, async ({ request, counts }) => {
    assert.equal(await verifyVendorPin(fixturePin, { request }), integrity);
    assert.equal(counts['/pin.js'], 2);
    const integrationsDir = fixture(t);
    const output = [];
    const options = {
      integrationsDir,
      downloadOptions: { request },
      stdout: line => output.push(line),
    };
    assert.equal(await runCli(['Fixture'], options), 0);
    assert.deepEqual(output, [integrity]);
    output.length = 0;
    assert.equal(await runCli(['--verify'], options), 0);
    assert.deepEqual(output, [
      'Fixture: OK (https://vendor.test/pin.js)',
      'Verified 1 vendor SDK pins.',
    ]);
    assert.equal(counts['/floating.js'], undefined);
  }));

test('rejects unusable or changing vendor artifacts', async t => {
  const cases = [
    [
      'changing downloads',
      async ({ request, routes, counts }) => {
        routes['/changing.js'] = (_req, res) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(counts['/changing.js'] === 1 ? 'first' : 'second');
        };
        await assert.rejects(
          verifyVendorPin(
            { ...fixturePin, pinnedUrl: 'https://vendor.test/changing.js' },
            { request },
          ),
          /pinned downloads differ/,
        );
      },
    ],
    [
      'stored hash mismatch',
      async ({ request }) =>
        assert.rejects(
          verifyVendorPin({ ...fixturePin, integrity: staleIntegrity }, { request }),
          /stored integrity mismatch/,
        ),
    ],
    [
      'missing CORS',
      async ({ request, routes }) => {
        routes['/no-cors.js'] = (_req, res) => res.end('vendor-test');
        await assert.rejects(
          downloadVendorScript('https://vendor.test/no-cors.js', { request }),
          /CORS/,
        );
      },
    ],
    [
      'wrong CORS',
      async ({ request, routes }) => {
        routes['/bad-cors.js'] = (_req, res) => {
          res.setHeader('Access-Control-Allow-Origin', 'https://other.test');
          res.end('vendor-test');
        };
        await assert.rejects(
          downloadVendorScript('https://vendor.test/bad-cors.js', { request }),
          /CORS/,
        );
      },
    ],
    [
      'cross-host redirect',
      async ({ request, routes, counts }) => {
        routes['/cross-host.js'] = (_req, res) => {
          res.writeHead(302, {
            'Access-Control-Allow-Origin': '*',
            Location: 'https://other.test/pin.js',
          });
          res.end();
        };
        await assert.rejects(
          downloadVendorScript('https://vendor.test/cross-host.js', { request }),
          /hostname changed/,
        );
        assert.equal(counts['/pin.js'], undefined);
      },
    ],
    [
      'redirect loop',
      async ({ request, routes, counts }) => {
        routes['/loop.js'] = (_req, res) => {
          res.writeHead(302, { 'Access-Control-Allow-Origin': '*', Location: '/loop.js' });
          res.end();
        };
        await assert.rejects(
          downloadVendorScript('https://vendor.test/loop.js', { request }),
          /redirect limit/,
        );
        assert.equal(counts['/loop.js'], 6);
      },
    ],
    [
      'HTTP status',
      async ({ request }) =>
        assert.rejects(
          downloadVendorScript('https://vendor.test/missing.js', { request }),
          /HTTP 404/,
        ),
    ],
    [
      'body timeout',
      async ({ request, routes }) => {
        routes['/stalled.js'] = (_req, res) => {
          res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
          res.flushHeaders();
        };
        await assert.rejects(
          downloadVendorScript('https://vendor.test/stalled.js', {
            request,
            timeoutMs: 20,
            retryDelaysMs: [1, 3],
          }),
          /timeout/,
        );
      },
    ],
    [
      'byte limit',
      async ({ request }) =>
        assert.rejects(
          downloadVendorScript('https://vendor.test/pin.js', { request, maxBytes: 3 }),
          /byte limit/,
        ),
    ],
    [
      'compressed response',
      async ({ request, routes }) => {
        routes['/encoded.js'] = (_req, res) => {
          res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Encoding': 'compress',
          });
          res.end('compressed');
        };
        await assert.rejects(
          downloadVendorScript('https://vendor.test/encoded.js', { request }),
          /content encoding/,
        );
      },
    ],
    [
      'non-HTTPS URL',
      async ({ request, counts }) => {
        await assert.rejects(
          downloadVendorScript('http://vendor.test/pin.js', { request }),
          /HTTPS/,
        );
        assert.equal(counts['/pin.js'], undefined);
      },
    ],
  ];
  for (const [name, body] of cases) await t.test(name, child => withServer(child, body));
});

test('same-host redirects and origin-specific CORS are usable', async t =>
  withServer(t, async ({ request, routes }) => {
    routes['/redirect.js'] = (_req, res) => {
      res.writeHead(302, { 'Access-Control-Allow-Origin': '*', Location: '/pin.js' });
      res.end();
    };
    for (const origin of ['*', 'https://www.test-host.com']) {
      routes['/pin.js'] = (_req, res) => {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.end('vendor-test');
      };
      const result = await downloadVendorScript('https://vendor.test/redirect.js', { request });
      assert.equal(result.finalUrl, 'https://vendor.test/pin.js');
      assert.equal(result.allowOrigin, origin);
      assert.deepEqual(result.bytes, Buffer.from('vendor-test'));
    }
  }));

test('bad CLI input and malformed exported pins fail', async t => {
  const integrationsDir = fixture(t);
  for (const [args, expected] of [
    [[], /Usage/],
    [['Fixture', 'extra'], /Usage/],
    [['Missing'], /Unknown integration/],
    [['../Bugsnag'], /Unknown integration/],
  ]) {
    const errors = [];
    assert.equal(await runCli(args, { integrationsDir, stderr: line => errors.push(line) }), 1);
    assert.match(errors.join('\n'), expected);
  }
  const malformed = [
    [{ ...fixturePin, integrity: undefined }, undefined, /integrity/i],
    [{ ...fixturePin, integrity: 'sha384-bad' }, undefined, /integrity/i],
    [fixturePin, ['pinnedUrl', 'floatingUrl'], /integrity/i],
    [{ ...fixturePin, floatingUrl: 'https://other.test/sdk.js' }, undefined, /hostname/],
    [{ ...fixturePin, pinnedUrl: 'http://vendor.test/pin.js' }, undefined, /HTTPS/],
  ];
  for (const [fields, exported, expected] of malformed) {
    const errors = [];
    assert.equal(
      await runCli(['--verify'], {
        integrationsDir: fixture(t, fields, exported),
        stderr: line => errors.push(line),
      }),
      1,
    );
    assert.match(errors.join('\n'), expected);
  }
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'vendor-empty-'));
  t.after(() => fs.rmSync(empty, { recursive: true, force: true }));
  const errors = [];
  assert.equal(
    await runCli(['--verify'], { integrationsDir: empty, stderr: line => errors.push(line) }),
    1,
  );
  assert.match(errors.join('\n'), /No vendor SDK pins/);
});

test('generation permits a stale stored hash', async t =>
  withServer(t, async ({ request }) => {
    const integrationsDir = fixture(t, { ...fixturePin, integrity: staleIntegrity });
    const output = [];
    const errors = [];
    const options = {
      integrationsDir,
      downloadOptions: { request },
      stdout: line => output.push(line),
      stderr: line => errors.push(line),
    };
    assert.equal(await runCli(['Fixture'], options), 0);
    assert.deepEqual(output, [integrity]);
    assert.equal(await runCli(['--verify'], options), 1);
    assert.match(errors.join('\n'), /stored integrity mismatch/);
  }));

test('redirect responses must allow anonymous CORS before being followed', async t =>
  withServer(t, async ({ request, routes, counts }) => {
    for (const allowOrigin of [undefined, 'https://other.test']) {
      routes['/redirect-cors.js'] = (_req, res) => {
        if (allowOrigin) res.setHeader('Access-Control-Allow-Origin', allowOrigin);
        res.writeHead(302, { Location: '/pin.js' });
        res.end();
      };
      await assert.rejects(
        downloadVendorScript('https://vendor.test/redirect-cors.js', { request }),
        /CORS/,
      );
      assert.equal(counts['/pin.js'], undefined);
    }
  }));

test('retries transient HTTP failures then succeeds', async t =>
  withServer(t, async ({ request, routes, counts }) => {
    for (const status of [503, 429]) {
      counts['/pin.js'] = 0;
      routes['/pin.js'] = (_req, res) => {
        if (counts['/pin.js'] < 3) {
          res.writeHead(status);
          res.end();
        } else {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end('vendor-test');
        }
      };
      assert.equal(
        await verifyVendorPin(fixturePin, { request, retryDelaysMs: [1, 3] }),
        integrity,
      );
      assert.equal(counts['/pin.js'], 4); // Three attempts, then the second matching download.
    }
  }));

test('gives up after three transient failures', async t =>
  withServer(t, async ({ request, routes, counts }) => {
    routes['/pin.js'] = (_req, res) => {
      res.writeHead(503);
      res.end();
    };
    await assert.rejects(
      verifyVendorPin(fixturePin, { request, retryDelaysMs: [1, 3] }),
      /HTTP 503/,
    );
    assert.equal(counts['/pin.js'], 3);
  }));

test('does not retry hash mismatch or 404', async t =>
  withServer(t, async ({ request, counts }) => {
    await assert.rejects(
      verifyVendorPin({ ...fixturePin, integrity: staleIntegrity }, { request }),
      /stored integrity mismatch/,
    );
    assert.equal(counts['/pin.js'], 2); // Exactly the required pair, with no retry.
    await assert.rejects(
      downloadVendorScript('https://vendor.test/missing.js', { request }),
      /HTTP 404/,
    );
    assert.equal(counts['/missing.js'], 1);
  }));

test('retries network errors and timeouts at most three times', async t =>
  withServer(t, async ({ request, routes, counts }) => {
    routes['/reset.js'] = (req, _res) => req.socket.destroy();
    routes['/timeout.js'] = (_req, _res) => {};
    for (const route of ['/reset.js', '/timeout.js']) {
      await assert.rejects(
        downloadVendorScript(`https://vendor.test${route}`, {
          request,
          timeoutMs: 20,
          retryDelaysMs: [1, 3],
        }),
        /socket hang up|timeout/,
      );
      assert.equal(counts[route], 3);
    }
  }));

test('verify fails when a full declaration has no registered artifact', async t => {
  const integrationsDir = fixture(t);
  const dir = path.join(integrationsDir, 'Future');
  fs.mkdirSync(dir);
  fs.writeFileSync(
    path.join(dir, 'browser.js'),
    "export default class Future { getVendorSdkPinSupport() { return 'full'; } }\n",
  );
  const errors = [];
  assert.equal(
    await runCli(['--verify'], { integrationsDir, stderr: line => errors.push(line) }),
    1,
  );
  assert.match(errors.join('\n'), /Future: full pin support has no registered artifact/);
});

test('verifies decoded gzip bytes as browsers do for existing Amplitude pins', async t =>
  withServer(t, async ({ request, routes }) => {
    routes['/pin.js'] = (_req, res) => {
      res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Content-Encoding': 'gzip' });
      res.end(zlib.gzipSync('vendor-test'));
    };
    assert.equal(await verifyVendorPin(fixturePin, { request }), integrity);
    await assert.rejects(
      downloadVendorScript(fixturePin.pinnedUrl, { request, maxBytes: 3 }),
      /byte limit/,
    );
  }));
