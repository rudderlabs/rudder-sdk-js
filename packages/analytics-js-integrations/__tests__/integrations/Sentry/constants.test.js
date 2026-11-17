describe('Sentry constants', () => {
  test('uses only the Sentry 7.120.4 artifacts', () => {
    const constants = require('../../../src/integrations/Sentry/constants');

    expect(constants.SENTRY_SDK_VERSION).toBe('7.120.4');
    expect(constants.SENTRY_SDK_ID).toBe('rudder-sentry-7.120.4-sdk');
    expect(constants.SENTRY_SDK_URL).toBe(
      'https://browser.sentry-cdn.com/7.120.4/bundle.es5.min.js',
    );
    expect(constants.SENTRY_SDK_INTEGRITY).toBe(
      'sha384-DThi/zlFXuN6Ok27a9CexeQ2xJhyvNgqZMkj0SXm4JBVg4BnEd3twSxB5oKXva3P',
    );
    expect(constants.SENTRY_REWRITE_FRAMES_ID).toBe('rudder-sentry-7.120.4-rewrite-frames');
    expect(constants.SENTRY_REWRITE_FRAMES_URL).toBe(
      'https://browser.sentry-cdn.com/7.120.4/rewriteframes.es5.min.js',
    );
    expect(constants.SENTRY_REWRITE_FRAMES_INTEGRITY).toBe(
      'sha384-aPAXdgRLWL0KzsqqJ3Ocofd3WWn9nGQczGsRSsokosNPbJhO6cCVfQTjfzroTlY+',
    );
  });
});
