#!/usr/bin/env node
/**
 * run-cdp.mjs — load a harness page in headless system Chrome (no Puppeteer) and read its verdict.
 *
 * Drives an already-installed Chrome over the Chrome DevTools Protocol using Node's global
 * WebSocket (Node >= 22). Holds NO destination or SDK knowledge — it only serves the page,
 * navigates to it, and polls window.__E2E_RESULT__ until status === 'done'.
 *
 * Usage:
 *   node run-cdp.mjs --page <harness.html> [--timeout 60000]   # serves the file's dir, then loads it
 *   node run-cdp.mjs --url <http://…>      [--timeout 60000]   # loads an already-served URL
 *
 * Env:
 *   CHROME_PATH   explicit path to a Chrome/Chromium binary
 *
 * Exit codes: 0 = PASS, 1 = FAIL/timeout, 2 = usage error, 3 = environment error (no WS / no Chrome).
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, extname, join, resolve, basename, sep } from 'node:path';

function parseArgs(argv) {
  const out = { timeout: 60000, headless: false, keepOpen: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--page') out.page = argv[++i];
    else if (a === '--url') out.url = argv[++i];
    else if (a === '--timeout') out.timeout = Number(argv[++i]);
    else if (a === '--json') out.json = argv[++i];
    else if (a === '--headless') out.headless = true;
    else if (a === '--headed') out.headless = false;
    else if (a === '--keep-open') out.keepOpen = true;
    else if (a === '--no-autorun') out.noAutorun = true;
    else if (a === '--help' || a === '-h') out.help = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return out;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const candidates =
    process.platform === 'darwin'
      ? [
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
          '/Applications/Chromium.app/Contents/MacOS/Chromium',
          // per-user installs under ~/Applications
          join(homedir(), 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
          join(homedir(), 'Applications/Chromium.app/Contents/MacOS/Chromium'),
        ]
      : process.platform === 'win32'
        ? [
            'C:/Program Files/Google/Chrome/Application/chrome.exe',
            'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
          ]
        : [
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/usr/bin/chromium',
            '/usr/bin/chromium-browser',
          ];
  return candidates.find((p) => existsSync(p)) || null;
}

/** Minimal single-directory static file server on an ephemeral localhost port. */
async function serveDir(dir) {
  const root = resolve(dir);
  const server = createServer(async (req, res) => {
    try {
      const rel = decodeURIComponent((req.url || '/').split('?')[0]);
      const filePath = resolve(join(root, rel));
      // Guard against path traversal — compare against root + separator so /tmp/abc can't match
      // a sibling /tmp/abcd. (Low risk: the server only listens on 127.0.0.1.)
      if (filePath !== root && !filePath.startsWith(root + sep)) {
        res.writeHead(403).end('forbidden');
        return;
      }
      const body = await readFile(filePath);
      res.writeHead(200, {
        'content-type': MIME[extname(filePath)] || 'application/octet-stream',
        'access-control-allow-origin': '*',
      });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  return { server, port, origin: `http://127.0.0.1:${port}` };
}

/** Minimal CDP client over a single flat-session WebSocket. */
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.closed = false;
    ws.addEventListener('message', (ev) => {
      let msg;
      try {
        msg = JSON.parse(ev.data);
      } catch {
        return;
      }
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve: res, reject: rej } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) rej(new Error(msg.error.message || JSON.stringify(msg.error)));
        else res(msg.result);
      }
    });
    // If Chrome crashes or the tab dies mid-run, the socket closes/errors and no reply ever
    // arrives. Reject every waiting call so awaits don't hang past the timeout deadline.
    const failAll = (reason) => {
      this.closed = true;
      for (const { reject: rej } of this.pending.values()) rej(new Error(reason));
      this.pending.clear();
    };
    ws.addEventListener('close', () => failAll('CDP WebSocket closed'));
    ws.addEventListener('error', () => failAll('CDP WebSocket error'));
  }

  send(method, params = {}, sessionId) {
    if (this.closed) return Promise.reject(new Error('CDP connection is closed'));
    const id = (this.id += 1);
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((res, rej) => this.pending.set(id, { resolve: res, reject: rej }));
  }
}

