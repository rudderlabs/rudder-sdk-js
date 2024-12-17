import { signal } from '@preact/signals-core';
import { ExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import * as bugsnagConstants from '../../src/bugsnag/constants';
import {
  isApiKeyValid,
  getGlobalBugsnagLibInstance,
  getReleaseStage,
  isValidVersion,
  isRudderSDKError,
  enhanceErrorEventMutator,
  initBugsnagClient,
  loadBugsnagSDK,
  onError,
  getAppStateForMetadata,
} from '../../src/bugsnag/utils';
import { server } from '../../__fixtures__/msw.server';
import type { BugsnagLib } from '../../src/types/plugins';
import { resetState, state } from '../../__mocks__/state';

beforeEach(() => {
  window.RudderSnippetVersion = '3.0.0';
  resetState();
  state.lifecycle.writeKey.value = 'dummy-write-key';
});

afterEach(() => {
  window.RudderSnippetVersion = undefined;
});

const DEFAULT_STATE_DATA = {
  autoTrack: {
    enabled: false,
    pageLifecycle: {
      enabled: false,
    },
  },
  capabilities: {
    isAdBlocked: false,
    isBeaconAvailable: false,
    isCryptoAvailable: false,
    isIE11: false,
    isLegacyDOM: false,
    isOnline: true,
    isUaCHAvailable: false,
    storage: {
      isCookieStorageAvailable: false,
      isLocalStorageAvailable: false,
      isSessionStorageAvailable: false,
    },
  },
  consents: {
    data: {},
    enabled: false,
    initialized: false,
    postConsent: {},
    preConsent: {
      enabled: false,
    },
    resolutionStrategy: 'and',
  },
  context: {
    app: {
      installType: 'cdn',
      name: 'RudderLabs JavaScript SDK',
      namespace: 'com.rudderlabs.javascript',
      version: 'dev-snapshot',
    },
    device: null,
    library: {
      name: 'RudderLabs JavaScript SDK',
      version: 'dev-snapshot',
    },
    locale: null,
    network: null,
    os: {
      name: '',
      version: '',
    },
    screen: {
      density: 0,
      height: 0,
      innerHeight: 0,
      innerWidth: 0,
      width: 0,
    },
    userAgent: '',
  },
  dataPlaneEvents: {
    deliveryEnabled: true,
  },
  lifecycle: {
    initialized: false,
    loaded: false,
    logLevel: 'ERROR',
    readyCallbacks: [],
    writeKey: 'dummy-write-key',
  },
  loadOptions: {
    beaconQueueOptions: {},
    bufferDataPlaneEventsUntilReady: false,
    configUrl: 'https://api.rudderstack.com',
    dataPlaneEventsBufferTimeout: 1000,
    destinationsQueueOptions: {},
    integrations: {
      All: true,
    },
    loadIntegration: true,
    lockIntegrationsVersion: false,
    lockPluginsVersion: false,
    logLevel: 'ERROR',
    plugins: [],
    polyfillIfRequired: true,
    queueOptions: {},
    sameSiteCookie: 'Lax',
    sendAdblockPageOptions: {},
    sessions: {
      autoTrack: true,
      timeout: 1800000,
    },
    storage: {
      cookie: {},
      encryption: {
        version: 'v3',
      },
      migrate: true,
    },
    uaChTrackLevel: 'none',
    useBeacon: false,
    useGlobalIntegrationsConfigInEvents: false,
    useServerSideCookies: false,
  },
  metrics: {
    dropped: 0,
    queued: 0,
    retries: 0,
    sent: 0,
    triggered: 0,
  },
  nativeDestinations: {
    activeDestinations: [],
    clientDestinationsReady: false,
    configuredDestinations: [],
    failedDestinations: [],
    initializedDestinations: [],
    integrationsConfig: {},
    loadIntegration: true,
    loadOnlyIntegrations: {},
  },
  plugins: {
    activePlugins: [],
    failedPlugins: [],
    loadedPlugins: [],
    pluginsToLoadFromConfig: [],
    ready: false,
    totalPluginsToLoad: 0,
  },
  reporting: {
    breadcrumbs: [],
    isErrorReportingEnabled: false,
    isErrorReportingPluginLoaded: false,
    isMetricsReportingEnabled: false,
  },
  serverCookies: {
    isEnabledServerSideCookies: false,
  },
  session: {
    initialReferrer: '',
    initialReferringDomain: '',
    sessionInfo: {},
  },
  source: {
    id: 'dummy-source-id',
    workspaceId: 'dummy-workspace-id',
  },
  storage: {
    entries: {},
    migrate: false,
    trulyAnonymousTracking: false,
  },
};

describe('Bugsnag utilities', () => {
  describe('isApiKeyValid', () => {
    it('should return true for a valid API key', () => {
      const apiKey = '1234567890abcdef';
      expect(isApiKeyValid(apiKey)).toBe(true);
    });

    it('should return false for an invalid API key', () => {
      const apiKey = '{{invalid-api-key}}';
      expect(isApiKeyValid(apiKey)).toBe(false);
    });

    it('should return false for an invalid API key', () => {
      const apiKey = '';
      expect(isApiKeyValid(apiKey)).toBe(false);
    });
  });

  describe('getGlobalBugsnagLibInstance', () => {
    it('should return the global Bugsnag instance if defined on the window object', () => {
      const bsObj = {
        version: '1.2.3',
      };
      (window as any).bugsnag = bsObj;

      expect(getGlobalBugsnagLibInstance()).toBe(bsObj);

      delete (window as any).bugsnag;
    });

    it('should return undefined if the global Bugsnag instance is not defined on the window object', () => {
      expect(getGlobalBugsnagLibInstance()).toBe(undefined);
    });
  });

  describe('getReleaseStage', () => {
    let windowSpy: any;
    let locationSpy: any;

    beforeEach(() => {
      windowSpy = jest.spyOn(window, 'window', 'get');
      locationSpy = jest.spyOn(globalThis, 'location', 'get');
    });

    afterEach(() => {
      windowSpy.mockRestore();
      locationSpy.mockRestore();
    });

    const testCaseData = [
      ['localhost', 'development'],
      ['127.0.0.1', 'development'],
      ['www.test-host.com', 'development'],
      ['[::1]', 'development'],
      ['', '__RS_BUGSNAG_RELEASE_STAGE__'],
      ['www.validhost.com', '__RS_BUGSNAG_RELEASE_STAGE__'],
    ];

    it.each(testCaseData)(
      'if window host name is "%s" then it should return the release stage as "%s" ',
      (hostName, expectedReleaseStage) => {
        locationSpy.mockImplementation(() => ({
          hostname: hostName,
        }));

        expect(getReleaseStage()).toBe(expectedReleaseStage);
      },
    );
  });

  describe('isValidVersion', () => {
    it('should return true if bugsnag version 6 is present in window scope', () => {
      (window as any).bugsnag = jest.fn(() => ({ notifier: { version: '6.0.0' } }));

      expect(isValidVersion((window as any).bugsnag)).toBe(true);

      delete (window as any).bugsnag;
    });

    it('should return false if bugsnag version 7 is present in window scope', () => {
      (window as any).bugsnag = { _client: { _notifier: { version: '7.0.0' } } };

      expect(isValidVersion((window as any).bugsnag)).toBe(false);

      delete (window as any).bugsnag;
    });

    it('should return false if bugsnag version 4 is present in window scope', () => {
      (window as any).bugsnag = jest.fn(() => ({ notifier: { version: '4.0.0' } }));

      expect(isValidVersion((window as any).bugsnag)).toBe(false);

      delete (window as any).bugsnag;
    });
  });

  describe('isRudderSDKError', () => {
    const testCaseData: any[][] = [
      ['https://invalid-domain.com/rsa.min.js', true],
      ['https://invalid-domain.com/rss.min.js', false],
      ['https://invalid-domain.com/rsa-plugins-Beacon.min.js', true],
      ['https://invalid-domain.com/Amplitude.min.js', false],
      ['https://invalid-domain.com/js-integrations/Amplitude.min.js', true],
      ['https://invalid-domain.com/js-integrations/Qualaroo.min.js', true],
      ['https://invalid-domain.com/test.js', false],
      ['https://invalid-domain.com/rsa.css', false],
      [undefined, false],
      [null, false],
      [1, false],
      ['', false],
      ['asdf.com', false],
    ];

    it.each(testCaseData)(
      'if script src is "%s" then it should return the value as "%s" ',
      (scriptSrc: any, expectedValue: boolean) => {
        // Bugsnag error event object structure
        const event = {
          stacktrace: [
            {
              file: scriptSrc,
            },
          ],
        } as unknown as BugsnagLib.Report;

        expect(isRudderSDKError(event)).toBe(expectedValue);
      },
    );
  });

  describe('enhanceErrorEventMutator', () => {
    it('should return the enhanced error event object', () => {
      const event = {
        metaData: {},
        stacktrace: [
          {
            file: 'https://invalid-domain.com/rsa.min.js',
          },
        ],
        updateMetaData(key: string, value: any) {
          // @ts-expect-error ignore for testing
          this.metaData[key] = value;
        },
        errorMessage: 'test error message',
      } as unknown as BugsnagLib.Report;

      enhanceErrorEventMutator(state, event);

      expect(event.metaData).toEqual({
        source: {
          snippetVersion: '3.0.0',
        },
        state: DEFAULT_STATE_DATA,
      });

      expect(event.context).toBe('test error message');
      expect(event.severity).toBe('error');
    });

    it('should return the enhanced error event object if the error is for script loads', () => {
      const event = {
        metaData: {},
        stacktrace: [
          {
            file: 'https://invalid-domain.com/rsa.min.js',
          },
        ],
        updateMetaData(key: string, value: any) {
          // @ts-expect-error ignore for testing
          this.metaData[key] = value;
        },
        errorMessage: 'error in script loading "https://invalid-domain.com/rsa.min.js"',
      } as unknown as BugsnagLib.Report;

      enhanceErrorEventMutator(state, event);

      expect(event.metaData).toEqual({
        source: {
          snippetVersion: '3.0.0',
        },
        state: DEFAULT_STATE_DATA,
      });

      expect(event.context).toBe('Script load failures');
      expect(event.severity).toBe('error');
    });
  });

  describe('initBugsnagClient', () => {
    const mountBugsnagSDK = () => {
      (window as any).bugsnag = jest.fn(() => ({ notifier: { version: '6.0.0' } }));
    };

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(0);
    });

    afterEach(() => {
      delete (window as any).bugsnag;
      resetState();

      jest.useRealTimers();
    });

    it('should resolve the promise immediately if the bugsnag SDK is already loaded', async () => {
      mountBugsnagSDK();

      const bsClient = await new Promise((resolve, reject) => {
        initBugsnagClient(state, resolve, reject);
      });

      expect(bsClient).toBeDefined();
    });

    it('should resolve the promise after some time when the bugsnag SDK is loaded', async () => {
      const bsClientPromise: Promise<BugsnagLib.Client> = new Promise((resolve, reject) => {
        initBugsnagClient(state, resolve, reject);
      });

      state.session.sessionInfo.value = { id: 123 };
      state.autoTrack.pageLifecycle.visitId.value = 'test-visit-id';

      // Advance time and mount the Bugsnag SDK
      jest.advanceTimersByTime(1);
      mountBugsnagSDK();

      // Run all timers to trigger the promise resolution
      jest.runAllTimers();

      const bsClient: BugsnagLib.Client = await bsClientPromise;

      expect(bsClient).toBeDefined(); // returns a mocked Bugsnag client

      // First call is the version check
      expect((window as any).bugsnag).toHaveBeenCalledTimes(2);
      expect((window as any).bugsnag).toHaveBeenNthCalledWith(2, {
        apiKey: '__RS_BUGSNAG_API_KEY__',
        appVersion: 'dev-snapshot',
        metaData: {
          SDK: {
            name: 'JS',
            installType: 'cdn',
          },
        },
        autoCaptureSessions: false,
        collectUserIp: false,
        maxEvents: 100,
        maxBreadcrumbs: 40,
        releaseStage: 'development',
        user: {
          id: 'dummy-source-id..123..test-visit-id',
        },
        networkBreadcrumbsEnabled: false,
        beforeSend: expect.any(Function),
        logger: undefined,
      });
    });

    it('should return bugsnag client with write key as user id if source id is not available', async () => {
      // @ts-expect-error source id is not defined for the test case
      state.source.value = { id: undefined };
      state.lifecycle.writeKey = signal('dummy-write-key');
      state.session.sessionInfo.value = { id: 123 };
      state.autoTrack.pageLifecycle.visitId.value = 'test-visit-id';

      const bsClientPromise: Promise<BugsnagLib.Client> = new Promise((resolve, reject) => {
        initBugsnagClient(state, resolve, reject);
      });

      // Advance time and mount the Bugsnag SDK
      jest.advanceTimersByTime(1);
      mountBugsnagSDK();

      // Run all timers to trigger the promise resolution
      jest.runAllTimers();

      await bsClientPromise;

      // First call is the version check
      expect((window as any).bugsnag).toHaveBeenCalledTimes(2);
      expect((window as any).bugsnag).toHaveBeenNthCalledWith(2, {
        apiKey: '__RS_BUGSNAG_API_KEY__',
        appVersion: 'dev-snapshot',
        metaData: {
          SDK: {
            name: 'JS',
            installType: 'cdn',
          },
        },
        autoCaptureSessions: false,
        collectUserIp: false,
        maxEvents: 100,
        maxBreadcrumbs: 40,
        releaseStage: 'development',
        user: {
          id: 'dummy-write-key..123..test-visit-id',
        },
        networkBreadcrumbsEnabled: false,
        beforeSend: expect.any(Function),
        logger: undefined,
      });
    });

    it('should reject the promise if the Bugsnag SDK is not loaded', async () => {
      const bsClientPromise = new Promise((resolve, reject) => {
        initBugsnagClient(state, resolve, reject);
      });

      // Advance time to trigger timeout
      jest.advanceTimersByTime(10000); // 10 seconds

      await expect(bsClientPromise).rejects.toThrow(
        'A timeout 10000 ms occurred while trying to load the Bugsnag SDK.',
      );
    });
  });

  describe('loadBugsnagSDK', () => {
    let insertBeforeSpy: any;

    const extSrcLoader = new ExternalSrcLoader(defaultErrorHandler, defaultLogger);

    beforeAll(() => {
      server.listen();
    });

    afterAll(() => {
      server.close();
    });

    beforeEach(() => {
      insertBeforeSpy = jest.spyOn(document.head, 'insertBefore');

      jest.useFakeTimers();
      jest.setSystemTime(0);
    });

    afterEach(() => {
      insertBeforeSpy.mockRestore();
      if (document.head.firstChild) {
        document.head.removeChild(document.head.firstChild as ChildNode);
      }
      delete (window as any).Bugsnag;
      delete (window as any).bugsnag;

      jest.useRealTimers();
    });

    it('should not load Bugsnag SDK if it (<=v6) is already loaded', () => {
      (window as any).bugsnag = jest.fn(() => ({ notifier: { version: '6.0.0' } }));

      loadBugsnagSDK(extSrcLoader, defaultLogger);

      expect(insertBeforeSpy).not.toHaveBeenCalled();
    });

    it('should not load Bugsnag SDK if it (>v6) is already loaded', () => {
      (window as any).Bugsnag = { _client: { _notifier: { version: '7.0.0' } } };

      loadBugsnagSDK(extSrcLoader, defaultLogger);

      expect(insertBeforeSpy).not.toHaveBeenCalled();
    });

    it('should attempt to load Bugsnag SDK if not already loaded', () => {
      loadBugsnagSDK(extSrcLoader);

      // Run all timers to trigger the script load
      jest.runAllTimers();

      expect(insertBeforeSpy).toHaveBeenCalled();
    });

    it('should invoke error handler and log error if Bugsnag SDK could not be loaded', done => {
      loadBugsnagSDK(extSrcLoader, defaultLogger);

      // Advance the timer to trigger the script load and result in error
      jest.advanceTimersByTimeAsync(1).then(() => {
        expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
          new Error(
            `Failed to load the script with the id "rs-bugsnag" from URL "__RS_BUGSNAG_SDK_URL__".`,
          ),
          'ExternalSrcLoader',
        );
        expect(defaultLogger.error).toHaveBeenCalledWith(
          `BugsnagPlugin:: Failed to load the Bugsnag SDK.`,
        );
        done();
      });
    });
  });

  describe('onError', () => {
    it('should return a function', () => {
      expect(typeof onError(state)).toBe('function');
    });

    it('should return a function that returns false if the error is not from RudderStack SDK', () => {
      const error = {
        stacktrace: [
          {
            file: 'https://invalid-domain.com/not-rsa.min.js',
          },
        ],
      } as unknown as BugsnagLib.Report;

      const onErrorFn = onError(state);

      expect(onErrorFn(error)).toBe(false);
    });

    it('should return a function that returns true and enhances the error event if the error is from RudderStack SDK', () => {
      const error = {
        stacktrace: [
          {
            file: 'https://invalid-domain.com/rsa.min.js',
          },
        ],
        errorMessage: 'error in script loading "https://invalid-domain.com/rsa.min.js"',
        updateMetaData: jest.fn(),
      } as any;

      const onErrorFn = onError(state);

      expect(onErrorFn(error)).toBe(true);
      expect(error.updateMetaData).toHaveBeenCalledTimes(2);
      expect(error.updateMetaData).toHaveBeenNthCalledWith(1, 'source', {
        snippetVersion: '3.0.0',
      });
      expect(error.updateMetaData).toHaveBeenNthCalledWith(2, 'state', DEFAULT_STATE_DATA);
      expect(error.severity).toBe('error');
      expect(error.context).toBe('Script load failures');
    });

    it('should return a function that returns false if processing the event results in any unhandled exception', () => {
      // Not defining `updateMetaData` on the error object to simulate an unhandled exception
      const error = {
        stacktrace: [
          {
            file: 'https://invalid-domain.com/rsa.min.js',
          },
        ],
        errorMessage: 'error in script loading "https://invalid-domain.com/rsa.min.js"',
      } as any;

      const onErrorFn = onError(state);

      expect(onErrorFn(error)).toBe(false);
    });

    it('should log error and return false if the error could not be filtered', () => {
      const error = {
        stacktrace: [
          {
            file: 'https://invalid-domain.com/rsa.min.js',
          },
        ],
        errorMessage: 'error in script loading "https://invalid-domain.com/rsa.min.js"',

        // Simulate an unhandled exception
        updateMetaData: jest.fn(() => {
          throw new Error('Failed to update metadata.');
        }),
      } as any;

      const onErrorFn = onError(state, defaultLogger);

      expect(onErrorFn(error)).toBe(false);
      expect(defaultLogger.error).toHaveBeenCalledWith(
        'BugsnagPlugin:: Failed to filter the error.',
      );
    });
  });

  describe('getAppStateForMetadata', () => {
    const origAppStateExcludes = bugsnagConstants.APP_STATE_EXCLUDE_KEYS;

    beforeEach(() => {
      Object.defineProperty(bugsnagConstants, 'APP_STATE_EXCLUDE_KEYS', {
        value: origAppStateExcludes,
        writable: true,
      });
    });

    // Here we are just exploring different combinations of data where
    // the signals could be buried inside objects, arrays, nested objects, etc.
    const tcData: any[][] = [
      [
        {
          name: 'test',
          value: 123,
          someKey1: [1, 2, 3],
          someKey2: {
            key1: 'value1',
            key2: 'value2',
          },
          someKey3: 2.5,
          testSignal: signal('test'),
        },
        {
          name: 'test',
          value: 123,
          someKey1: [1, 2, 3],
          someKey2: {
            key1: 'value1',
            key2: 'value2',
          },
          someKey3: 2.5,
          testSignal: 'test',
        },
        undefined,
      ],
      [
        {
          name: 'test',
          someKey: {
            key1: 'value1',
            key2: signal('value2'),
          },
          someKey2: {
            key1: 'value1',
            key2: {
              key3: signal('value3'),
            },
          },
          someKey3: [signal('value1'), signal('value2'), 1, 3],
          someKey4: [
            {
              key1: signal('value1'),
              key2: signal('value2'),
            },
            'asdf',
            1,
            {
              key3: 'value3',
              key4: 'value4',
            },
          ],
        },
        {
          name: 'test',
          someKey: {
            key1: 'value1',
            key2: 'value2',
          },
          someKey2: {
            key1: 'value1',
            key2: {
              key3: 'value3',
            },
          },
          someKey3: ['value1', 'value2', 1, 3],
          someKey4: [
            {
              key1: 'value1',
              key2: 'value2',
            },
            'asdf',
            1,
            {
              key3: 'value3',
              key4: 'value4',
            },
          ],
        },
        [],
      ],
      [
        {
          someKey: signal({
            key1: 'value1',
            key2: signal('value2'),
            key3: [signal('value1'), signal('value2'), undefined, null],
            key4: true,
            key7: {
              key1: signal('value1'),
              key2: signal('value2'),
              key3: 'asdf',
              key4: signal('value4'),
            },
            key5: signal([signal('value1'), signal('value2'), 1, 3]),
            KEY6: 123,
          }),
        },
        {
          someKey: {
            key1: 'value1',
            key2: 'value2',
            key3: ['value1', 'value2', null, null],
            key7: {
              key1: 'value1',
              key2: 'value2',
              key3: 'asdf',
            },
            key5: ['value1', 'value2', 1, 3],
            KEY6: 123,
          },
        },
        ['key4', 'key6'], // excluded keys
      ],
      [
        {
          // We're intentionally adding BigInt values
          // here to test if they are converted to strings
          // eslint-disable-next-line compat/compat
          someKey: BigInt(123),
        },
        undefined,
        [],
      ],
    ];

    it.each(tcData)('should convert signals to JSON %#', (input, expected, excludes) => {
      Object.defineProperty(bugsnagConstants, 'APP_STATE_EXCLUDE_KEYS', {
        value: excludes,
        writable: true,
      });

      expect(getAppStateForMetadata(input)).toEqual(expected);
    });
  });
});
