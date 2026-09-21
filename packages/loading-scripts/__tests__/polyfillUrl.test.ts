import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * The bootstrap polyfill request is the earliest of the SDK's two polyfill entry points and
 * it gates the other one: it runs when Promise is missing, and the SDK cannot reach the
 * CapabilitiesManager URL without Promise because ExternalSrcLoader is built on it. Without
 * flags the service answers a modern-looking UA with a banner comment that still invokes
 * rudderAnalyticsMount, so the SDK mounts with no Promise at all.
 */
describe('loading snippet polyfill URL', () => {
  const snippetSource = readFileSync(join(__dirname, '../src/index.ts'), 'utf8');
  const polyfillUrl = /'(https:\/\/polyfill[^']*)'/.exec(snippetSource)?.[1];

  it('should request the polyfills for every user agent with runtime feature detection', () => {
    expect(polyfillUrl).toContain('flags=always%2Cgated');
  });

  it('should still hand control back to the SDK through the mount callback', () => {
    expect(polyfillUrl).toContain('callback=rudderAnalyticsMount');
  });

  it('should request the features the SDK bundle needs before it can run', () => {
    expect(polyfillUrl).toContain('features=Symbol%2CPromise');
  });
});