function reportLine(label, value) {
  return `  ${label.padEnd(38)} ${value}`;
}

const MAX_BODY = 4000;

// Pretty-print a captured value (parse JSON strings), truncated so huge payloads stay readable.
function prettyVal(v) {
  let out;
  if (typeof v === 'string') {
    try {
      out = JSON.stringify(JSON.parse(v), null, 2);
    } catch {
      out = v;
    }
  } else {
    try {
      out = JSON.stringify(v, null, 2);
    } catch {
      out = String(v);
    }
  }
  return out.length > MAX_BODY ? `${out.slice(0, MAX_BODY)}… [truncated ${out.length - MAX_BODY} chars]` : out;
}

function indent(text) {
  return text
    .split('\n')
    .map((l) => `      ${l}`)
    .join('\n');
}

function compact(o) {
  try {
    return JSON.stringify(o ?? {});
  } catch {
    return '{}';
  }
}

function describeEvent(e) {
  if (!e || typeof e !== 'object') return String(e);
  if (e.type === 'identify') return `identify ${e.userId || '(anonymous)'}  traits=${compact(e.traits)}`;
  if (e.type === 'track') return `track "${e.event}"  properties=${compact(e.properties)}`;
  if (e.type === 'page') return `page ${e.name || e.category || '(no name)'}  properties=${compact(e.properties)}`;
  if (e.type === 'group') return `group ${e.groupId || ''}  traits=${compact(e.traits)}`;
  if (e.type === 'alias') return `alias ${e.to || ''} <- ${e.from || ''}`;
  return compact(e);
}

