import assert from 'node:assert/strict';
import http from 'node:http';
import os from 'node:os';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium, firefox, webkit } from 'playwright';

assert.ok(
  ['baseline', 'deadlines', 'paused', 'stress', 'repro'].includes(process.env.MODE || 'baseline'),
  'Unknown MODE',
);
if (process.env.ENGINES) {
  assert.ok(
    process.env.ENGINES.split(',').every(engine =>
      ['chromium', 'firefox', 'webkit'].includes(engine),
    ),
    'Unknown ENGINES value',
  );
}

const source = await readFile(new URL('./lab.js', import.meta.url), 'utf8');
const html =
  '<!doctype html><meta charset="utf-8"><title>SDK-6920 browser lab</title><script src="/lab.js"></script><p>Synthetic coordination fixture</p>';
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', req.url === '/lab.js' ? 'text/javascript' : 'text/html');
  res.end(req.url === '/lab.js' ? source : html);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://localhost:${server.address().port}`;
const output = new URL(
  `./results/${new Date().toISOString().replace(/[:.]/g, '-')}/`,
  import.meta.url,
);
await mkdir(output, { recursive: true });
const report = {
  started: new Date().toISOString(),
  fixtureSha256: createHash('sha256').update(source).digest('hex'),
  runnerSha256: createHash('sha256')
    .update(await readFile(new URL('./run.mjs', import.meta.url)))
    .digest('hex'),
  host: {
    platform: os.platform(),
    arch: os.arch(),
    os: os.release(),
    cpu: os.cpus()[0].model,
    cores: os.cpus().length,
    node: process.version,
  },
  playwright: JSON.parse(
    await readFile(new URL('./node_modules/playwright/package.json', import.meta.url)),
  ).version,
  mode: process.env.MODE || 'baseline',
  tests: [],
  measurements: [],
  engines: {},
};
const save = () => writeFile(new URL('raw.json', output), JSON.stringify(report, null, 2));
const start = (page, kind, patch = {}, config = {}) =>
  page.evaluate(({ kind, patch, config }) => lab.enqueue(kind, patch, config), {
    kind,
    patch,
    config,
  });
const result = (page, op) => page.evaluate(id => lab.result(id), op.id);
const apply = async (page, kind, patch = {}, config = {}) =>
  result(page, await start(page, kind, patch, config));
const properties = page => page.evaluate(() => lab.read().properties);
const flag = (page, name) => page.waitForFunction(name => lab.flags[name], name);
const release = (page, name) => page.evaluate(name => lab.release(name), name);
const hold = async (page, name) => {
  await page.evaluate(name => {
    lab.hold(name);
  }, name);
  await flag(page, name);
};
const applied = value => assert.equal(value.status, 'applied', JSON.stringify(value));

async function fixture(browser, backend, count = 2, throttle = 1) {
  const context = await browser.newContext();
  context.setDefaultTimeout(10000);
  const pages = [];
  for (let i = 0; i < count; i++) {
    const page = await context.newPage();
    await page.goto(url);
    const capability = await page.evaluate(config => boot(config), {
      backend,
      trace: report.mode === 'stress',
    });
    assert.equal(capability.locks, true);
    if (throttle > 1) {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
    }
    pages.push(page);
  }
  await pages[0].evaluate(() => lab.seed());
  return { context, pages };
}

async function test(engine, browser, backend, name, fn, count = 2) {
  const f = await fixture(browser, backend, count);
  const began = performance.now();
  try {
    let deadlineTimer;
    let evidence;
    try {
      evidence = await Promise.race([
        fn(...f.pages),
        new Promise((_, reject) => {
          deadlineTimer = setTimeout(
            () => reject(new Error('Scenario exceeded 30 seconds')),
            30000,
          );
        }),
      ]);
    } finally {
      clearTimeout(deadlineTimer);
    }
    report.tests.push({
      engine,
      backend,
      name,
      outcome: 'pass',
      durationMs: performance.now() - began,
      evidence,
    });
    console.log(`PASS ${engine}/${backend}: ${name}`);
  } catch (error) {
    report.tests.push({ engine, backend, name, outcome: 'fail', error: error.stack });
    console.error(`FAIL ${engine}/${backend}: ${name}: ${error.message}`);
  } finally {
    await f.context.close();
    await save();
  }
}

