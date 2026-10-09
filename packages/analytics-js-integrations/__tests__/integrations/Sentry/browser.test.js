import Sentry from '../../../src/integrations/Sentry/browser';
import {
  SENTRY_SDK_ID,
  SENTRY_SDK_URL,
  SENTRY_SDK_INTEGRITY,
  SENTRY_REWRITE_FRAMES_ID,
  SENTRY_REWRITE_FRAMES_URL,
  SENTRY_REWRITE_FRAMES_INTEGRITY,
} from '../../../src/integrations/Sentry/constants';

const baseConfig = {
  dsn: 'https://public@example.com/1',
  debugMode: true,
  environment: 'test',
  ignoreErrors: [{ ignoreErrors: 'ResizeObserver loop limit exceeded' }],
  includePaths: [{ includePaths: '^https://app.example.com/' }],
  logger: 'rudder-sdk-js',
  allowUrls: [{ allowUrls: 'app.example.com' }],
  denyUrls: [{ denyUrls: 'vendor.example.com' }],
  release: '1.2.3',
  customVersionProperty: 'APP_VERSION',
  serverName: 'web-1',
};

const makeIntegration = (config = {}) =>
  new Sentry({ ...baseConfig, ...config }, { logLevel: 'DEBUG' });

const installSentryGlobal = () => {
  const rewriteFramesIntegration = jest.fn(options => ({ name: 'RewriteFrames', options }));
  window.Sentry = {
    init: jest.fn(),
    rewriteFramesIntegration,
    setTag: jest.fn(),
    setUser: jest.fn(),
  };
  return window.Sentry;
};

