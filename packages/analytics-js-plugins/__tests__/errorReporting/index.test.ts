import { signal } from '@preact/signals-core';
import { clone } from 'ramda';
import { ErrorReporting } from '../../src/errorReporting';

describe('Plugin - ErrorReporting', () => {
  const originalState = {
    plugins: {
      loadedPlugins: signal([]),
    },
    lifecycle: {
      writeKey: signal('dummy-write-key'),
    },
    source: signal({
      id: 'test-source-id',
      config: {},
    }),
  };

  let state: any;

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

  beforeEach(() => {
    state = clone(originalState);
  });

  it('should add ErrorReporting plugin in the loaded plugin list', () => {
    ErrorReporting().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('ErrorReporting')).toBe(true);
  });

  it('should reject the promise if source information is not available', async () => {
    state.source.value = null;

    const pluginInitPromise = ErrorReporting().errorReporting.init(state);

    await expect(pluginInitPromise).rejects.toThrow('Invalid source configuration or source id.');
  });

  it('should invoke the error reporting provider plugin on init', async () => {
    const pluginInitPromise = ErrorReporting().errorReporting.init(
      state,
      mockPluginEngine,
      mockExtSrcLoader,
      mockLogger,
    );

    await expect(pluginInitPromise).resolves.toBeUndefined(); // because it's just a mock
    expect(mockPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReportingProvider.init',
      state,
      mockExtSrcLoader,
      mockLogger,
    );
  });

  it('should invoke the error reporting provider plugin on notify', () => {
    ErrorReporting().errorReporting.notify(
      mockPluginEngine,
      mockErrReportingProviderClient,
      new Error('dummy error'),
      state,
      mockLogger,
    );

    expect(mockPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReportingProvider.notify',
      mockErrReportingProviderClient,
      new Error('dummy error'),
      state,
      mockLogger,
    );
  });

  it('should invoke the error reporting provider plugin on breadcrumb', () => {
    ErrorReporting().errorReporting.breadcrumb(
      mockPluginEngine,
      mockErrReportingProviderClient,
      'dummy breadcrumb',
      mockLogger,
    );

    expect(mockPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReportingProvider.breadcrumb',
      mockErrReportingProviderClient,
      'dummy breadcrumb',
      mockLogger,
    );
  });
});