async function correctness(engine, browser, backend) {
  await test(
    engine,
    browser,
    backend,
    'uncoordinated read-modify-write loses an independent update (control)',
    async (a, b) => {
      const sa = await a.evaluate(() => lab.naiveSnapshot({ a: 1 }));
      const sb = await b.evaluate(() => lab.naiveSnapshot({ b: 2 }));
      await a.evaluate(state => lab.write(state), sa);
      await b.evaluate(state => lab.write(state), sb);
      assert.deepEqual(await properties(a), { b: 2 });
      return { expectedLostKey: 'a' };
    },
  );
  await test(
    engine,
    browser,
    backend,
    'locks preserve independent nested merges, arrays and selected-property replacement',
    async (a, b) => {
      await a.evaluate(() =>
        lab.seed({ account: { plan: 'free', region: 'EU' }, items: ['a', 'b', 'c'], keep: true }),
      );
      const values = await Promise.all([
        apply(a, 'merge', { account: { plan: 'pro' }, items: ['x'] }),
        apply(b, 'merge', { account: { region: 'US' }, other: 1 }),
      ]);
      values.forEach(applied);
      assert.deepEqual(await properties(a), {
        account: { plan: 'pro', region: 'US' },
        items: ['x', 'b', 'c'],
        keep: true,
        other: 1,
      });
      applied(await apply(b, 'replace', { account: { replacement: true } }));
      assert.deepEqual(await properties(a), {
        account: { replacement: true },
        items: ['x', 'b', 'c'],
        keep: true,
        other: 1,
      });
    },
  );
  await test(
    engine,
    browser,
    backend,
    'competing campaigns replace whole campaign and preserve custom values',
    async (a, b) => {
      const first = await Promise.all([
        apply(a, 'campaign', { source: 'google', gclid: 'old' }),
        apply(b, 'merge', { variant: 'B' }),
      ]);
      first.forEach(applied);
      applied(await apply(b, 'campaign', { source: 'email' }));
      assert.deepEqual(await properties(a), { variant: 'B', sessionCampaign: { source: 'email' } });
    },
  );
  await test(
    engine,
    browser,
    backend,
    'deadline aborts queued lock request and prevents late write',
    async (a, b) => {
      await hold(a, 'held');
      const op = await start(b, 'merge', { forbidden: true }, { budgetMs: 50 });
      const done = await result(b, op);
      assert.equal(done.status, 'rejected');
      assert.equal(done.reason, 'timeout');
      await release(a, 'held');
      await b.evaluate(() => navigator.locks.request('sdk6920', () => {}));
      assert.deepEqual(await properties(a), {});
      assert.deepEqual(await b.evaluate(() => lab.callbacks.map(x => x.status)), ['rejected']);
      return done.record;
    },
  );
  await test(
    engine,
    browser,
    backend,
    'deadline includes local queue; failed work does not drop event',
    async a => {
      const first = await start(
        a,
        'merge',
        { forbidden: 1 },
        { budgetMs: 200, beforeLockGate: 'never' },
      );
      const second = await start(a, 'merge', { forbidden: 2 }, { budgetMs: 30 });
      await a.evaluate(() => {
        window.queuedEvent = lab.event().then(value => {
          lab.flags.eventSettled = true;
          return value;
        });
      });
      const done = await result(a, second);
      assert.equal(done.reason, 'timeout');
      assert.equal(
        await a.evaluate(() => !!lab.flags.eventSettled),
        false,
        'an event must still wait for older pending work',
      );
      assert.equal((await result(a, first)).reason, 'timeout');
      assert.deepEqual((await a.evaluate(() => window.queuedEvent)).properties, {});
      await release(a, 'never');
      applied(await apply(a, 'merge', { after: true }));
      assert.deepEqual(await properties(a), { after: true });
    },
  );
  await test(
    engine,
    browser,
    backend,
    'deadline guard works when timer task is delayed',
    async a => {
      const done = await apply(
        a,
        'merge',
        { forbidden: true },
        { budgetMs: 25, blockBeforeCommitMs: 60 },
      );
      assert.equal(done.reason, 'timeout');
      assert.deepEqual(await properties(a), {});
      return done.record;
    },
  );
  await test(
    engine,
    browser,
    backend,
    'committed operation keeps applied result after delayed callback delivery',
    async a => {
      const done = await apply(
        a,
        'merge',
        { committed: true },
        { budgetMs: 100, blockAfterCommitMs: 150 },
      );
      applied(done);
      assert.deepEqual(await properties(a), { committed: true });
      assert.deepEqual(await a.evaluate(() => lab.callbacks.map(x => x.status)), ['applied']);
      return done.record;
    },
  );
  for (const kind of ['clear', 'reset']) {
    await test(
      engine,
      browser,
      backend,
      `${kind} boundary cancels old pending work; new work succeeds`,
      async (a, b) => {
        await a.evaluate(() => lab.seed({ old: true }));
        const op = await start(a, 'merge', { stale: true }, { beforeLockGate: 'pending' });
        await flag(a, `started:${op.id}`);
        applied(await apply(b, kind));
        await release(a, 'pending');
        const done = await result(a, op);
        assert.equal(done.reason, 'cancelled');
        assert.deepEqual(await properties(a), {});
        applied(await apply(a, 'merge', { fresh: true }));
        assert.deepEqual(await properties(b), { fresh: true });
        assert.equal((await a.evaluate(() => lab.read())).session, kind === 'reset' ? 's2' : 's1');
      },
    );
  }
  await test(
    engine,
    browser,
    backend,
    'same-tab setter-clear and clear-setter ordering',
    async a => {
      const first = await a.evaluate(() => {
        const x = lab.enqueue('merge', { before: true });
        const y = lab.enqueue('clear');
        return Promise.all([lab.result(x.id), lab.result(y.id)]);
      });
      first.forEach(applied);
      assert.deepEqual(await properties(a), {});
      const second = await a.evaluate(() => {
        const x = lab.enqueue('clear');
        const y = lab.enqueue('merge', { after: true });
        return Promise.all([lab.result(x.id), lab.result(y.id)]);
      });
      second.forEach(applied);
      assert.deepEqual(await properties(a), { after: true });
    },
  );
  await test(
    engine,
    browser,
    backend,
    'pending reads, ordered event snapshot and isolated callback error',
    async a => {
      await a.evaluate(() => lab.seed({ value: 'old' }));
      const op = await start(
        a,
        'replace',
        { value: 'new' },
        { beforeLockGate: 'pending', throwCallback: true },
      );
      assert.deepEqual(await properties(a), { value: 'old' });
      await a.evaluate(() => {
        window.firstEvent = lab.event();
        lab.enqueue('replace', { value: 'later' });
      });
      await release(a, 'pending');
      applied(await result(a, op));
      const event = await a.evaluate(() => window.firstEvent);
      assert.deepEqual(event.properties, { value: 'new' });
      const lastEvent = await a.evaluate(() => lab.event());
      assert.deepEqual(lastEvent.properties, { value: 'later' });
      assert.equal(await a.evaluate(() => lab.flags.callbackErrors), 1);
      return { eventDelayMs: event.eventDelayMs };
    },
  );
  await test(engine, browser, backend, 'closing lock holder releases waiting tab', async (a, b) => {
    await hold(a, 'close');
    const op = await start(b, 'merge', { survived: true });
    await a.close();
    applied(await result(b, op));
    assert.deepEqual(await properties(b), { survived: true });
  });
}

