/* eslint-disable compat/compat */
/* eslint-disable max-classes-per-file */
import { signal } from '@preact/signals-core';
import type { ErrorEventPayload, Exception } from '@rudderstack/analytics-js-common/types/Metrics';
import type { Event } from '@bugsnag/js';
import { state, resetState } from '../../../src/state';
import * as errorReportingConstants from '../../../src/services/ErrorHandler/constants';
import {
  createNewBreadcrumb,
  getAppStateForMetadata,
  getBugsnagErrorEvent,
  getDeviceDetails,
  getErrInstance,
  getErrorDeliveryPayload,
  getReleaseStage,
  getURLWithoutQueryString,
  getUserDetails,
  isAllowedToBeNotified,
  isSDKError,
} from '../../../src/services/ErrorHandler/utils';

jest.mock('@rudderstack/analytics-js-common/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

describe('Error Reporting utilities', () => {
  beforeEach(() => {
    resetState();
  });

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
      ['https://invalid-domain.com/rsa-plugins-StorageMigrator.min.js', true],
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
      'if file path is "%s" then it should return the value as "%s" ',
      (filePath: string, expectedValue: boolean) => {
        // Bugsnag error event object structure
        const event = {
          stacktrace: [
            {
              file: filePath,
            },
          ],
        };

        expect(isSDKError(event as unknown as Exception)).toBe(expectedValue);
      },
    );

    // Test when stacktrace is empty array
    const exception = {
      stacktrace: [],
    };

    expect(isSDKError(exception as unknown as Exception)).toBe(false);
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
    it('should return the error event payload', () => {
      state.session.sessionInfo.value = { id: 123 };
      // @ts-expect-error setting the value for testing
      state.context.app.value.installType = 'cdn';
      state.autoTrack.pageLifecycle.visitId.value = 'test-visit-id';
      // @ts-expect-error setting the value for testing
      state.context.library.value.snippetVersion = 'sample_snippet_version';
      state.context.locale.value = 'en-US';
      state.context.userAgent.value =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
      state.source.value = {
        id: 'dummy-source-id',
        name: 'dummy-source-name',
        workspaceId: 'dummy-workspace-id',
      };
      state.reporting.breadcrumbs.value = [
        {
          metaData: {},
          name: 'sample breadcrumb message',
          timestamp: new Date(),
          type: 'manual',
        },
        {
          metaData: {},
          name: 'sample breadcrumb message 2',
          timestamp: new Date(),
          type: 'manual',
        },
      ];

      state.context.screen.value = {
        density: 1,
        width: 2,
        height: 3,
        innerWidth: 4,
        innerHeight: 5,
      };

      const errorState = {
        severity: 'error' as Event['severity'],
        unhandled: false,
        severityReason: { type: 'handledException' },
      };

      const exception = {
        errorClass: 'Error',
        message: 'dummy message',
        type: 'browserjs',
        stacktrace: [
          {
            file: 'https://example.com/sample.js',
            method: 'Object.<anonymous>',
            lineNumber: 1,
            columnNumber: 1,
          },
        ],
      };

      const bsErrorEvent = getBugsnagErrorEvent(exception, errorState, state);

      const expectedOutcome = {
        payloadVersion: '5',
        notifier: {
          name: 'RudderStack JavaScript SDK',
          version: '__PACKAGE_VERSION__',
          url: '__REPOSITORY_URL__',
        },
        events: [
          {
            exceptions: [
              {
                errorClass: 'Error',
                message: 'dummy message',
                type: 'browserjs',
                stacktrace: [
                  {
                    file: 'https://example.com/sample.js',
                    method: 'Object.<anonymous>',
                    lineNumber: 1,
                    columnNumber: 1,
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
              version: '__PACKAGE_VERSION__',
              releaseStage: 'development',
              type: 'cdn',
            },
            device: {
              locale: 'en-US',
              userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
              time: expect.any(Date),
            },
            request: {
              url: 'https://www.test-host.com/',
              clientIp: '[NOT COLLECTED]',
            },
            breadcrumbs: [
              {
                metaData: {},
                name: 'sample breadcrumb message',
                timestamp: expect.any(Date),
                type: 'manual',
              },
              {
                metaData: {},
                name: 'sample breadcrumb message 2',
                timestamp: expect.any(Date),
                type: 'manual',
              },
            ],
            context: 'dummy message',
            metaData: {
              app: {
                snippetVersion: 'sample_snippet_version',
              },
              device: {
                density: 1,
                width: 2,
                height: 3,
                innerWidth: 4,
                innerHeight: 5,
              },
              autoTrack: {
                enabled: false,
                pageLifecycle: {
                  enabled: false,
                  visitId: 'test-visit-id',
                },
              },
              capabilities: {
                isAdBlocked: false,
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
                  version: '__PACKAGE_VERSION__',
                },
                device: null,
                library: {
                  name: 'RudderLabs JavaScript SDK',
                  snippetVersion: 'sample_snippet_version',
                  version: '__PACKAGE_VERSION__',
                },
                locale: 'en-US',
                network: null,
                os: {
                  name: '',
                  version: '',
                },
                screen: {
                  density: 1,
                  height: 3,
                  innerHeight: 5,
                  innerWidth: 4,
                  width: 2,
                },
                userAgent:
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
              },
              dataPlaneEvents: {
                deliveryEnabled: true,
              },
              lifecycle: {
                initialized: false,
                integrationsCDNPath: 'https://cdn.rudderlabs.com/v3/modern/js-integrations',
                pluginsCDNPath: 'https://cdn.rudderlabs.com/v3/modern/plugins',
                loaded: false,
                logLevel: 'ERROR',
                readyCallbacks: [],
              },
              loadOptions: {
                bufferDataPlaneEventsUntilReady: false,
                configUrl: 'https://api.rudderstack.com',
                dataPlaneEventsBufferTimeout: 10000,
                destinationsQueueOptions: {},
                integrations: {
                  All: true,
                },
                loadIntegration: true,
                lockIntegrationsVersion: false,
                lockPluginsVersion: false,
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
                breadcrumbs: [
                  {
                    metaData: {},
                    name: 'sample breadcrumb message',
                    timestamp: expect.any(String),
                    type: 'manual',
                  },
                  {
                    metaData: {},
                    name: 'sample breadcrumb message 2',
                    timestamp: expect.any(String),
                    type: 'manual',
                  },
                ],
                isErrorReportingEnabled: false,
                isMetricsReportingEnabled: false,
              },
              serverCookies: {
                isEnabledServerSideCookies: false,
              },
              session: {
                initialReferrer: '',
                initialReferringDomain: '',
                sessionInfo: {
                  id: 123,
                },
              },
              source: {
                id: 'dummy-source-id',
                name: 'dummy-source-name',
                workspaceId: 'dummy-workspace-id',
              },
              storage: {
                entries: {},
                migrate: false,
                trulyAnonymousTracking: false,
              },
            },
            user: {
              id: 'dummy-source-id..123..test-visit-id',
              name: 'dummy-source-name',
            },
          },
        ],
      };

      expect(bsErrorEvent).toEqual(expectedOutcome);
    });
  });

  describe('getErrorDeliveryPayload', () => {
    it('should return error delivery payload', () => {
      const errorEventPayload = {} as unknown as ErrorEventPayload;

      const deliveryPayload = getErrorDeliveryPayload(errorEventPayload, state);
      expect(deliveryPayload).toEqual(
        JSON.stringify({
          version: '1',
          message_id: 'test_uuid',
          source: {
            name: 'js',
            sdk_version: '__PACKAGE_VERSION__',
            install_type: '__MODULE_TYPE__',
          },
          errors: errorEventPayload,
        }),
      );
    });
  });

  describe('isAllowedToBeNotified', () => {
    const testCases = [
      ['dummy error', true, 'should allow generic errors'],
      ['The request failed', false, 'should not allow request failures'],
      ['', true, 'should allow empty messages'],
      ['Network request failed', true, 'should allow network errors'],
    ];

    test.each(testCases)('%s -> %s (%s)', (message, expected, testName) => {
      const result = isAllowedToBeNotified({ message } as unknown as Exception);
      expect(result).toBe(expected);
    });
  });

  describe('getErrInstance', () => {
    it('should return the same error instance for handled errors', () => {
      const error = new Error('dummy error');
      const errorType = 'handledException';
      const result = getErrInstance(error, errorType);
      expect(result).toEqual(error);
    });

    it('should return the internal error instance for unhandled errors', () => {
      const errorEvent = new ErrorEvent('error', { error: new Error('dummy error') });
      const errorType = 'unhandledException';
      const result = getErrInstance(errorEvent, errorType);
      expect(result).toEqual(errorEvent.error);
    });

    it('should return the same error event instance if the internal error is not present', () => {
      const errorEvent = new ErrorEvent('error');
      const errorType = 'unhandledException';
      const result = getErrInstance(errorEvent, errorType);
      expect(result).toEqual(errorEvent);
    });

    it('should return the internal reason instance for unhandled promise rejections', () => {
      const errorEvent = new PromiseRejectionEvent('error', {
        reason: new Error('dummy error'),
        promise: Promise.resolve(),
      });
      const errorType = 'unhandledPromiseRejection';
      const result = getErrInstance(errorEvent, errorType);
      expect(result).toEqual(errorEvent.reason);
    });
  });

  describe('getUserDetails', () => {
    it('should return user details for the given source, session, lifecycle, and autoTrack', () => {
      state.source.value = {
        id: 'dummy-source-id',
        name: 'dummy-source-name',
        workspaceId: 'dummy-workspace-id',
      };
      state.session.sessionInfo.value = { id: 123 };
      state.autoTrack.pageLifecycle.visitId.value = 'test-visit-id';

      const userDetails = getUserDetails(
        state.source,
        state.session,
        state.lifecycle,
        state.autoTrack,
      );
      expect(userDetails).toEqual({
        id: 'dummy-source-id..123..test-visit-id',
        name: 'dummy-source-name',
      });
    });

    it('should use fallback values if the required values are not present', () => {
      state.lifecycle.writeKey.value = 'dummy-write-key';

      const userDetails = getUserDetails(
        state.source,
        state.session,
        state.lifecycle,
        state.autoTrack,
      );
      expect(userDetails).toEqual({
        id: 'dummy-write-key..NA..NA',
        name: 'NA',
      });
    });
  });

  describe('getDeviceDetails', () => {
    it('should return device details for the given locale and userAgent', () => {
      state.context.locale.value = 'en-US';
      state.context.userAgent.value =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';

      const deviceDetails = getDeviceDetails(state.context.locale, state.context.userAgent);
      expect(deviceDetails).toEqual({
        locale: 'en-US',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        time: expect.any(Date),
      });
    });

    it('should use fallback values if the required values are not present', () => {
      const deviceDetails = getDeviceDetails(state.context.locale, state.context.userAgent);
      expect(deviceDetails).toEqual({
        locale: 'NA',
        userAgent: 'NA',
        time: expect.any(Date),
      });
    });
  });
});
