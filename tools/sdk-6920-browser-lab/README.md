# Session-property coordination feasibility lab

This is a standalone experiment for [SDK-6920](https://linear.app/rudderstack/issue/SDK-6920). It tests native browser storage and Web Locks with a synthetic session-property coordinator. It does not load or change the SDK, implement the approved public API, or establish a supported customer guarantee.

**Result: the cookie design is not validated.** The experiment reproduced lost updates across subdomains in all three engines. One WebKit workload also lost an update between two tabs on the same origin, despite exclusive locks and successful immediate read-back. See [the results](RESULTS.md).

## Run

From this directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install chromium firefox webkit
npm test
```

The exact Playwright version is pinned in the independent lockfile. No root SDK dependencies are required. The recorded host used Node 26.0.0 on macOS arm64. The runner starts a local HTTP fixture and closes its browser contexts and server after each run.

Optional investigations:

```sh
ENGINES=chromium MODE=deadlines npm test
ENGINES=chromium MODE=paused npm test
ENGINES=webkit MODE=stress npm test
ENGINES=webkit MODE=repro npm test
```

- Default: 75 targeted cases across Chromium, Firefox and WebKit, plus latency workloads with one, two and eight tabs.
- `deadlines`: actual 100/250/500/1000 ms budgets under an eight-tab burst and Chromium 6× CPU throttling, plus debugger-pause probes.
- `paused`: debugger pause/resume only. This does not simulate OS sleep, BFCache or tab discard.
- `stress`: five pairs of two-tab and eight-tab cookie workloads, with per-operation state traces.
- `repro`: five two-tab cookie workloads, 500 operations per tab, without state tracing.

`results/<timestamp>/raw.json` includes engine versions, environment, outcome counts, raw queue/lock/commit/total timings, final states, and event wait. It is ignored by Git. The recorded evidence is in `evidence/*.json.gz`; each file contains the exact browser fixture source used, with its SHA-256. Decode with `gzip -dc evidence/baseline.json.gz`. The runner exits nonzero for failed scenarios, unavailable engines or workload integrity failures. Negative controls pass when the expected unsafe overwrite is reproduced.

## What runs in a real browser

Pages in the same Playwright browser context share real cookies and local storage. `navigator.locks`, `document.cookie`, storage reads/writes, abort signals and timers are native. Tests use gates to force interleavings. They compare final values with independent expected values. Cookie workload checks also read the browser context's cookie store, so a stale page getter alone cannot explain a reported final-state loss.

The subdomain control uses `https://a.sdk6920.test` and `https://b.sdk6920.test`. Playwright serves only the HTTP responses from local fixtures. Native origin separation, secure contexts, parent-domain cookies and locks remain active. This is not a DNS/TLS/network test. All data is synthetic; no analytics events are sent.

`lab.js` deliberately models only JSON fixture merging, a session ID/generation, an operation queue, callbacks and event snapshots. It does not import production merge/sanitization, encryption, consent, session expiry or snippet code. The result called `unresolved` is a **lab diagnostic**, not a proposed public status. It prevents a failed write verification from being mislabeled as a confirmed rejection.

## Interpretation limits

- Headless Playwright engines are real engines. They are not proof of shipped Safari, mobile browsers, legacy browsers or real slow devices.
- Chromium CPU throttling is a simulation. It does not reproduce mobile disk, IPC, battery or background scheduling behavior.
- The large fixture uses roughly 1.9 KiB of properties, before encryption. Cookie encoding and read-back are included; production encryption and SDK overhead are not.
- A 60-second budget is used only to collect uncensored baseline timings. It is not a proposed product timeout.
- Sequential workloads await each mutation before the next one. Their final event has little remaining work. Burst event timing measures the wait behind the admitted burst.
- The final event waits only for work admitted before it. An early timeout of a newer operation must not release that event past an older pending operation.
- The synchronous critical section checks the deadline immediately before writing. A timer cannot interrupt a synchronous browser write. Once that write commits, the operation keeps its actual outcome.
- Browser suspension, uncertain persistence outcomes, denied/quota storage, consent and production integration remain open.

The accepted SDK contract remains the design target. A weaker fallback requires explicit SDK and Product review.