function printReport(result) {
  const timedOut = result.status !== 'done';
  // null = the page never computed this check (e.g. the run timed out) — don't print it as FAIL.
  const mark = (b) => (b == null ? 'not evaluated' : b ? 'PASS' : 'FAIL');
  const dataReqs = result.dataRequests || [];
  console.log('');
  console.log(`Device-mode e2e — ${result.integration || '(any)'} — SDK ${result.sdkVersion || ''}`);
  console.log('─'.repeat(60));
  if ((result.testCases || []).length) {
    console.log('Test cases used (input):');
    result.testCases.forEach((e, i) => console.log(`  ${i + 1}. ${describeEvent(e)}`));
    console.log('─'.repeat(60));
  }
  console.log(reportLine('SDK ready() fired', mark(result.ready)));
  console.log(reportLine('sourceConfig fetched (2xx)', mark(result.sourceConfigOk)));
  console.log(reportLine('integration bundle loaded', mark(result.integrationBundleLoaded)));
  if (result.integration) {
    console.log(reportLine('integration name matched bundle', mark(result.integrationMatched)));
  }
  const firedOk = (result.eventsFired || []).filter((e) => e.ok).length;
  console.log(reportLine('events fired ok', `${firedOk}/${(result.eventsFired || []).length}`));
  const afterEvents = (result.dataRequestsAfterEvents || []).length;
  console.log(reportLine('native SDK asset loaded (info)', mark(result.nativeSdkLoaded)));
  console.log(
    reportLine(
      'DATA sent after events (weak signal)',
      `${mark(result.dataSent)} (${afterEvents} after events / ${dataReqs.length} total)`,
    ),
  );
  console.log(reportLine('warnings (non-fatal)', String((result.warnings || []).length)));
  if ((result.expectations || []).length) {
    console.log('');
    console.log('Expectations:');
    for (const e of result.expectations) {
      console.log(`  [${e.pass ? 'PASS' : 'FAIL'}] ${e.description} — ${e.detail}`);
    }
  }
  if (dataReqs.length) {
    console.log('');
    console.log('Outgoing device-mode data requests (what was actually sent):');
    for (const r of dataReqs) {
      console.log(`  ${r.method || 'GET'} ${r.url}  [${r.status == null ? '?' : r.status}]`);
      if (r.query) console.log(indent('query: ' + prettyVal(r.query)));
      if (r.body !== undefined) console.log(indent('body:  ' + prettyVal(r.body)));
    }
  }
  if ((result.warnings || []).length) {
    console.log('');
    console.log('  warnings (non-fatal):');
    for (const w of result.warnings) console.log(`    - ${w}`);
  }
  if ((result.failures || []).length) {
    console.log('');
    console.log('  failures:');
    for (const f of result.failures) console.log(`    - ${f}`);
  }
  console.log('─'.repeat(60));
  if (timedOut) console.log('RESULT: TIMED OUT ⏱  (verdict not reached — checks above are partial)');
  else console.log(result.pass ? 'RESULT: PASS ✅' : 'RESULT: FAIL ❌');
  console.log('');
  console.log('NEXT (manual, per-destination): confirm the events arrived in the destination dashboard.');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || (!args.page && !args.url)) {
    console.log(
      'usage: node run-cdp.mjs (--page <harness.html> | --url <http://…>)\n' +
        '                        [--timeout ms] [--headless] [--keep-open] [--no-autorun] [--json <path>]\n' +
        '  headed by default (a window opens and auto-runs); --headless for CI;\n' +
        '  --no-autorun: interactive — open the page and let the user click ▶ Run (implies keep-open);\n' +
        '  --keep-open leaves the window up after the report; --json dumps the full result.',
    );
    process.exit(args.help ? 0 : 2);
  }

  if (args.page && args.url) {
    console.error('Pass either --page or --url, not both.');
    process.exit(2);
  }

  if (!Number.isFinite(args.timeout) || args.timeout <= 0) {
    console.error('--timeout must be a positive number of milliseconds.');
    process.exit(2);
  }

  if (args.noAutorun && args.headless) {
    console.error(
      '--no-autorun is interactive: it opens a window and waits for you to click ▶ Run, so it cannot\n' +
        'be combined with --headless (there is no visible UI to click — the run would hang forever).',
    );
    process.exit(2);
  }

  if (typeof WebSocket === 'undefined') {
    console.error(
      `This runner needs Node >= 22 (global WebSocket); current is ${process.version}.\n` +
        'Run `nvm use 22` first (your shell may default to an older Node), then re-run — or\n' +
        'invoke this script with an explicit Node >= 22 binary. Alternatively use the zero-dep\n' +
        'fallback: open the harness page in your browser and read the on-page PASS/FAIL table.',
    );
    process.exit(3);
  }

  const chromePath = findChrome();
  if (!chromePath) {
    console.error(
      'No Chrome/Chromium found. Set CHROME_PATH to the binary, e.g. on macOS:\n' +
        '  export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"\n' +
        'then re-run. Or use the zero-dep fallback: open the harness page in your browser and\n' +
        'read the on-page PASS/FAIL table.',
    );
    process.exit(3);
  }

  let fileServer = null;
  let targetUrl = args.url;
  if (args.page) {
    const pagePath = resolve(args.page);
    await stat(pagePath); // throws if missing
    fileServer = await serveDir(dirname(pagePath));
    targetUrl = `${fileServer.origin}/${basename(pagePath)}`;
  }
  // Report mode drives the page without a click: ?autorun=1 calls window.__E2E_RUN__() on load.
  // Interactive mode (--no-autorun) opens the page and lets the user click ▶ Run themselves.
  // Use the URL API so the param lands in the query, not after a #fragment (a --url with a fragment
  // would otherwise get `autorun=1` appended past the `#`, and the page would never auto-run).
  if (!args.noAutorun) {
    try {
      const u = new URL(targetUrl);
      u.searchParams.set('autorun', '1');
      targetUrl = u.href;
    } catch {
      targetUrl += (targetUrl.indexOf('?') === -1 ? '?' : '&') + 'autorun=1';
    }
  }

  const userDataDir = await mkdtemp(join(tmpdir(), 'rs-e2e-'));
  const chrome = spawn(
    chromePath,
    [
      // headed by default so a window opens; --headless for CI / no-display environments
      ...(args.headless ? ['--headless=new', '--disable-gpu'] : []),
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      `--user-data-dir=${userDataDir}`,
      '--remote-debugging-port=0',
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );

  const cleanup = async () => {
    try {
      chrome.kill('SIGKILL');
    } catch {
      /* ignore */
    }
    if (fileServer) fileServer.server.close();
    await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  };

  try {
    const wsUrl = await new Promise((res, rej) => {
      let buf = '';
      const to = setTimeout(() => rej(new Error('timed out waiting for DevTools endpoint')), 15000);
      chrome.stderr.on('data', (d) => {
        buf += d.toString();
        const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
        if (m) {
          clearTimeout(to);
          res(m[1]);
        }
      });
      chrome.on('exit', (code) => rej(new Error(`chrome exited early (code ${code})`)));
    });

    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true });
      ws.addEventListener('error', () => rej(new Error('failed to connect to Chrome')), { once: true });
    });

    const cdp = new CDP(ws);
    const { targetId } = await cdp.send('Target.createTarget', { url: targetUrl });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Runtime.enable', {}, sessionId);

    // Interactive: open the page (headed) and let the user click ▶ Run; the runner doesn't poll.
    if (args.noAutorun) {
      console.log(`\nOpened ${targetUrl}\nClick “▶ Run tests” in the window and read the on-page report.`);
      console.log('Press Ctrl-C here to close the browser and clean up.');
      process.on('SIGINT', async () => {
        await cleanup();
        process.exit(0);
      });
      await new Promise(() => {}); // wait until Ctrl-C
    }

    // Race each poll against a short timeout so a hung/looping page can't block the deadline check
    // (the socket-close handler in CDP already rejects on a dead tab).
    const evalOnce = () =>
      Promise.race([
        cdp.send(
          'Runtime.evaluate',
          { expression: 'JSON.stringify(window.__E2E_RESULT__ || null)', returnByValue: true },
          sessionId,
        ),
        new Promise((_, rej) => setTimeout(() => rej(new Error('evaluate timed out')), 5000)),
      ]);

    const deadline = Date.now() + args.timeout;
    let result = null;
    let browserDied = false;
    while (Date.now() < deadline) {
      let evalRes;
      try {
        evalRes = await evalOnce();
      } catch {
        // A closed CDP connection means Chrome/the tab died — stop now instead of spinning until
        // the full --timeout. A transient hung eval just retries.
        if (cdp.closed) {
          browserDied = true;
          break;
        }
        await sleep(500);
        continue;
      }
      const value = evalRes && evalRes.result && evalRes.result.value;
      if (value) {
        result = JSON.parse(value);
        if (result && result.status === 'done') break;
      }
      await sleep(500);
    }

    try {
      ws.close();
    } catch {
      /* ignore */
    }

    if (!result) {
      console.error(
        browserDied
          ? 'Chrome/the tab closed before a verdict was produced.'
          : 'Timed out with no verdict — window.__E2E_RESULT__ never appeared.',
      );
      await cleanup();
      process.exit(1);
    }
    printReport(result);
    if (args.json) {
      await writeFile(resolve(args.json), JSON.stringify(result, null, 2));
      console.log(`\n(full result JSON written to ${resolve(args.json)})`);
    }
    if (args.keepOpen && !args.headless) {
      console.log('\n--keep-open: leaving the browser window open. Press Ctrl-C to close and clean up.');
      process.on('SIGINT', async () => {
        await cleanup();
        process.exit(result.pass ? 0 : 1);
      });
      await new Promise(() => {}); // wait until Ctrl-C
    }
    await cleanup();
    process.exit(result.pass ? 0 : 1);
  } catch (err) {
    console.error(`[run-cdp] ${err.message}`);
    await cleanup();
    process.exit(1);
  }
}

main();
