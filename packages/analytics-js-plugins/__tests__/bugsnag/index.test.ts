import type { ExtensionPoint } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { Bugsnag } from '../../src/bugsnag';
import * as bugsnagConstants from '../../src/bugsnag/constants';
import { resetState, state } from '../../__mocks__/state';

describe('Plugin - Bugsnag', () => {
  const origApiKey = bugsnagConstants.API_KEY;

  const mountBugsnagSDK = () => {
    (window as any).bugsnag = jest.fn(() => ({
      notifier: { version: '6.0.0' },
      leaveBreadcrumb: jest.fn(),
      notify: jest.fn(),
    }));
    return (window as any).bugsnag();
  };

  beforeEach(() => {
    resetState();
    delete (window as any).bugsnag;

    Object.defineProperty(bugsnagConstants, 'API_KEY', {
      value: origApiKey,
      writable: true,
    });
  });

  it('should add Bugsnag plugin in the loaded plugin list', () => {
    Bugsnag().initialize?.(state);
    expect(state.plugins.loadedPlugins.value.includes('Bugsnag')).toBe(true);
  });

  it('should reject the promise if the Api Key is not valid', async () => {
    Object.defineProperty(bugsnagConstants, 'API_KEY', {
      value: '{{ dummy api key }}',
      writable: true,
    });

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const pluginInitPromise = (Bugsnag().errorReportingProvider as ExtensionPoint)?.init?.();

    await expect(pluginInitPromise).rejects.toThrow(
      'The Bugsnag API key ({{ dummy api key }}) is invalid or not provided.',
    );
  });

  it('should reject the promise if the Bugsnag client could not be initialized', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(0);

    const mockExtSrcLoader = {
      loadJSFile: jest.fn(() => Promise.resolve()),
    };

    const pluginInitPromise = (Bugsnag().errorReportingProvider as ExtensionPoint)?.init?.(
      state,
      mockExtSrcLoader,
    );

    // Advance timers to trigger the timeout
    jest.advanceTimersByTime(10000);

    await expect(pluginInitPromise).rejects.toThrow(
      'A timeout 10000 ms occurred while trying to load the Bugsnag SDK.',
    );

    jest.useRealTimers();
  });

  it('should initialize the Bugsnag SDK and return the client instance', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(0);

    const mockExtSrcLoader = {
      loadJSFile: jest.fn(() => Promise.resolve()),
    };

    const pluginInitPromise = (Bugsnag().errorReportingProvider as ExtensionPoint)?.init?.(
      state,
      mockExtSrcLoader,
    );

    jest.advanceTimersByTime(1);
    mountBugsnagSDK();

    jest.runAllTimers();

    await expect(pluginInitPromise).resolves.toBeDefined();
  });

  it('should notify the client', () => {
    const bsClient = mountBugsnagSDK();

    const mockError = new Error('Test Error');

    (Bugsnag().errorReportingProvider as ExtensionPoint)?.notify?.(bsClient, mockError);

    expect(bsClient.notify).toHaveBeenCalledWith(mockError);
  });

  it('should leave a breadcrumb', () => {
    const bsClient = mountBugsnagSDK();

    const mockMessage = 'Test Breadcrumb';

    (Bugsnag().errorReportingProvider as ExtensionPoint)?.breadcrumb?.(bsClient, mockMessage);

    expect(bsClient.leaveBreadcrumb).toHaveBeenCalledWith(mockMessage);
  });
});
