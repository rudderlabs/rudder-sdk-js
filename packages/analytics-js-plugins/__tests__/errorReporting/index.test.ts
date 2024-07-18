import { signal } from '@preact/signals-core';
import { clone } from 'ramda';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { ErrorReporting } from '../../src/errorReporting';

describe('Plugin - ErrorReporting', () => {
  const originalState = {
    plugins: {
      loadedPlugins: signal([]),
    },
    lifecycle: {
      writeKey: signal('dummy-write-key'),
    },
    reporting: {
      isErrorReportingPluginLoaded: signal(false),
      breadcrumbs: signal([]),
    },
    context: {
      locale: signal('en-GB'),
      userAgent: signal('sample user agent'),
      app: signal({ version: 'sample_version', installType: 'sample_installType' }),
    },
    source: signal({
      id: 'test-source-id',
      config: {},
    }),
  };

  let state: any;

  // Deprecated code
  const mockPluginEngine = {
    invokeSingle: jest.fn(() => Promise.resolve()),
  };
  const mockExtSrcLoader = {
    loadJSFile: jest.fn(() => Promise.resolve()),
  };
  const mockLogger = {
    error: jest.fn(),
  };
  const mockErrReportingProviderClient = {
    notify: jest.fn(),
    leaveBreadcrumb: jest.fn(),
  };
  // End of deprecated code

  beforeEach(() => {
    state = clone(originalState);
  });

  it('should add ErrorReporting plugin in the loaded plugin list', () => {
    ErrorReporting().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('ErrorReporting')).toBe(true);
    expect(state.reporting.isErrorReportingPluginLoaded.value).toBe(true);
    expect(state.reporting.breadcrumbs.value[0].name).toBe('Error Reporting Plugin Loaded');
  });

  it('should invoke the error reporting provider plugin on notify', () => {
    const mockHttpClient = {
      getAsyncData: jest.fn(),
      setAuthHeader: jest.fn(),
    } as unknown as IHttpClient;
    const newError = new Error();
    const normalizedError = Object.create(newError, {
      message: { value: 'ReferenceError: testUndefinedFn is not defined' },
      stack: {
        value: `ReferenceError: testUndefinedFn is not defined at Analytics.page (http://localhost:3001/cdn/modern/iife/rsa.js:1610:3) at RudderAnalytics.page (http://localhost:3001/cdn/modern/iife/rsa.js:1666:84)`,
      },
    });
    ErrorReporting().errorReporting.notify(
      {},
      undefined,
      normalizedError,
      state,
      undefined,
      mockHttpClient,
      {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
    );

    expect(mockHttpClient.getAsyncData).toHaveBeenCalled();
  });

  it('should not notify if the error is not an SDK error', () => {
    const mockHttpClient = {
      getAsyncData: jest.fn(),
      setAuthHeader: jest.fn(),
    } as unknown as IHttpClient;
    const newError = new Error();
    const normalizedError = Object.create(newError, {
      message: { value: 'ReferenceError: testUndefinedFn is not defined' },
      stack: {
        value: `ReferenceError: testUndefinedFn is not defined at Abcd.page (http://localhost:3001/cdn/modern/iife/abc.js:1610:3) at xyz.page (http://localhost:3001/cdn/modern/iife/abc.js:1666:84)`,
      },
    });
    ErrorReporting().errorReporting.notify(
      {},
      undefined,
      normalizedError,
      state,
      undefined,
      mockHttpClient,
      {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
    );

    expect(mockHttpClient.getAsyncData).not.toHaveBeenCalled();
  });

  it('should add a new breadcrumb', () => {
    const breadcrumbLength = state.reporting.breadcrumbs.value.length;
    ErrorReporting().errorReporting.breadcrumb({}, undefined, 'dummy breadcrumb', undefined, state);

    expect(state.reporting.breadcrumbs.value.length).toBe(breadcrumbLength + 1);
  });
});
