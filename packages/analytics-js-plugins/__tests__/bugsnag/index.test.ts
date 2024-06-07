import { signal } from '@preact/signals-core';
import { clone } from 'ramda';
import { Bugsnag } from '../../src/bugsnag';
import * as bugsnagConstants from '../../src/bugsnag/constants';

describe('Plugin - Bugsnag', () => {
  const originalState = {
    plugins: {
      loadedPlugins: signal([]),
    },
    lifecycle: {
      writeKey: signal('dummy-write-key'),
    },
    source: signal({
      id: 'test-source-id',
    }),
    context: {
      app: signal({
        name: 'test-app',
        namespace: 'test-namespace',
        version: '1.0.0',
        installType: 'npm',
      }),
    },
  };

  let state: any;

  const origApiKey = bugsnagConstants.API_KEY;
  const origMaxSDKWait = bugsnagConstants.MAX_WAIT_FOR_SDK_LOAD_MS;

  const mountBugsnagSDK = () => {
    (window as any).bugsnag = jest.fn(() => ({
      notifier: { version: '6.0.0' },
      leaveBreadcrumb: jest.fn(),
      notify: jest.fn(),
    }));
    return (window as any).bugsnag();
  };

  beforeEach(() => {
    state = clone(originalState);
    delete (window as any).bugsnag;
    bugsnagConstants.API_KEY = origApiKey;
    bugsnagConstants.MAX_WAIT_FOR_SDK_LOAD_MS = origMaxSDKWait;
  });

  it('should add Bugsnag plugin in the loaded plugin list', () => {
    Bugsnag().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('Bugsnag')).toBe(true);
  });

  it('should reject the promise if the Api Key is not valid', async () => {
    bugsnagConstants.API_KEY = '{{ dummy api key }}';

    const pluginInitPromise = Bugsnag().errorReportingProvider.init();

    await expect(pluginInitPromise).rejects.toThrow(
      'The Bugsnag API key ({{ dummy api key }}) is invalid or not provided.',
    );
  });

  it('should reject the promise if the Bugsnag client could not be initialized', async () => {
    bugsnagConstants.MAX_WAIT_FOR_SDK_LOAD_MS = 1000;

    const mockExtSrcLoader = {
      loadJSFile: jest.fn(() => Promise.resolve()),
    };

    const pluginInitPromise = Bugsnag().errorReportingProvider.init(state, mockExtSrcLoader);

    await expect(pluginInitPromise).rejects.toThrow(
      'A timeout 1000 ms occurred while trying to load the Bugsnag SDK.',
    );
  });

  it('should initialize the Bugsnag SDK and return the client instance', async () => {
    setTimeout(() => {
      mountBugsnagSDK();
    }, 500);

    const mockExtSrcLoader = {
      loadJSFile: jest.fn(() => Promise.resolve()),
    };

    const pluginInitPromise = Bugsnag().errorReportingProvider.init(state, mockExtSrcLoader);

    await expect(pluginInitPromise).resolves.toBeDefined();
  });

  it('should notify the client', () => {
    const bsClient = mountBugsnagSDK();

    const mockError = new Error('Test Error');

    Bugsnag().errorReportingProvider.notify(bsClient, mockError, state);

    expect(bsClient.notify).toHaveBeenCalledWith(mockError, {
      metaData: {
        state: {
          plugins: {
            loadedPlugins: [],
          },
          source: {
            id: 'test-source-id',
          },
          lifecycle: {
            writeKey: 'dummy-write-key',
          },
          context: {
            app: {
              name: 'test-app',
              namespace: 'test-namespace',
              version: '1.0.0',
              installType: 'npm',
            },
          },
        },
      },
    });
  });

  it('should leave a breadcrumb', () => {
    const bsClient = mountBugsnagSDK();

    const mockMessage = 'Test Breadcrumb';

    Bugsnag().errorReportingProvider.breadcrumb(bsClient, mockMessage);

    expect(bsClient.leaveBreadcrumb).toHaveBeenCalledWith(mockMessage);
  });
});
