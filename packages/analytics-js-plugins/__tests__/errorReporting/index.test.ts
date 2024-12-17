import { signal } from '@preact/signals-core';
import { clone } from 'ramda';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import type { ExtensionPoint } from '@rudderstack/analytics-js-common/types/PluginEngine';
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
    session: {
      sessionInfo: signal({ id: 'test-session-id' }),
    },
    autoTrack: {
      pageLifecycle: {
        visitId: signal('test-visit-id'),
      },
    },
  };

  let state: any;

  // Deprecated code
  const mockPluginEngine = {
    invokeSingle: jest.fn(() => Promise.resolve()),
  };
  const mockExtSrcLoader = {
    loadJSFile: jest.fn(() => Promise.resolve()),
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
    ErrorReporting()?.initialize?.(state);
    expect(state.plugins.loadedPlugins.value.includes('ErrorReporting')).toBe(true);
    expect(state.reporting.isErrorReportingPluginLoaded.value).toBe(true);
    expect(state.reporting.breadcrumbs.value[0].name).toBe('Error Reporting Plugin Loaded');
  });

  it('should not invoke error reporting provider plugin on init if request is coming from latest core SDK', () => {
    (ErrorReporting()?.errorReporting as ExtensionPoint)?.init?.(
      {},
      mockPluginEngine,
      mockExtSrcLoader,
      defaultLogger,
      true,
    );
    expect(mockPluginEngine.invokeSingle).not.toHaveBeenCalled();
  });

  it('should not invoke error reporting provider plugin on init if sourceConfig do not have required parameters', () => {
    (ErrorReporting()?.errorReporting as ExtensionPoint)?.init?.(
      state,
      mockPluginEngine,
      mockExtSrcLoader,
      defaultLogger,
      true,
    );
    expect(mockPluginEngine.invokeSingle).not.toHaveBeenCalled();
  });

  it('should not invoke error reporting provider plugin on init if request is coming from old core SDK', () => {
    (ErrorReporting()?.errorReporting as ExtensionPoint)?.init?.(
      state,
      mockPluginEngine,
      mockExtSrcLoader,
      defaultLogger,
    );
    expect(mockPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(mockPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReportingProvider.init',
      state,
      mockExtSrcLoader,
      defaultLogger,
    );
  });

  it('should invoke the error reporting provider plugin on notify if httpClient is not provided', () => {
    const dummyError = new Error('dummy error');
    (ErrorReporting()?.errorReporting as ExtensionPoint)?.notify?.(
      mockPluginEngine,
      mockErrReportingProviderClient,
      dummyError,
      state,
      defaultLogger,
    );
    expect(mockPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(mockPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReportingProvider.notify',
      mockErrReportingProviderClient,
      dummyError,
      state,
      defaultLogger,
    );
  });

  it('should not send data to metrics service if the error message contains certain', () => {
    state.lifecycle = {
      writeKey: signal('sample-write-key'),
    };
    state.metrics = {
      metricsServiceUrl: signal('https://test.com'),
    };
    const mockHttpClient = {
      getAsyncData: jest.fn(),
      setAuthHeader: jest.fn(),
    } as unknown as IHttpClient;
    const newError = new Error();
    const normalizedError = Object.create(newError, {
      message: { value: 'The request failed due to timeout' },
      stack: {
        value: `The request failed due to timeout at Analytics.page (http://localhost:3001/cdn/modern/iife/rsa.js:1610:3) at RudderAnalytics.page (http://localhost:3001/cdn/modern/iife/rsa.js:1666:84)`,
      },
    });
    (ErrorReporting()?.errorReporting as ExtensionPoint)?.notify?.(
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

  it('should send data to metrics service on notify when httpClient is provided', () => {
    state.lifecycle = {
      writeKey: signal('sample-write-key'),
    };
    state.metrics = {
      metricsServiceUrl: signal('https://test.com'),
    };
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
    (ErrorReporting()?.errorReporting as ExtensionPoint)?.notify?.(
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
    (ErrorReporting()?.errorReporting as ExtensionPoint)?.notify?.(
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
    (ErrorReporting()?.errorReporting as ExtensionPoint)?.breadcrumb?.(
      {},
      undefined,
      'dummy breadcrumb',
      undefined,
      state,
    );

    expect(state.reporting.breadcrumbs.value.length).toBe(breadcrumbLength + 1);
    expect(mockPluginEngine.invokeSingle).not.toHaveBeenCalled();
  });

  it('should invoke the error reporting provider plugin on new breadcrumb if state is not provided', () => {
    (ErrorReporting()?.errorReporting as ExtensionPoint)?.breadcrumb?.(
      mockPluginEngine,
      mockErrReportingProviderClient,
      'dummy breadcrumb',
      defaultLogger,
    );

    expect(mockPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(mockPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReportingProvider.breadcrumb',
      mockErrReportingProviderClient,
      'dummy breadcrumb',
      defaultLogger,
    );
  });
});
