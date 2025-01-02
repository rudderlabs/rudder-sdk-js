/* eslint-disable max-classes-per-file */
import { signal } from '@preact/signals-core';
import type { ErrorEventPayload, Exception } from '@rudderstack/analytics-js-common/types/Metrics';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { state } from '../../../src/state';
import * as errorReportingConstants from '../../../src/services/ErrorHandler/constants';
import {
  createNewBreadcrumb,
  getAppStateForMetadata,
  getBugsnagErrorEvent,
  getErrorDeliveryPayload,
  getReleaseStage,
  getURLWithoutQueryString,
  isAllowedToBeNotified,
  isSDKError,
} from '../../../src/services/ErrorHandler/utils';

jest.mock('@rudderstack/analytics-js-common/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

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
      installType: '__MODULE_TYPE__',
      name: 'RudderLabs JavaScript SDK',
      namespace: 'com.rudderlabs.javascript',
      version: '__PACKAGE_VERSION__',
    },
    device: null,
    library: {
      name: 'RudderLabs JavaScript SDK',
      version: '__PACKAGE_VERSION__',
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

describe('Error Reporting utilities', () => {
  describe('createNewBreadcrumb', () => {
    it('should create and return a breadcrumb', () => {
      const msg = 'sample message';
      const breadcrumb = createNewBreadcrumb(msg);

      expect(breadcrumb).toStrictEqual({
        metaData: {},
        type: 'manual',
        timestamp: expect.any(Date),
        name: msg,
      });
    });

    it('should create and return a breadcrumb with empty meta data if not provided', () => {
      const msg = 'sample message';
      const breadcrumb = createNewBreadcrumb(msg);

      expect(breadcrumb.metaData).toStrictEqual({});
    });
  });

  describe('getURLWithoutQueryString', () => {
    it('should return url without query param ', () => {
      (window as any).location.href = 'https://www.test-host.com?key1=1234&key2=true';
      const urlWithoutSearchParam = getURLWithoutQueryString();
      expect(urlWithoutSearchParam).toEqual('https://www.test-host.com/');
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

  describe('isSDKError', () => {
    const testCaseData: any[] = [
      ['https://invalid-domain.com/rsa.min.js', true],
      ['https://invalid-domain.com/rss.min.js', false],
      ['https://invalid-domain.com/rsa-plugins-Beacon.min.js', true],
      ['https://invalid-domain.com/Amplitude.min.js', false],
      ['https://invalid-domain.com/js-integrations/Amplitude.min.js', true],
      ['https://invalid-domain.com/js-integrations/Qualaroo.min.js', true],
      ['https://invalid-domain.com/mjs-integrations/Qualaroo.min.js', false],
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
      (scriptSrc: string, expectedValue: boolean) => {
        // Bugsnag error event object structure
        const event = {
          stacktrace: [
            {
              file: scriptSrc,
            },
          ],
        };

        expect(isSDKError(event)).toBe(expectedValue);
      },
    );
  });

  describe('getAppStateForMetadata', () => {
    const origAppStateExcludes = errorReportingConstants.APP_STATE_EXCLUDE_KEYS;

    afterEach(() => {
      Object.defineProperty(errorReportingConstants, 'APP_STATE_EXCLUDE_KEYS', {
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
          // eslint-disable-next-line compat/compat
          someKey: BigInt(123),
        },
        {},
        [],
      ],
    ];

    it.each(tcData)('should convert signals to JSON %#', (input, expected, excludes) => {
      Object.defineProperty(errorReportingConstants, 'APP_STATE_EXCLUDE_KEYS', {
        value: excludes,
        writable: true,
      });

      expect(getAppStateForMetadata(input)).toEqual(expected);
    });
  });

  describe('getBugsnagErrorEvent', () => {
    it.skip('should return enhanced error event payload', () => {
      state.session.sessionInfo.value = { id: 123 };
      state.autoTrack.pageLifecycle.visitId.value = 'test-visit-id';

      const newError = new Error();
      const normalizedError = Object.create(newError, {
        message: { value: 'ReferenceError: testUndefinedFn is not defined' },
        stack: {
          value: `ReferenceError: testUndefinedFn is not defined at Analytics.page (http://localhost:3001/cdn/modern/iife/rsa.js:1610:3) at RudderAnalytics.page (http://localhost:3001/cdn/modern/iife/rsa.js:1666:84)`,
        },
      });
      const errorState = {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      };
      const errorPayload = ErrorFormat.create(normalizedError, 'notify()') as ErrorFormat;

      (window as any).RudderSnippetVersion = 'sample_snippet_version';
      const enhancedError = getBugsnagErrorEvent(errorPayload, errorState, state);
      const expectedOutcome = {
        notifier: {
          name: 'RudderStack JavaScript SDK Error Notifier',
          version: 'dev-snapshot',
          url: 'https://github.com/rudderlabs/rudder-sdk-js',
        },
        events: [
          {
            payloadVersion: '5',
            exceptions: [
              {
                errorClass: 'Error',
                message: 'ReferenceError: testUndefinedFn is not defined',
                type: 'browserjs',
                stacktrace: [
                  {
                    file: 'ReferenceError: testUndefinedFn is not defined at Analytics.page http://localhost:3001/cdn/modern/iife/rsa.js:1610:3 at RudderAnalytics.page http://localhost:3001/cdn/modern/iife/rsa.js',
                    lineNumber: 1666,
                    columnNumber: 84,
                    code: undefined,
                    inProject: undefined,
                    method: undefined,
                  },
                ],
              },
            ],
            severity: 'error',
            unhandled: false,
            severityReason: {
              type: 'handledException',
            },
            app: {
              version: 'dev-snapshot',
              releaseStage: 'development',
            },
            device: {
              userAgent: '',
              time: expect.any(Date),
            },
            request: {
              url: 'https://www.test-host.com/',
              clientIp: '[NOT COLLECTED]',
            },
            breadcrumbs: [],
            context: 'ReferenceError: testUndefinedFn is not defined',
            metaData: {
              sdk: {
                name: 'JS',
                installType: 'cdn',
              },
              state: mergeDeepRight(DEFAULT_STATE_DATA, {
                autoTrack: {
                  pageLifecycle: {
                    visitId: 'test-visit-id',
                  },
                },
                session: {
                  sessionInfo: { id: 123 },
                },
              }),
              source: {
                snippetVersion: 'sample_snippet_version',
              },
            },
            user: {
              id: 'dummy-source-id..123..test-visit-id',
            },
          },
        ],
      };
      expect(enhancedError).toEqual(expectedOutcome);
    });
  });

  describe('getErrorDeliveryPayload', () => {
    it('should return error delivery payload', () => {
      const enhancedErrorPayload = {
        notifier: {
          name: 'Rudderstack JavaScript SDK Error Notifier',
          version: 'sample_version',
          url: 'https://github.com/rudderlabs/rudder-sdk-js',
        },
        events: [
          {
            payloadVersion: '5',
            exceptions: [
              {
                errorClass: 'Error',
                errorMessage: 'ReferenceError: testUndefinedFn is not defined',
                type: 'browserjs',
                stacktrace: [
                  {
                    file: 'ReferenceError: testUndefinedFn is not defined at Analytics.page http://localhost:3001/cdn/modern/iife/rsa.js:1610:3 at RudderAnalytics.page http://localhost:3001/cdn/modern/iife/rsa.js',
                    lineNumber: 1666,
                    columnNumber: 84,
                    code: undefined,
                    inProject: undefined,
                    method: undefined,
                  },
                ],
              },
            ],
            severity: 'error',
            unhandled: false,
            severityReason: {
              type: 'handledException',
            },
            app: {
              version: 'dev-snapshot',
              releaseStage: 'development',
            },
            device: {
              userAgent: '',
              time: expect.any(Date),
            },
            request: {
              url: 'https://www.test-host.com/',
              clientIp: '[NOT COLLECTED]',
            },
            breadcrumbs: [],
            context: 'ReferenceError: testUndefinedFn is not defined',
            metaData: {
              sdk: {
                name: 'JS',
                installType: 'cdn',
              },
              state: DEFAULT_STATE_DATA,
              source: {
                snippetVersion: 'sample_snippet_version',
              },
            },
            user: {
              id: 'sample-write-key',
            },
          },
        ],
      } as unknown as ErrorEventPayload;

      const deliveryPayload = getErrorDeliveryPayload(enhancedErrorPayload, state);
      expect(deliveryPayload).toEqual(
        JSON.stringify({
          version: '1',
          message_id: 'test_uuid',
          source: {
            name: 'js',
            sdk_version: '__PACKAGE_VERSION__',
            install_type: '__MODULE_TYPE__',
          },
          errors: enhancedErrorPayload,
        }),
      );
    });
  });

  describe('isAllowedToBeNotified', () => {
    it('should return true if the error is allowed to be notified', () => {
      const result = isAllowedToBeNotified({ message: 'dummy error' } as unknown as Exception);
      expect(result).toBeTruthy();
    });

    it('should return false if the error is not allowed to be notified', () => {
      const result = isAllowedToBeNotified({
        message: 'The request failed',
      } as unknown as Exception);
      expect(result).toBeFalsy();
    });
  });
});
