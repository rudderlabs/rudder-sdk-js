import http from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import config from './config.js';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Serves the test page and proxies the cookie endpoint so that the page and the data
 * service share an origin, which is what the SDK's own domain resolution expects.
 *
 * Multiple Set-Cookie headers are copied through verbatim. Collapsing them here would
 * hide the very failure this suite exists to catch.
 */
const proxyCookieRequest = (req, res) => {
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    const target = new URL(`/${config.dataServicePath}`, config.dataServiceOrigin);
    const upstream = http.request(
      {
        hostname: target.hostname,
        port: target.port || 80,
        path: target.pathname,
        method: 'POST',
        headers: {
          'content-type': req.headers['content-type'] ?? 'application/json',
          'content-length': Buffer.byteLength(body),
        },
      },
      upstreamRes => {
        const setCookie = upstreamRes.headers['set-cookie'];
        const headers = { 'content-type': upstreamRes.headers['content-type'] ?? 'text/plain' };
        // Every Set-Cookie header has to be passed in the writeHead call. Setting them
        // afterwards throws, and collapsing them into one would hide the failure this
        // suite exists to catch.
        if (setCookie) {
          headers['Set-Cookie'] = setCookie;
        }
        res.writeHead(upstreamRes.statusCode ?? 502, headers);
        upstreamRes.pipe(res);
      },
    );
    upstream.on('error', err => {
      res.writeHead(502, { 'content-type': 'text/plain' });
      res.end(`Cookie endpoint unreachable: ${err.message}`);
    });
    upstream.end(body);
  });
};

const serve = () => {
  const page = readFileSync(join(here, 'page.html'), 'utf8')
    .replace('__SDK_URL__', config.sdkUrl)
    .replace('__WRITE_KEY__', config.writeKey)
    .replace('__DATA_PLANE_URL__', config.dataPlaneUrl)
    .replace('__DATA_SERVICE_PATH__', config.dataServicePath)
    .replace('__PLUGINS_URL__', config.pluginsUrl)
    .replace('__SOURCE_CONFIG_URL__', config.stubSourceConfig ? config.pageUrl : '');

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, config.pageUrl);

    if (req.method === 'POST' && url.pathname === `/${config.dataServicePath}`) {
      proxyCookieRequest(req, res);
      return;
    }

    // The SDK appends a trailing slash to configUrl before adding the query string
    if (url.pathname === '/sourceConfig' || url.pathname === '/sourceConfig/') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          source: {
            id: 'e2e-source',
            name: 'e2e-source',
            writeKey: config.writeKey,
            enabled: true,
            workspaceId: 'e2e-workspace',
            config: {
              statsCollection: { errors: { enabled: false }, metrics: { enabled: false } },
            },
            destinations: [],
            countryCode: 'US',
          },
        }),
      );
      return;
    }

    // Swallow event delivery so the suite is about cookies, not event plumbing
    if (url.pathname.startsWith('/v1/')) {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end('{}');
      return;
    }

    if (url.pathname === '/' || url.pathname === '/index.html') {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(page);
      return;
    }

    res.writeHead(404).end();
  });

  return new Promise(resolve => {
    server.listen(config.harnessPort, () => resolve(server));
  });
};

export default serve;