async function subdomainControl(engine, browser) {
  const context = await browser.newContext();
  context.setDefaultTimeout(10000);
  await context.route('https://*.sdk6920.test/**', route =>
    route.fulfill({
      status: 200,
      contentType: route.request().url().endsWith('/lab.js') ? 'text/javascript' : 'text/html',
      body: route.request().url().endsWith('/lab.js') ? source : html,
    }),
  );
  try {
    const a = await context.newPage(),
      b = await context.newPage();
    for (const [page, host] of [
      [a, 'a'],
      [b, 'b'],
    ]) {
      await page.goto(`https://${host}.sdk6920.test/`);
      const cap = await page.evaluate(() => boot({ backend: 'cookie', domain: 'sdk6920.test' }));
      assert.equal(cap.locks, true);
      assert.equal(cap.secure, true);
    }
    await a.evaluate(() => lab.seed({ shared: true }));
    assert.deepEqual(await properties(b), { shared: true });
    await a.evaluate(() => {
      window.job = lab.unsafeLocked({ a: 1 }, 'a');
    });
    await b.evaluate(() => {
      window.job = lab.unsafeLocked({ b: 2 }, 'b');
    });
    await Promise.all([flag(a, 'a'), flag(b, 'b')]);
    await release(a, 'a');
    await a.evaluate(() => window.job);
    await release(b, 'b');
    await b.evaluate(() => window.job);
    assert.deepEqual(await properties(a), { shared: true, b: 2 });
    report.tests.push({
      engine,
      backend: 'domain-cookie',
      name: 'independent origin locks lose shared-domain-cookie write (control)',
      outcome: 'pass',
      evidence: { expectedLostKey: 'a', bothLocksHeld: true },
    });
    console.log(`PASS ${engine}/domain-cookie: origin-lock counterexample reproduced`);
  } catch (error) {
    report.tests.push({
      engine,
      backend: 'domain-cookie',
      name: 'origin-lock counterexample',
      outcome: 'fail',
      error: error.stack,
    });
    console.error(`FAIL ${engine}/domain-cookie: ${error.message}`);
  } finally {
    await context.close();
    await save();
  }
}

