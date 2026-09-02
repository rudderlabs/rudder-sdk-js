import { test, expect } from '@playwright/test';
import config, { COOKIE_NAMES } from '../config.js';

const ONE_YEAR_SECONDS = 365 * 24 * 60 * 60;

/**
 * Records every cookie request the page makes, along with how many cookies each one
 * carried and how many Set-Cookie headers came back. That pairing is what distinguishes
 * "the SDK batched" from "the server honoured the batch".
 */
const trackCookieRequests = page => {
  const requests = [];

  page.on('request', request => {
    if (request.method() === 'POST' && request.url().endsWith(`/${config.dataServicePath}`)) {
      let cookieCount = 0;
      try {
        cookieCount = JSON.parse(request.postData() ?? '{}').data?.cookies?.length ?? 0;
      } catch {
        cookieCount = 0;
      }
      requests.push({ cookieCount, startedAt: Date.now(), setCookieCount: null });
    }
  });

  page.on('response', async response => {
    if (
      response.request().method() === 'POST' &&
      response.url().endsWith(`/${config.dataServicePath}`)
    ) {
      const pending = requests.find(entry => entry.setCookieCount === null);
      if (pending) {
        const headers = await response.headersArray();
        pending.setCookieCount = headers.filter(
          header => header.name.toLowerCase() === 'set-cookie',
        ).length;
        pending.finishedAt = Date.now();
      }
    }
  });

  return requests;
};

const cookiesByName = async context => {
  const all = await context.cookies();
  return Object.fromEntries(all.map(cookie => [cookie.name, cookie]));
};

const waitForSdk = async page => {
  await page.waitForFunction(() => window.__rsaReady !== undefined);
  await page.evaluate(() => window.__rsaReady);
  // Let the cookie debounce fire and the response land
  await page.waitForTimeout(500);
};

test.describe('server-side cookies', () => {
  test('sets the identity cookies through the data service on a first visit', async ({
    page,
    context,
  }) => {
    const requests = trackCookieRequests(page);
    await page.goto(config.pageUrl);
    await waitForSdk(page);

    const cookies = await cookiesByName(context);

    expect(cookies[COOKIE_NAMES.anonymousId], 'anonymous id cookie').toBeDefined();
    expect(cookies[COOKIE_NAMES.sessionInfo], 'session cookie').toBeDefined();
    expect(requests.length, 'at least one cookie request was made').toBeGreaterThan(0);
  });

  test('carries every cookie of a page load in a single request', async ({ page }) => {
    const requests = trackCookieRequests(page);
    await page.goto(config.pageUrl);
    await waitForSdk(page);

    expect(requests.length, 'one request per page load, not one per cookie').toBe(1);
    expect(requests[0].cookieCount, 'the request carried more than one cookie').toBeGreaterThan(1);
  });

  test('gets one Set-Cookie header back per cookie sent', async ({ page }) => {
    const requests = trackCookieRequests(page);
    await page.goto(config.pageUrl);
    await waitForSdk(page);

    const batched = requests.filter(entry => entry.cookieCount > 1);
    expect(batched.length, 'a batched request was made').toBeGreaterThan(0);

    batched.forEach(entry => {
      expect(
        entry.setCookieCount,
        'the data service must not collapse a batch into one Set-Cookie header',
      ).toBe(entry.cookieCount);
    });
  });

  test('never has two cookie requests in flight at once', async ({ page }) => {
    const requests = trackCookieRequests(page);
    await page.goto(config.pageUrl);
    await waitForSdk(page);

    await page.evaluate(() => {
      window.rudderanalytics.identify('e2e-user', { plan: 'gold' });
      window.rudderanalytics.track('e2e event one');
      window.rudderanalytics.track('e2e event two');
    });
    await page.waitForTimeout(1500);

    const overlapping = requests.filter(
      (entry, index) =>
        index > 0 &&
        requests[index - 1].finishedAt &&
        entry.startedAt < requests[index - 1].finishedAt,
    );
    expect(overlapping, 'requests must be serialised').toHaveLength(0);
  });

  test('persists the anonymous id across reloads without re-requesting every cookie', async ({
    page,
    context,
  }) => {
    await page.goto(config.pageUrl);
    await waitForSdk(page);
    const first = await cookiesByName(context);
    const anonymousId = first[COOKIE_NAMES.anonymousId]?.value;

    const requests = trackCookieRequests(page);
    await page.reload();
    await waitForSdk(page);

    const second = await cookiesByName(context);
    expect(second[COOKIE_NAMES.anonymousId]?.value, 'anonymous id is stable').toBe(anonymousId);
    expect(requests.length, 'a repeat visit costs one request, not four').toBeLessThanOrEqual(1);
  });

  test('sets the user cookies through the data service on identify', async ({ page, context }) => {
    await page.goto(config.pageUrl);
    await waitForSdk(page);

    await page.evaluate(() => window.rudderanalytics.identify('e2e-user', { plan: 'gold' }));
    await page.waitForTimeout(800);

    const cookies = await cookiesByName(context);
    expect(cookies[COOKIE_NAMES.userId], 'user id cookie').toBeDefined();
    expect(cookies[COOKIE_NAMES.userTraits], 'user traits cookie').toBeDefined();
  });

  test('clears the user cookies on reset without resurrecting them', async ({ page, context }) => {
    await page.goto(config.pageUrl);
    await waitForSdk(page);

    await page.evaluate(() => window.rudderanalytics.identify('e2e-user', { plan: 'gold' }));
    await page.waitForTimeout(800);

    await page.evaluate(() => window.rudderanalytics.reset());
    // Long enough for any queued write to have fired and been answered
    await page.waitForTimeout(1500);

    const cookies = await cookiesByName(context);
    expect(cookies[COOKIE_NAMES.userId], 'user id cookie is gone after reset').toBeUndefined();
  });

  test('gives the identity cookies a long lifetime', async ({ page, context }) => {
    await page.goto(config.pageUrl);
    await waitForSdk(page);

    const cookies = await cookiesByName(context);
    const anonymousId = cookies[COOKIE_NAMES.anonymousId];
    const remaining = anonymousId.expires - Date.now() / 1000;

    expect(anonymousId.expires, 'the cookie is not a session cookie').toBeGreaterThan(0);
    // Browsers cap cookie lifetimes, so assert a long life rather than exactly one year
    expect(remaining, 'the cookie should outlive a browsing session by a long way').toBeGreaterThan(
      ONE_YEAR_SECONDS / 4,
    );
  });

  test('does not report cookie failures in the console', async ({ page }) => {
    const errors = [];
    page.on('console', message => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });

    await page.goto(config.pageUrl);
    await waitForSdk(page);

    const cookieErrors = errors.filter(
      text => text.includes('cookie') || text.includes('Set-Cookie'),
    );
    expect(cookieErrors, 'no cookie errors were logged').toHaveLength(0);
  });
});