beforeEach(() => {
  document.head.innerHTML = '<script id="dummyScript"></script>';
  delete window.APP_VERSION;
  delete window.Sentry;
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'info').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Sentry initialization', () => {
  test('loads the Sentry 11 browser bundle and RewriteFrames add-on once when include paths need it', () => {
    const integration = makeIntegration();

    integration.init();
    integration.init();

    const scripts = Array.from(document.querySelectorAll('script')).filter(script =>
      script.id.startsWith('rudder-sentry'),
    );
    expect(scripts).toHaveLength(2);
    expect(scripts.map(script => script.id)).toEqual(
      expect.arrayContaining([SENTRY_SDK_ID, SENTRY_REWRITE_FRAMES_ID]),
    );
    expect(document.getElementById(SENTRY_SDK_ID)).toMatchObject({
      src: SENTRY_SDK_URL,
      integrity: SENTRY_SDK_INTEGRITY,
    });
    expect(document.getElementById(SENTRY_REWRITE_FRAMES_ID)).toMatchObject({
      src: SENTRY_REWRITE_FRAMES_URL,
      integrity: SENTRY_REWRITE_FRAMES_INTEGRITY,
    });
    scripts.forEach(script => {
      expect(script.crossOrigin).toBe('anonymous');
      expect(script.async).toBe(false);
      expect(script.type).toBe('text/javascript');
      expect(script.getAttribute('data-loader')).toBe('RS_JS_SDK');
      expect(script.getAttribute('data-rudder-sentry-load-status')).toBe('loading');
    });
  });

  test('loads only the base Sentry 11 browser bundle when include paths are not configured', () => {
    const integration = makeIntegration({ includePaths: [] });

    integration.init();

    const scripts = Array.from(document.querySelectorAll('script')).filter(script =>
      script.id.startsWith('rudder-sentry'),
    );
    expect(scripts).toHaveLength(1);
    expect(document.getElementById(SENTRY_SDK_ID)).toMatchObject({
      src: SENTRY_SDK_URL,
      integrity: SENTRY_SDK_INTEGRITY,
    });
    expect(document.getElementById(SENTRY_REWRITE_FRAMES_ID)).toBeNull();
  });

  test('replaces stale or failed Sentry script elements before retrying the loader', () => {
    const staleSdkScript = document.createElement('script');
    staleSdkScript.id = SENTRY_SDK_ID;
    staleSdkScript.src = 'https://browser.sentry-cdn.com/6.13.1/bundle.min.js';
    staleSdkScript.integrity = 'sha384-old';
    document.head.appendChild(staleSdkScript);

    const failedRewriteFramesScript = document.createElement('script');
    failedRewriteFramesScript.id = SENTRY_REWRITE_FRAMES_ID;
    failedRewriteFramesScript.src = SENTRY_REWRITE_FRAMES_URL;
    failedRewriteFramesScript.integrity = SENTRY_REWRITE_FRAMES_INTEGRITY;
    failedRewriteFramesScript.setAttribute('data-rudder-sentry-load-status', 'failed');
    document.head.appendChild(failedRewriteFramesScript);

    makeIntegration().init();

    expect(staleSdkScript.isConnected).toBe(false);
    expect(failedRewriteFramesScript.isConnected).toBe(false);
    expect(document.getElementById(SENTRY_SDK_ID)).toMatchObject({
      src: SENTRY_SDK_URL,
      integrity: SENTRY_SDK_INTEGRITY,
    });
    expect(document.getElementById(SENTRY_REWRITE_FRAMES_ID)).toMatchObject({
      src: SENTRY_REWRITE_FRAMES_URL,
      integrity: SENTRY_REWRITE_FRAMES_INTEGRITY,
    });
  });

  test('retries a loaded Sentry script when the expected v11 global shape is absent', () => {
    const loadedSdkScript = document.createElement('script');
    loadedSdkScript.id = SENTRY_SDK_ID;
    loadedSdkScript.src = SENTRY_SDK_URL;
    loadedSdkScript.integrity = SENTRY_SDK_INTEGRITY;
    loadedSdkScript.setAttribute('data-rudder-sentry-load-status', 'loaded');
    document.head.appendChild(loadedSdkScript);
    window.Sentry = { Integrations: { RewriteFrames: jest.fn() } };

    makeIntegration({ includePaths: [] }).init();

    expect(loadedSdkScript.isConnected).toBe(false);
    expect(document.getElementById(SENTRY_SDK_ID)).toMatchObject({
      src: SENTRY_SDK_URL,
      integrity: SENTRY_SDK_INTEGRITY,
    });
  });

  test('does not load scripts without the mandatory DSN', () => {
    const integration = makeIntegration({ dsn: undefined });

    integration.init();

    expect(document.querySelectorAll('script[id^="rudder-sentry"]')).toHaveLength(0);
    expect(console.error.mock.calls[0][0]).toContain('DSN is a mandatory field');
  });

  test.each([
    ['missing global', undefined],
    ['non-object global', jest.fn()],
    ['missing init', { setUser: jest.fn(), rewriteFramesIntegration: jest.fn() }],
    ['missing setUser', { init: jest.fn(), rewriteFramesIntegration: jest.fn() }],
    ['missing RewriteFrames factory', { init: jest.fn(), setUser: jest.fn() }],
  ])(
    'is not loaded when the Sentry global is %s and include paths require RewriteFrames',
    (description, sentryGlobal) => {
      window.Sentry = sentryGlobal;

      expect(makeIntegration().isLoaded()).toBe(false);
    },
  );

  test('initializes Sentry once the v11 global and RewriteFrames factory are available', () => {
    window.APP_VERSION = '2.0.0';
    const sentry = installSentryGlobal();
    const integration = makeIntegration();

    expect(integration.isLoaded()).toBe(true);
    expect(integration.isReady()).toBe(true);
    expect(integration.isReady()).toBe(true);

    expect(sentry.rewriteFramesIntegration).toHaveBeenCalledTimes(1);
    expect(sentry.init).toHaveBeenCalledTimes(1);
    expect(sentry.init).toHaveBeenCalledWith({
      dsn: baseConfig.dsn,
      debug: true,
      environment: 'test',
      release: '2.0.0',
      serverName: 'web-1',
      allowUrls: ['app.example.com'],
      denyUrls: ['vendor.example.com'],
      ignoreErrors: ['ResizeObserver loop limit exceeded'],
      integrations: [{ name: 'RewriteFrames', options: expect.any(Object) }],
    });
    expect(sentry.setTag).toHaveBeenCalledTimes(1);
    expect(sentry.setTag).toHaveBeenCalledWith('logger', 'rudder-sdk-js');
  });

  test('is ready without the RewriteFrames factory when include paths are not configured', () => {
    const sentry = installSentryGlobal();
    delete sentry.rewriteFramesIntegration;
    const integration = makeIntegration({ includePaths: [] });

    expect(integration.isLoaded()).toBe(true);
    expect(integration.isReady()).toBe(true);

    expect(sentry.init).toHaveBeenCalledWith(
      expect.not.objectContaining({ integrations: expect.anything() }),
    );
  });
});

describe('Sentry identify', () => {
  test('sets the supported Sentry user fields and defined custom traits', () => {
    const sentry = installSentryGlobal();
    const integration = makeIntegration();

    integration.identify({
      message: {
        userId: 'user-123',
        context: {
          traits: {
            email: 'person@example.com',
            name: 'Person',
            ip_address: '192.0.2.1',
            plan: 'enterprise',
            nullable: null,
          },
        },
      },
    });

    expect(sentry.setUser).toHaveBeenCalledWith({
      id: 'user-123',
      email: 'person@example.com',
      username: 'Person',
      ip_address: '192.0.2.1',
      name: 'Person',
      plan: 'enterprise',
    });
  });

  test('drops identify when no supported identity property is present', () => {
    const sentry = installSentryGlobal();
    const integration = makeIntegration();

    integration.identify({ message: { context: { traits: { plan: 'free' } } } });

    expect(sentry.setUser).not.toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toContain(
      'Any one of userId, email, name and ip_address is mandatory',
    );
  });

  test('only implements identify forwarding in the device-mode event matrix', () => {
    const integration = makeIntegration();

    expect(typeof integration.identify).toBe('function');
    expect(integration.track).toBeUndefined();
    expect(integration.page).toBeUndefined();
    expect(integration.screen).toBeUndefined();
  });
});