async function pausedDeadline(browser, backend) {
  await test(
    'chromium',
    browser,
    backend,
    'debugger-paused tab rechecks deadline before a late lock grant can write',
    async (a, b) => {
      await hold(a, 'frozen-holder');
      const cdp = await b.context().newCDPSession(b);
      await cdp.send('Debugger.enable');
      const op = await start(b, 'merge', { forbidden: true }, { budgetMs: 300 });
      assert.equal(await b.evaluate(() => lab.callbacks.length), 0);
      const paused = new Promise(resolve => cdp.once('Debugger.paused', resolve));
      await cdp.send('Debugger.pause');
      await paused;
      await delay(600); // Scheduling probe, not a claim about OS sleep or BFCache.
      await cdp.send('Debugger.resume');
      await release(a, 'frozen-holder');
      const done = await result(b, op);
      assert.equal(done.status, 'rejected');
      assert.equal(done.reason, 'timeout');
      assert.ok(done.record.totalMs >= 600);
      await b.evaluate(() => navigator.locks.request('sdk6920', () => {}));
      assert.deepEqual(await properties(a), {});
      assert.equal(await b.evaluate(() => lab.callbacks.length), 1);
      return done.record;
    },
  );
}

function stats(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  const percentile = p => sorted[Math.max(0, Math.ceil(sorted.length * p) - 1)] ?? null;
  return {
    n: sorted.length,
    p50: percentile(0.5),
    p95: percentile(0.95),
    p99: percentile(0.99),
    max: sorted.at(-1) ?? null,
  };
}
async function measure(
  engine,
  browser,
  backend,
  { tabs, iterations, burst = false, throttle = 1, large = false, budgetMs = 60000 },
) {
  const { context, pages } = await fixture(browser, backend, tabs, throttle);
  try {
    const padding = large ? 'x'.repeat(1800) : 'x';
    await pages[0].evaluate(padding => lab.seed({ padding }), padding);
    await Promise.all(
      pages.map(page =>
        page.evaluate(async () => {
          for (let i = 0; i < 5; i++) {
            const op = lab.enqueue('merge', { warm: i });
            await lab.result(op.id);
          }
          lab.clearMetrics();
          lab.trace.length = 0;
        }),
      ),
    );
    const raw = await Promise.all(
      pages.map((page, tab) =>
        page.evaluate(
          async ({ tab, iterations, burst, budgetMs }) => {
            const jobs = [],
              events = [];
            for (let i = 0; i < iterations; i++) {
              const op = lab.enqueue('merge', { [`tab${tab}`]: i }, { budgetMs });
              const completion = lab.result(op.id);
              jobs.push(completion);
              if (!burst) await completion;
            }
            events.push(await lab.event());
            await Promise.all(jobs);
            return { records: lab.records, events, trace: lab.trace };
          },
          { tab, iterations, burst, budgetMs },
        ),
      ),
    );
    const records = raw.flatMap(x => x.records);
    const state = await properties(pages[0]);
    const pageStates = await Promise.all(pages.map(properties));
    const authoritativeCookie =
      backend === 'cookie' ? (await context.cookies()).find(c => c.name === 'sdk6920') : null;
    const authoritativeState = authoritativeCookie
      ? JSON.parse(decodeURIComponent(authoritativeCookie.value)).properties
      : state;
    let validationError;
    try {
      if (budgetMs === 60000) {
        assert.equal(records.length, tabs * iterations);
        assert.equal(records.filter(x => !['applied', 'unchanged'].includes(x.status)).length, 0);
        for (let tab = 0; tab < tabs; tab++) {
          assert.equal(
            authoritativeState[`tab${tab}`],
            iterations - 1,
            `authoritative store lost tab${tab} update`,
          );
          for (const pageState of pageStates)
            assert.equal(pageState[`tab${tab}`], iterations - 1, `tab read is stale for tab${tab}`);
        }
      }
    } catch (error) {
      validationError = error.message;
    }
    const sample = {
      engine,
      backend,
      tabs,
      iterations,
      burst,
      throttle,
      large,
      budgetMs,
      finalPropertiesBytes: Buffer.byteLength(JSON.stringify(state)),
      stats: Object.fromEntries(
        ['queueMs', 'lockMs', 'commitMs', 'totalMs'].map(key => [
          key,
          stats(records.map(x => x[key])),
        ]),
      ),
      eventWait: stats(raw.flatMap(x => x.events.map(e => e.eventDelayMs))),
      outcomes: records.reduce((out, r) => {
        const key = r.reason || r.status;
        out[key] = (out[key] || 0) + 1;
        return out;
      }, {}),
      candidateExceedances: Object.fromEntries(
        [25, 50, 100, 250, 500].map(ms => [ms, records.filter(x => x.totalMs >= ms).length]),
      ),
      validationError,
      pageStates,
      authoritativeState,
      raw,
    };
    report.measurements.push(sample);
    console.log(
      `MEASURE ${engine}/${backend}: tabs=${tabs} burst=${burst} cpu=${throttle} large=${large} budget=${budgetMs} n=${records.length} p99=${sample.stats.totalMs.p99.toFixed(2)}ms max=${sample.stats.totalMs.max.toFixed(2)}ms`,
    );
    if (validationError)
      console.error(`VALIDATION FAILURE ${engine}/${backend}: ${validationError}`);
  } finally {
    await context.close();
    await save();
  }
}

