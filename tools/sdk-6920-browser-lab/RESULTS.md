# SDK-6920 browser investigation — 16 November 2026

## Decision impact

Keep SDK-6920 In Progress. Web Locks around cookie read-modify-write are not sufficient evidence for the accepted lossless-update contract. Do not select this implementation or a final timeout yet.

Two constraints need a design response:

1. Different origins can share a parent-domain cookie while holding independent Web Locks. The deterministic subdomain control reproduced lost updates in Chromium, Firefox and WebKit.
2. One same-origin WebKit workload lost an update even with an exclusive lock and immediate read-back. Both tabs and the browser cookie store ended with `tab0: 80, tab1: 99`, although all 200 operations reported `applied` and both counters should have ended at 99. Later traced and untraced runs did not reproduce this failure. The observation remains an unresolved integrity failure; the precise cookie propagation/cache cause is not established.

Evaluate a design with one authoritative update coordinator and an explicit persistence acknowledgment. It must address the selected cookie scope, subdomains, cancellation and synchronous read contract. Do not silently change to local storage, weaken concurrent-update guarantees or treat immediate cookie read-back as durable acceptance. A same-origin IndexedDB transaction may be a comparison candidate, but does not by itself solve shared-cookie subdomains or preserve Q1's storage policy.

## Environment and evidence

SDK reference: `rudder-sdk-js` develop `9728fa821a1f5752d3e99cbc85a5b5b47dcceef2`. The standalone prototype does not execute SDK source. The source coverage audit below used checkout `13f0b7e213b559de0a37a47f1ce42eaeed50191f`.

