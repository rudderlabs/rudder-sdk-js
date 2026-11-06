describe('Sentry constants', () => {
  test('uses only the Sentry 11.6.0 artifacts', () => {
    const constants = require('../../../src/integrations/Sentry/constants');

    expect(constants.SENTRY_SDK_VERSION).toBe('11.6.0');
    expect(constants.SENTRY_SDK_ID).toBe('rudder-sentry-11.6.0-sdk');
    expect(constants.SENTRY_SDK_URL).toBe('https://browser.sentry-cdn.com/11.6.0/bundle.min.js');
    expect(constants.SENTRY_SDK_INTEGRITY).toBe(
      'sha384-rlznaM0ZTdlKZRMeVO8a43/HbvKhLqHABk8FFcshozlZDT84nCfG8GdTIWeQioHe',
    );
    expect(constants.SENTRY_REWRITE_FRAMES_ID).toBe('rudder-sentry-11.6.0-rewrite-frames');
    expect(constants.SENTRY_REWRITE_FRAMES_URL).toBe(
      'https://browser.sentry-cdn.com/11.6.0/rewriteframes.min.js',
    );
    expect(constants.SENTRY_REWRITE_FRAMES_INTEGRITY).toBe(
      'sha384-wr5WXNPJhwYJOBmdmTeEbeA5Qxx3uO5u7fU0CFiOGFgt45iYtMU9CxdYizOyr10U',
    );
  });
});
