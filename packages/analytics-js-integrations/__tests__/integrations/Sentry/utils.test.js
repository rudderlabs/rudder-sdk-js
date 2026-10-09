import { convertObjectToArray, sentryInit } from '../../../src/integrations/Sentry/utils';

const buildConfig = ({
  allowUrls = [],
  denyUrls = [],
  ignoreErrors = [],
  includePaths = [],
  customVersionProperty,
  release,
  dsn = 'https://public@example.com/1',
  debugMode = false,
  environment,
  serverName,
} = {}) =>
  sentryInit(
    allowUrls,
    denyUrls,
    ignoreErrors,
    includePaths,
    customVersionProperty,
    release,
    dsn,
    debugMode,
    environment,
    serverName,
  );

beforeEach(() => {
  delete window.APP_VERSION;
  window.Sentry = {
    rewriteFramesIntegration: jest.fn(options => ({ name: 'RewriteFrames', options })),
  };
});

afterEach(() => {
  delete window.Sentry;
  jest.restoreAllMocks();
});

describe('Sentry utilities', () => {
  test('convertObjectToArray extracts only defined, non-empty values', () => {
    expect(
      convertObjectToArray(
        [
          { allowUrls: 'app.example.com' },
          { allowUrls: '' },
          { allowUrls: null },
          { other: 'ignored' },
        ],
        'allowUrls',
      ),
    ).toEqual(['app.example.com']);
  });

  test('builds Sentry v11 init options and prefers the custom release property', () => {
    window.APP_VERSION = '2.0.0';

    expect(
      buildConfig({
        allowUrls: [{ allowUrls: 'app.example.com' }],
        denyUrls: [{ denyUrls: 'vendor.example.com' }],
        ignoreErrors: [{ ignoreErrors: 'Known error' }],
        customVersionProperty: 'APP_VERSION',
        release: '1.0.0',
        debugMode: true,
        environment: 'production',
        serverName: 'web-1',
      }),
    ).toEqual({
      dsn: 'https://public@example.com/1',
      debug: true,
      environment: 'production',
      release: '2.0.0',
      serverName: 'web-1',
      allowUrls: ['app.example.com'],
      denyUrls: ['vendor.example.com'],
      ignoreErrors: ['Known error'],
    });
  });

  test('creates the v11 RewriteFrames integration and preserves include-path classification', () => {
    const config = buildConfig({
      includePaths: [{ includePaths: '^https://app.example.com/' }, { includePaths: '[invalid' }],
    });

    expect(window.Sentry.rewriteFramesIntegration).toHaveBeenCalledTimes(1);
    expect(config.integrations).toEqual([{ name: 'RewriteFrames', options: expect.any(Object) }]);

    const { iteratee } = window.Sentry.rewriteFramesIntegration.mock.calls[0][0];
    expect(iteratee({ filename: 'https://app.example.com/main.js' })).toEqual({
      filename: 'https://app.example.com/main.js',
      in_app: true,
    });
    expect(iteratee({ filename: 'https://cdn.example.com/vendor.js' })).toEqual({
      filename: 'https://cdn.example.com/vendor.js',
      in_app: false,
    });
    expect(iteratee({})).toEqual({ in_app: false });
  });

  test('creates legacy RewriteFrames integration when the v11 factory is unavailable', () => {
    const rewriteFramesConstructor = jest.fn(options => ({ name: 'RewriteFrames', options }));
    window.Sentry = {
      Integrations: {
        RewriteFrames: rewriteFramesConstructor,
      },
    };

    const config = buildConfig({ includePaths: [{ includePaths: '^https://app.example.com/' }] });

    expect(rewriteFramesConstructor).toHaveBeenCalledTimes(1);
    expect(config.integrations).toEqual([{ name: 'RewriteFrames', options: expect.any(Object) }]);
  });

  test('omits RewriteFrames when no include paths are configured', () => {
    const config = buildConfig({ release: '1.0.0' });

    expect(config).not.toHaveProperty('integrations');
    expect(config).toMatchObject({
      environment: null,
      release: '1.0.0',
      serverName: null,
    });
    expect(window.Sentry.rewriteFramesIntegration).not.toHaveBeenCalled();
  });
});
