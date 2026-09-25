/**
 * Tests for the default polyfill service URL, which is built at module evaluation
 * time from the polyfill service base URL that is injected during the build
 */
describe('polyfill - POLYFILL_URL', () => {
  const POLYFILL_SERVICE_URL = 'https://polyfill-fastly.io/v3/polyfill.min.js';
  let originalPolyfillServiceUrl: string;

  beforeAll(() => {
    originalPolyfillServiceUrl = (global.window as any).__RS_POLYFILLIO_SDK_URL__;
  });

  afterEach(() => {
    (global.window as any).__RS_POLYFILLIO_SDK_URL__ = originalPolyfillServiceUrl;
    jest.resetModules();
  });

  const getPolyfillUrl = (): string => {
    (global.window as any).__RS_POLYFILLIO_SDK_URL__ = POLYFILL_SERVICE_URL;

    // Re-import to build the URL with the above base URL
    jest.resetModules();
    return require('../../../../src/components/capabilitiesManager/polyfill').POLYFILL_URL;
  };

  const getRequestedFeatures = (): string[] =>
    decodeURIComponent(getPolyfillUrl().split('&features=')[1] as string).split(',');

  it('should request the polyfills for every user agent with runtime feature detection', () => {
    expect(getPolyfillUrl()).toContain('flags=always%2Cgated');
  });

  it('should not request the features that the SDK does not need', () => {
    const requestedFeatures = getRequestedFeatures();

    expect(requestedFeatures).not.toContain('requestAnimationFrame');
    expect(requestedFeatures).not.toContain('navigator.sendBeacon');
  });

  it('should request the features that only the device mode integrations need', () => {
    const requestedFeatures = getRequestedFeatures();

    // analytics-js-integrations is neither transpiled nor polyfilled for these,
    // so they must stay in the list even though this package does not use them
    expect(requestedFeatures).toContain('Object.assign');
    expect(requestedFeatures).toContain('Object.fromEntries');
  });

  it('should request the Map polyfill', () => {
    expect(getRequestedFeatures()).toContain('Map');
  });
});
