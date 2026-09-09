import type {
  PreloadedEventCall,
  RudderAnalytics,
  RudderAnalyticsPreloader,
} from '@rudderstack/analytics-js';

const getSdkScriptTag = (): HTMLScriptElement | undefined =>
  Array.from(document.querySelectorAll<HTMLScriptElement>('script[data-loader="RS_JS_SDK"]')).find(
    scriptTag => scriptTag.src.includes('rsa.min.js'),
  );

const getBuffer = (): PreloadedEventCall[] =>
  window.rudderanalytics as unknown as PreloadedEventCall[];

// Before the SDK bundle lands the global carries the stubs; afterwards it is the
// real instance. Both shapes are reached through their own accessor so the tests
// state which one they mean.
const getPreloader = (): RudderAnalyticsPreloader =>
  window.rudderanalytics as unknown as RudderAnalyticsPreloader;

// The buffer carries the API stubs and the snippetExecuted flag as own properties,
// so only its indexed contents can be compared against a plain array.
const getBufferedCalls = () => Array.from(getBuffer());

describe('CDN loader', () => {
  beforeEach(() => {
    jest.resetModules();
    // jest defaults the flag to false; this block covers the GTM build, so it
    // opts in explicitly. The snippet shape is covered by the block below.
    (window as unknown as { __IS_GTM_BUILD__: boolean }).__IS_GTM_BUILD__ = true;
    window.rudderanalytics = undefined;
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('creates the preload buffer and stubs the SDK API methods', async () => {
    await import('../src/index');

    expect(window.rudderanalytics).toEqual(expect.any(Array));

    [
      'setDefaultInstanceKey',
      'load',
      'ready',
      'page',
      'track',
      'identify',
      'alias',
      'group',
      'reset',
      'setAnonymousId',
      'startSession',
      'endSession',
      'consent',
      'addCustomIntegration',
      'setCustomContext',
      'clearCustomContext',
    ].forEach(method => {
      expect(getPreloader()[method]).toEqual(expect.any(Function));
    });
  });

  it('does not load the SDK itself', async () => {
    await import('../src/index');

    // The loader carries no write key and no data plane URL, so it must leave the
    // load call entirely to its caller.
    expect(getBuffer()).toHaveLength(0);
    expect(getSdkScriptTag()?.getAttribute('data-rsa-write-key')).toBeNull();
  });

  it('injects the SDK script async at the top of the head', async () => {
    await import('../src/index');

    const scriptTag = getSdkScriptTag();

    expect(scriptTag).toBeDefined();
    expect(scriptTag?.async).toBe(true);
    expect(scriptTag?.getAttribute('data-loader')).toBe('RS_JS_SDK');
    expect(document.head.firstChild).toBe(scriptTag);
  });

  it('resolves the build type by feature detection', async () => {
    await import('../src/index');

    // jsdom supports class fields, optional chaining and dynamic import, so the
    // probe in the loader has to resolve to the modern build.
    expect(window.rudderAnalyticsBuildType).toBe('modern');
    expect(getSdkScriptTag()?.src).toBe('https://cdn.rudderlabs.com/v3/modern/rsa.min.js');
  });

  it('sets the snippet version', async () => {
    await import('../src/index');

    expect(window.RudderSnippetVersion).toBe('0.0.0-test');
  });

  it('keeps a load call buffered before it runs', async () => {
    window.rudderanalytics = [] as unknown as RudderAnalytics;
    getBuffer().push(['load', 'write-key', 'https://dataplane.example.com', { logLevel: 'DEBUG' }]);

    await import('../src/index');

    // triggerBufferedLoadEvent looks for the buffered load call on construction,
    // so the loader must not disturb it.
    expect(getBufferedCalls()).toEqual([
      ['load', 'write-key', 'https://dataplane.example.com', { logLevel: 'DEBUG' }],
    ]);
  });

  it('accepts a load call pushed after it runs', async () => {
    await import('../src/index');

    getBuffer().push(['load', 'write-key', 'https://dataplane.example.com']);

    expect(getBufferedCalls()).toEqual([['load', 'write-key', 'https://dataplane.example.com']]);
  });

  it('buffers calls made through the stubs after it runs', async () => {
    await import('../src/index');

    getPreloader().load('write-key', 'https://dataplane.example.com');
    getPreloader().track('Order Completed', { revenue: 10 });

    expect(getBufferedCalls()).toEqual([
      ['load', 'write-key', 'https://dataplane.example.com'],
      ['track', 'Order Completed', { revenue: 10 }],
    ]);
  });

  it('forwards calls to the SDK once it has replaced the buffer', async () => {
    await import('../src/index');

    // Callers capture the stubs before the SDK lands, so they have to keep working
    // against the real instance afterwards.
    const bufferedTrack = getPreloader().track;
    const track = jest.fn();
    window.rudderanalytics = { track } as unknown as RudderAnalytics;

    bufferedTrack('Order Completed', { revenue: 10 });

    expect(track).toHaveBeenCalledWith('Order Completed', { revenue: 10 });
  });

  it('refuses to run twice and reports it', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    await import('../src/index');
    expect(document.querySelectorAll('script[data-loader="RS_JS_SDK"]')).toHaveLength(1);

    jest.resetModules();
    await import('../src/index');

    expect(consoleError).toHaveBeenCalledWith(
      'RudderStack JavaScript SDK snippet included more than once.',
    );
    expect(document.querySelectorAll('script[data-loader="RS_JS_SDK"]')).toHaveLength(1);

    consoleError.mockRestore();
  });

  it('does nothing when the SDK is already loaded', async () => {
    window.rudderanalytics = { load: jest.fn() } as unknown as RudderAnalytics;

    await import('../src/index');

    expect(getSdkScriptTag()).toBeUndefined();
  });
});

describe('loading snippet', () => {
  beforeEach(() => {
    jest.resetModules();
    (window as unknown as { __IS_GTM_BUILD__: boolean }).__IS_GTM_BUILD__ = false;
    window.rudderanalytics = undefined;
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('buffers a load call with its configured write key', async () => {
    await import('../src');

    // The placeholders are substituted when the snippet is filled in, so under
    // jest they stay literal. What matters is that this build calls load at all,
    // which is the only thing separating it from the GTM build.
    expect(getBufferedCalls()).toEqual([['load', '__WRITE_KEY__', '__DATAPLANE_URL__', {}]]);
  });

  it('passes its write key to the SDK script tag', async () => {
    await import('../src');

    // The SDK locates its own URL through this attribute.
    expect(getSdkScriptTag()?.getAttribute('data-rsa-write-key')).toBe('__WRITE_KEY__');
  });
});