try {
  for (const [engine, launcher] of Object.entries({ chromium, firefox, webkit })) {
    if (process.env.ENGINES && !process.env.ENGINES.split(',').includes(engine)) continue;
    let browser;
    try {
      browser = await launcher.launch({ headless: true });
    } catch (error) {
      report.tests.push({ engine, name: 'browser launch', outcome: 'fail', error: error.message });
      console.error(`FAIL ${engine} launch: ${error.message}`);
      continue;
    }
    report.engines[engine] = browser.version();
    console.log(`ENGINE ${engine} ${browser.version()}`);
    try {
      if (report.mode === 'paused') {
        assert.equal(engine, 'chromium', 'Use ENGINES=chromium for debugger-pause probes');
        for (const backend of ['localStorage', 'cookie']) await pausedDeadline(browser, backend);
        continue;
      }
      if (report.mode === 'deadlines') {
        assert.equal(engine, 'chromium', 'Use ENGINES=chromium for deadline sweeps');
        for (const backend of ['localStorage', 'cookie']) {
          await pausedDeadline(browser, backend);
          for (const budgetMs of [100, 250, 500, 1000])
            await measure(engine, browser, backend, {
              tabs: 8,
              iterations: 32,
              burst: true,
              throttle: 6,
              large: true,
              budgetMs,
            });
        }
        continue;
      }
      if (report.mode === 'repro') {
        for (let repetition = 0; repetition < 5; repetition++)
          await measure(engine, browser, 'cookie', { tabs: 2, iterations: 500, large: true });
        continue;
      }
      if (report.mode === 'stress') {
        for (let repetition = 0; repetition < 5; repetition++) {
          await measure(engine, browser, 'cookie', { tabs: 2, iterations: 100, large: true });
          await measure(engine, browser, 'cookie', {
            tabs: 8,
            iterations: 32,
            burst: true,
            large: true,
          });
        }
        continue;
      }
      for (const backend of ['localStorage', 'cookie']) {
        await correctness(engine, browser, backend);
        for (const config of [
          { tabs: 1, iterations: 100 },
          { tabs: 2, iterations: 100, large: true },
          { tabs: 8, iterations: 50, large: true },
          { tabs: 8, iterations: 32, burst: true, large: true },
        ])
          await measure(engine, browser, backend, config);
        if (engine === 'chromium')
          await measure(engine, browser, backend, {
            tabs: 8,
            iterations: 32,
            burst: true,
            throttle: 6,
            large: true,
          });
      }
      await subdomainControl(engine, browser);
    } finally {
      await browser.close();
    }
  }
} finally {
  report.finished = new Date().toISOString();
  await save();
  server.close();
  console.log(`RESULTS ${output.pathname}`);
}
if (
  report.tests.some(x => x.outcome !== 'pass') ||
  report.measurements.some(x => x.validationError)
)
  process.exitCode = 1;
