# Server-side cookies end-to-end suite

Real-browser checks for the `useServerSideCookies` flow. Unit tests can prove the SDK
_sends_ the right request; only a browser can prove the cookies actually land, with the
right attributes, and that nothing between the SDK and the data service dropped them.

The same suite is meant to run unchanged against a local build, staging and production —
every environment-specific value comes from the environment.

## Install

```bash
cd e2e/server-side-cookies
npm install
npx playwright install chromium
```

## Run

Against a local build:

```bash
# from the repo root, build the bundle you want to exercise
npm run build:browser:dev --workspace=@rudderstack/analytics-js

cd e2e/server-side-cookies
RSA_SDK_URL=http://localhost:3001/cdn/modern/iife/rsa.min.js \
RSA_DATA_SERVICE_ORIGIN=http://localhost:9091 \
npm test
```

Against staging or after a release:

```bash
RSA_SDK_URL=https://cdn.rudderlabs.com/v3/modern/rsa.min.js \
RSA_WRITE_KEY=<write key> \
RSA_DATA_PLANE_URL=https://<dataplane> \
RSA_DATA_SERVICE_ORIGIN=https://<dataplane> \
RSA_STUB_SOURCE_CONFIG=false \
npm test
```

## Configuration

| Variable                  | Default                 | Purpose                                                          |
| :------------------------ | :---------------------- | :--------------------------------------------------------------- |
| `RSA_SDK_URL`             | v3 modern CDN build     | Bundle under test                                                |
| `RSA_WRITE_KEY`           | `dummy-write-key`       | Source write key                                                 |
| `RSA_DATA_PLANE_URL`      | `http://localhost:9091` | Where events are sent                                            |
| `RSA_DATA_SERVICE_ORIGIN` | `http://localhost:9091` | Origin answering the cookie request                              |
| `RSA_DATA_SERVICE_PATH`   | `rsaRequest`            | Endpoint path                                                    |
| `RSA_HARNESS_PORT`        | `8080`                  | Port for the test page                                           |
| `RSA_STUB_SOURCE_CONFIG`  | `true`                  | Serve a local source config instead of the real one              |
| `RSA_PLUGINS_URL`         | v3 modern CDN plugins   | Plugins bundle, which a locally served core build does not carry |

## How it works, and the one thing it cannot check

The SDK derives the cookie endpoint from the **page origin**, so the page and the endpoint
have to be same-site. Rather than requiring the suite to be hosted alongside the data
service, the harness serves the page itself and proxies the cookie request to
`RSA_DATA_SERVICE_ORIGIN`, copying every `Set-Cookie` header through untouched.

That means cookies are exercised against `localhost` rather than the real domain, so
**domain scoping and cross-site `SameSite=None; Secure` behaviour are not covered here.**
Everything else — batching, ordering, attributes, lifetimes, reset — is.

## What it covers

- identity cookies are set through the data service on a first visit
- a page load costs **one** request carrying several cookies, not one request per cookie
- the response returns **one `Set-Cookie` header per cookie sent**, which is what catches a
  data service or proxy that collapses them
- no two cookie requests are ever in flight at once
- a repeat visit keeps the anonymous id and costs at most one request
- `identify` sets the user cookies server-side
- `reset` clears them and a queued write does not resurrect them
- identity cookies get a long lifetime rather than becoming session cookies
- no cookie errors are logged to the console
