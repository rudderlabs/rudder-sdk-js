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
      breadCrumbs: signal([]),
    },
    context: {
      locale: signal('en-GB'),
      userAgent: signal('sample user agent'),
    },
    source: signal({
      id: 'test-source-id',
      config: {},
    }),
  };

  let state: any;

  beforeEach(() => {
    state = clone(originalState);
  });

  it('should add ErrorReporting plugin in the loaded plugin list', () => {
    ErrorReporting().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('ErrorReporting')).toBe(true);
    expect(state.reporting.isErrorReportingPluginLoaded.value).toBe(true);
    expect(state.reporting.breadCrumbs.value[0].message).toBe('Error Reporting Plugin Loaded');
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
      normalizedError,
      {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
      state,
      mockHttpClient,
    );

    expect(mockHttpClient.getAsyncData).toHaveBeenCalled();
  });

  it('should add a new breadcrumb', () => {
    const breadcrumbLength = state.reporting.breadCrumbs.value.length;
    ErrorReporting().errorReporting.breadcrumb('dummy breadcrumb', state);

    expect(state.reporting.breadCrumbs.value.length).toBe(breadcrumbLength + 1);
  });
});
