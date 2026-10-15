describe('Sentry constants', () => {
  afterEach(() => {
    delete global.__RUDDER_INTEGRATIONS_LEGACY_BUILD__;
    jest.resetModules();
  });

  test('uses Sentry 11 artifacts for modern builds', () => {
    global.__RUDDER_INTEGRATIONS_LEGACY_BUILD__ = false;
    jest.isolateModules(() => {
      const constants = require('../../../src/integrations/Sentry/constants');

      expect(constants.SENTRY_SDK_VERSION).toBe('11.6.0');
      expect(constants.SENTRY_SDK_ID).toBe('rudder-sentry-11.6.0-sdk');
      expect(constants.SENTRY_SDK_URL).toBe('https://browser.sentry-cdn.com/11.6.0/bundle.min.js');
      expect(constants.SENTRY_REWRITE_FRAMES_ID).toBe('rudder-sentry-11.6.0-rewrite-frames');
      expect(constants.SENTRY_REWRITE_FRAMES_URL).toBe(
        'https://browser.sentry-cdn.com/11.6.0/rewriteframes.min.js',
      );
    });
  });

  test('uses legacy-compatible Sentry artifacts for legacy builds', () => {
    global.__RUDDER_INTEGRATIONS_LEGACY_BUILD__ = true;
    jest.isolateModules(() => {
      const constants = require('../../../src/integrations/Sentry/constants');

      expect(constants.SENTRY_SDK_VERSION).toBe('6.13.1');
      expect(constants.SENTRY_SDK_ID).toBe('rudder-sentry-6.13.1-sdk');
      expect(constants.SENTRY_SDK_URL).toBe('https://browser.sentry-cdn.com/6.13.1/bundle.min.js');
      expect(constants.SENTRY_REWRITE_FRAMES_ID).toBe('rudder-sentry-6.13.1-rewrite-frames');
      expect(constants.SENTRY_REWRITE_FRAMES_URL).toBe(
        'https://browser.sentry-cdn.com/6.13.1/rewriteframes.min.js',
      );
    });
  });
});