Host: Apple M5, 10 cores, macOS Darwin 27.2.0, arm64, Node 26.0.0. Playwright 1.65.1: Chromium 159.0.8154.6, Firefox 159.0, WebKit 27.2. All engines ran headless. An initial Playwright 1.64.1 Firefox launch failed with `Could not find profile folder`; upgrading to the matching 1.65.1 browser set resolved launch. No browser privacy settings were changed. [Upstream launch issue](https://github.com/microsoft/playwright/issues/42768).

| Evidence file            | Coverage                                                           | Result                                                                                                     |
| ------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `baseline.json.gz`       | 75 targeted cases; 26 latency workloads; 6,248 sampled operations  | Targeted cases passed. One workload failed final-state integrity. The overall run failed.                  |
| `deadline-sweep.json.gz` | Eight throttled workloads; 2,048 operations                        | Measured actual deadline rejections. Two CDP lifecycle-freeze probes failed their suspension precondition. |
| `webkit-trace.json.gz`   | Five two-tab and five eight-tab cookie workloads; 2,280 operations | No final-state loss reproduced with tracing enabled.                                                       |
| `webkit-repeat.json.gz`  | Five two-tab cookie workloads; 5,000 operations                    | No final-state loss reproduced without tracing. This does not erase the baseline failure.                  |
| `debugger-pause.json.gz` | Two Chromium pause/resume cases                                    | Both rejected expired operations once and prevented late writes.                                           |

The original CDP lifecycle-freeze command did not delay completion past the intended pause. Those probes do not establish suspension behavior. The replacement debugger-pause probe confirms deadline checks after delayed JavaScript execution, not OS sleep, BFCache or actual tab freezing.

## Coordination and cancellation observations

The targeted cases exercised both cookie and local-storage fixtures in all three engines:

- An unsafe whole-object update loses an independent change. Exclusive same-origin locks preserve the tested object merges, array-index merges and selected-property replacement in the targeted fixtures.
- Campaign replacement preserves custom fields. Capture-trigger eligibility and unchanged-URL suppression were not implemented in this prototype.
- An aborted queued lock request never writes after the holder releases its lock. A deadline check also rejects work when the timer task is delayed by synchronous execution.
- A committed write keeps `applied` when callback delivery occurs after its deadline. There is no timeout rollback.
- A clear/reset generation boundary cancels gated old work. New work succeeds. Same-tab setter → clear and clear → setter retain their order.
- Synchronous reads expose the prior accepted value while a write waits. An event after that write waits for completion; a later setter does not change the event's captured snapshot.
- Callback exceptions do not block the next event. Closing a lock-holder tab releases waiting work.
- A shorter deadline on a later queued operation cannot let an event skip an older pending operation. The prototype uses a barrier over both earlier settlement and its own result. This edge case was corrected during the experiment and is now asserted.

These are prototype observations. They do not validate production consent/reset/expiry behavior, public callback overloads, preload snippets, storage fallback, or all callback reason mappings.

## Latency measurements

The eight-tab burst admits 32 updates per tab, for 256 updates. Values below are baseline p99 / maximum operation duration, in milliseconds, including the local queue, lock wait and synchronous storage operation.

| Engine                    | Local storage |        Cookie |
| ------------------------- | ------------: | ------------: |
| Chromium                  |   26.1 / 26.7 |   55.4 / 56.4 |
| Firefox                   |       34 / 37 |       43 / 45 |
| WebKit                    |       30 / 30 |       61 / 62 |
| Chromium, 6× CPU throttle | 190.4 / 197.8 | 625.3 / 632.8 |

The unthrottled eight-tab sequential workloads had p99 durations of 1.5–4 ms. One- and two-tab sequential p99 values were 0.2–2 ms. Low timings reflect this host and timer resolution; they are not service-level guarantees. The WebKit cookie integrity failure makes its timing results unsuitable as evidence of a correct implementation.

Actual budget sweep under the throttled eight-tab burst:

| Budget   | Local-storage timeouts / 256 | Cookie timeouts / 256 | Maximum cookie event wait |
| -------- | ---------------------------: | --------------------: | ------------------------: |
| 100 ms   |                          123 |                   231 |                  104.4 ms |
| 250 ms   |                            0 |                   158 |                  253.2 ms |
| 500 ms   |                            0 |                    42 |                  502.1 ms |
| 1,000 ms |                            0 |                     0 |                  570.4 ms |

Each row is a separate workload run. These are observed rejections, not estimates derived from percentile values. Timer scheduling can deliver completion after the write-eligibility deadline. No late write is permitted after a rejected result.

**Recommendation for the next experiment:** retain 1,000 ms as an upper candidate and compare it with 500 ms after the correct coordinator is implemented. In this synthetic cookie workload, 1,000 ms avoided the 42 rejections seen at 500 ms, at the cost of allowing roughly 570 ms of event wait. This is not an accepted production default. A smaller cap may deliberately reject overload sooner; that tradeoff needs SDK/Product review and measurements with production encoding and real devices.

## Existing coverage audit

Read-only audit; these existing suites were not executed during this investigation. SDK unit tests use the repository's extended jsdom environment. They can cover logic, but do not prove native cross-tab scheduling or cookie propagation.

| Existing coverage                                                                                                                                          | Reuse                                                                   | Gap for this feature                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `analytics-js/__tests__/components/userSessionManager/UserSessionManager.test.ts`                                                                          | Session hydration, auto/manual setup, expiry/cutoff, getters and reset  | Properties envelope, operation generations and cross-tab invalidation     |
| `analytics-js/__tests__/components/userSessionManager/preConsentStorageTransition.test.ts` and `services/StoreManager/preConsentStorageResolution.test.ts` | Per-entry pre-consent storage, precedence and relocation                | Pending-write cancellation and the new entry's independent consent        |
| `analytics-js/__tests__/services/StoreManager/storages/{CookieStorage,LocalStorage,InMemoryStorage}.test.ts`                                               | Basic engine behavior and cookie attributes                             | Real rejection/quota/read-back, native cookie freshness and tab isolation |
| `analytics-js-cookies/__tests__/cookieUtilities.test.ts`; encryption and legacy-encryption plugin tests                                                    | Encoding/encryption helper cases                                        | Encoded budget and browser acceptance together                            |
| `rudder-client-side-test`: `autoSessionTracking.feature`, `manualSessionTracking.feature`, `resetWithOptions.feature`                                      | Browser session IDs, manual override and selective reset across CDN/npm | Concurrent property updates, stale callbacks and cancellation             |
| `rudder-client-side-test`: `cookielessTracking.feature`, `genericConsentManagement.feature`                                                                | Storage choices and pre-consent event buffering                         | Cross-tab relocation and property/event ordering                          |

`rudder-client-side-test` at `41a2485e7e830595ef6ccb5a9ab4d0498b07d483` uses WebdriverIO/Cucumber and BrowserStack. Its `sessionRecovery.test.ts` concerns WebDriver connection recovery, not SDK session expiry. No Web Lock or multi-window case was found in the inspected SDK feature/step directories. Port selected regression cases into that established suite under SDK-6924 after a design is selected; do not replace the existing suite with this lab.

## Remaining validation

- Narrow the same-origin WebKit cookie integrity failure and validate an alternative coordination authority across the required storage scope.
- Real browser compatibility, shipped Safari, older browsers, mobile and slow devices; secure-context absence, memory fallback and partitioned storage.
- Production encoded/encrypted size, server-side-cookie mode, legacy encoding, quota/denial, read-back failure, durable-clear failure and uncertain commit outcomes.
- Actual SDK session expiry, consent transitions, manual sessions, reset options, startup/snippet queues and every public callback reason.
- OS suspension, BFCache, navigation, tab discard and crash recovery.
- Bundle overhead in SDK-6919, final timeout selection and customer-visible guarantees in SDK-6102/Product review.

Platform references: [Web Locks](https://www.w3.org/TR/web-locks/), [Web Storage](https://html.spec.whatwg.org/multipage/webstorage.html), [timer scheduling](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers), [Playwright browser engines](https://playwright.dev/docs/browsers), [browser contexts](https://playwright.dev/docs/browser-contexts).
