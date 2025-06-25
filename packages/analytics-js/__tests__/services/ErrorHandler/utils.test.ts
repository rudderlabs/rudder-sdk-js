/* eslint-disable compat/compat */
/* eslint-disable max-classes-per-file */
import { signal } from '@preact/signals-core';
import { defaultHttpClient } from '@rudderstack/analytics-js-common/__mocks__/HttpClient';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
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
  checkIfAllowedToBeNotified,
  isSDKError,
  getErrorGroupingHash,
  checkIfAdBlockersAreActive,
} from '../../../src/services/ErrorHandler/utils';

jest.mock('@rudderstack/analytics-js-common/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

describe('Error Reporting utilities', () => {
  beforeEach(() => {
    resetState();

    state.lifecycle.sourceConfigUrl.value = 'https://api.rudderstack.com/sourceConfig';
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
    it('should return development for test environment', () => {
      // The current test environment uses www.test-host.com which is in DEV_HOSTS
      // so getReleaseStage should return 'development'
      expect(getReleaseStage()).toBe('development');
    });

    const testCaseData = [
      ['localhost', 'development'],
      ['127.0.0.1', 'development'],
      ['www.test-host.com', 'development'],
      ['[::1]', 'development'],
      ['', 'development'], // for file:// protocol
      ['www.validhost.com', '__RS_BUGSNAG_RELEASE_STAGE__'],
      ['example.com', '__RS_BUGSNAG_RELEASE_STAGE__'],
      ['production.myapp.com', '__RS_BUGSNAG_RELEASE_STAGE__'],
      [undefined, 'development'],
      [null, 'development'],
    ] as const;

    it.each(testCaseData)(
      'if hostname is "%s" then it should return the release stage as "%s"',
      (hostname, expectedReleaseStage) => {
        // @ts-expect-error - hostname is not typed
        const actualReleaseStage = getReleaseStage(() => hostname);
        expect(actualReleaseStage).toBe(expectedReleaseStage);
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
      state.autoTrack.pageLifecycle.pageViewId.value = 'test-view-id';
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
                  pageViewId: 'test-view-id',
                },
              },
              capabilities: {
                cspBlockedURLs: [],
                isAdBlockerDetectionInProgress: false,
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
                sourceConfigUrl: 'https://api.rudderstack.com/sourceConfig',
              },
              loadOptions: {
                beaconQueueOptions: {},
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
                secureCookie: false,
                sameDomainCookiesOnly: false,
                sendAdblockPage: false,
                sessions: {
                  autoTrack: true,
                  timeout: 1800000,
                  cutOff: {
                    enabled: false,
                  },
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
              id: 'dummy-source-id..123..test-view-id',
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

  describe('checkIfAllowedToBeNotified', () => {
    beforeEach(() => {
      defaultHttpClient.getAsyncData.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ url, options, isRawResponse, callback }) => {
          setTimeout(() => {
            callback(null, {
              xhr: {
                responseURL: url,
              },
            });
          }, 10);
        },
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const testCases = [
      ['The request failed', false, 'should not allow request failures'],
      [
        'DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "Amplitude" - A script with the id "Amplitude___1234" is already loaded. Skipping the loading of this script to prevent conflicts',
        false,
        'should not allow already loaded script failures',
      ],
      [
        'PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: https://cdn.non-rudderstack.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js',
        false,
        'should not allow plugins load failures from non-RudderStack CDN',
      ],
      [
        'DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "Amplitude" - Unable to load (error) the script with the id "Amplitude___1234" from URL "https://cdn.non-rudderstack.com/3.20.1/modern/js-integrations/Amplitude.min.js"',
        false,
        'should not allow integrations load failures from non-RudderStack CDN',
      ],
      [
        'DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "Amplitude" - A timeout of 10000 ms occurred while trying to load the script with id "Amplitude___1234" from URL "https://cdn.non-rudderstack.com/3.20.1/modern/js-integrations/Amplitude.min.js"',
        false,
        'should not allow integrations load failures from non-RudderStack CDN',
      ],

      [
        'PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js',
        true,
        'should allow plugins load failures from RudderStack CDN',
      ],
      [
        'DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "Amplitude" - Unable to load (error) the script with the id "Amplitude___1234" from URL "https://cdn.rudderlabs.com/3.20.1/modern/js-integrations/Amplitude.min.js"',
        true,
        'should allow integrations load failures from RudderStack CDN',
      ],
      [
        'DeviceModeDestinationsPlugin:: Failed to load integration SDK for destination "Amplitude" - A timeout of 10000 ms occurred while trying to load the script with id "Amplitude___1234" from URL "https://cdn.rudderlabs.com/3.20.1/modern/js-integrations/Amplitude.min.js"',
        true,
        'should allow integrations load failures from RudderStack CDN',
      ],

      ['dummy error', true, 'should allow generic errors'],
      ['', true, 'should allow empty messages'],
    ];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test.each(testCases)('%s -> %s (%s)', async (message, expected, testName) => {
      const result = await checkIfAllowedToBeNotified(
        { message } as unknown as Exception,
        state,
        defaultHttpClient,
      );
      expect(result).toBe(expected);
    });

    describe('CSP blocked URLs filtering', () => {
      beforeEach(() => {
        // Mock successful HTTP request (no ad blocker)
        defaultHttpClient.getAsyncData.mockImplementationOnce(({ callback }) => {
          callback(null, {
            xhr: {
              responseURL: 'https://api.rudderstack.com/sourceConfig?view=ad',
            },
          });
        });
      });

      it('should not notify if the script URL is blocked by CSP', async () => {
        const blockedUrl =
          'https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';

        // Add URL to CSP blocked list
        state.capabilities.cspBlockedURLs.value = [blockedUrl];

        const message = `PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: ${blockedUrl}`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(false);
      });

      it('should notify if the script URL is not in CSP blocked list', async () => {
        const scriptUrl =
          'https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';
        const differentBlockedUrl =
          'https://cdn.rudderlabs.com/3.20.1/modern/plugins/different-plugin.min.js';

        // Add different URL to CSP blocked list
        state.capabilities.cspBlockedURLs.value = [differentBlockedUrl];

        const message = `PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: ${scriptUrl}`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(true);
      });

      it('should handle messages without extractable URLs', async () => {
        state.capabilities.cspBlockedURLs.value = ['https://cdn.rudderlabs.com/some-url.js'];

        const message =
          'PluginsManager:: Failed to load plugin - Failed to fetch dynamically imported module: invalid-url';

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(true);
      });

      it('should handle empty CSP blocked URLs list', async () => {
        state.capabilities.cspBlockedURLs.value = [];

        const message =
          'PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(true);
      });

      it('should handle CSP blocked URL and continue to ad blocker check when URL is not CSP blocked', async () => {
        const scriptUrl =
          'https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';
        const differentBlockedUrl =
          'https://cdn.rudderlabs.com/3.20.1/modern/plugins/different-plugin.min.js';

        // Set different URL as CSP blocked, so our script URL should proceed to ad blocker check
        state.capabilities.cspBlockedURLs.value = [differentBlockedUrl];
        state.capabilities.isAdBlocked.value = false; // Mock ad blocker not detected

        const message = `PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: ${scriptUrl}`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(true); // Should proceed to ad blocker check and return true since no ad blocker
      });

      it('should properly handle the logic flow when CSP check passes but ad blocker check fails', async () => {
        const scriptUrl =
          'https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';

        // Empty CSP blocked list, but ad blocker detected
        state.capabilities.cspBlockedURLs.value = [];
        state.capabilities.isAdBlocked.value = true;

        const message = `PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: ${scriptUrl}`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(false);
      });

      it('should not notify for non-RudderStack CDN URLs even if not CSP blocked', async () => {
        const nonRSUrl = 'https://cdn.example.com/3.20.1/modern/plugins/plugin.min.js';

        // Empty CSP blocked list
        state.capabilities.cspBlockedURLs.value = [];

        const message = `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${nonRSUrl}`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(false); // Should not notify for non-RS CDN URLs
      });
    });

    describe('Ad blocker detection integration', () => {
      beforeEach(() => {
        // Reset ad blocker state
        state.capabilities.isAdBlocked.value = undefined;
        state.capabilities.isAdBlockerDetectionInProgress.value = false;
      });

      it('should not notify if ad blocker is detected for RS CDN URLs', async () => {
        // Mock ad blocker detected
        state.capabilities.isAdBlocked.value = true;

        const message =
          'PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(false);
      });

      it('should notify if ad blocker is not detected for RS CDN URLs', async () => {
        // Mock no ad blocker detected
        state.capabilities.isAdBlocked.value = false;

        const message =
          'PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(true);
      });

      it('should trigger ad blocker detection if not done previously (adblockers are not detected)', async () => {
        // Mock ad blocker detection not done yet
        state.capabilities.isAdBlocked.value = undefined;
        state.capabilities.isAdBlockerDetectionInProgress.value = false;

        const message =
          'PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(true);
      });

      it('should trigger ad blocker detection if not done previously (adblockers are detected)', async () => {
        // Mock ad blocker detection not done yet
        state.capabilities.isAdBlocked.value = undefined;
        state.capabilities.isAdBlockerDetectionInProgress.value = false;

        // Mock HTTP client for ad blocker detection
        defaultHttpClient.getAsyncData.mockClear();
        defaultHttpClient.getAsyncData.mockReset();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultHttpClient.getAsyncData.mockImplementation(({ callback, ...rest }) => {
          // Simulate ad blocker detection request
          setTimeout(() => {
            callback(null, {
              error: new Error('Request blocked'),
            });
          }, 10);
        });

        const message =
          'PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';

        // The detectAdBlockers function will run and set isAdBlocked.value based on the mock
        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(false); // Should not notify because ad blocker detected
        expect(state.capabilities.isAdBlocked.value).toBe(true); // Verify ad blocker was detected
      });

      it('should not trigger duplicate ad blocker detection if already in progress', async () => {
        // Mock ad blocker detection already in progress
        state.capabilities.isAdBlocked.value = undefined;
        state.capabilities.isAdBlockerDetectionInProgress.value = true;

        const message =
          'PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';

        // Start the checkIfAllowedToBeNotified function
        const resultPromise = checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        // Use a Promise with immediate resolution to ensure effect is set up first
        await new Promise(resolve => setTimeout(resolve, 0));

        // Complete the ad blocker detection with no ad blocker detected
        state.capabilities.isAdBlocked.value = false; // No ad blocker detected

        const result = await resultPromise;

        expect(result).toBe(true); // Should notify because no ad blocker detected
      });

      it('should handle complete workflow for RudderStack CDN URLs with proper validation', async () => {
        const rsUrl = 'https://cdn.rudderlabs.com/v3/modern/plugins/test-plugin.min.js';

        // Setup: URL not CSP blocked, no ad blocker detected
        state.capabilities.cspBlockedURLs.value = [
          'https://cdn.rudderlabs.com/different-plugin.min.js',
        ]; // Different URL
        state.capabilities.isAdBlocked.value = false;
        state.capabilities.isAdBlockerDetectionInProgress.value = false;

        const message = `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${rsUrl}`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        // Should pass all checks:
        // 1. Is script load failure message ✓
        // 2. URL extracted successfully ✓
        // 3. Is RudderStack CDN URL ✓
        // 4. Not in CSP blocked list ✓
        // 5. Ad blocker not detected ✓
        expect(result).toBe(true);
      });
    });

    describe('Combined CSP and ad blocker filtering', () => {
      it('should not notify if URL is CSP blocked, regardless of ad blocker status', async () => {
        const blockedUrl =
          'https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';

        // Set CSP blocked and no ad blocker
        state.capabilities.cspBlockedURLs.value = [blockedUrl];
        state.capabilities.isAdBlocked.value = false;

        const message = `PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: ${blockedUrl}`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(false);
      });

      it('should check ad blocker only if URL is not CSP blocked', async () => {
        const scriptUrl =
          'https://cdn.rudderlabs.com/3.20.1/modern/plugins/rsa-plugins-remote-NativeDestinationQueue.min.js';
        const differentBlockedUrl =
          'https://cdn.rudderlabs.com/3.20.1/modern/plugins/different-plugin.min.js';

        // Set different URL as CSP blocked, and mock ad blocker detected
        state.capabilities.cspBlockedURLs.value = [differentBlockedUrl];
        state.capabilities.isAdBlocked.value = true;

        const message = `PluginsManager:: Failed to load plugin "NativeDestinationQueue" - Failed to fetch dynamically imported module: ${scriptUrl}`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(false); // Should not notify due to ad blocker
      });
    });

    describe('URL extraction logic', () => {
      it('should extract HTTPS URLs correctly', async () => {
        const extractedUrl = 'https://cdn.rudderlabs.com/v3/modern/plugins/test.min.js';
        state.capabilities.cspBlockedURLs.value = [extractedUrl];

        const message = `Error: Failed to load - ${extractedUrl} - additional text`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(true); // Should proceed since error message doesn't match script failure patterns
      });

      it('should extract HTTP URLs correctly', async () => {
        const extractedUrl = 'http://cdn.rudderlabs.com/v3/modern/plugins/test.min.js';
        state.capabilities.cspBlockedURLs.value = [extractedUrl];

        const message = `Error: Failed to load - ${extractedUrl} - additional text`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(true); // Should proceed since error message doesn't match script failure patterns
      });

      it('should handle multiple URLs in message and extract the first one', async () => {
        const firstUrl = 'https://cdn.rudderlabs.com/v3/modern/plugins/first.min.js';
        const secondUrl = 'https://cdn.rudderlabs.com/v3/modern/plugins/second.min.js';
        state.capabilities.cspBlockedURLs.value = [firstUrl];

        const message = `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${firstUrl} and also ${secondUrl}`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(false); // Should not notify because URL is CSP blocked
      });

      it('should handle URLs with query parameters and fragments', async () => {
        const extractedUrl =
          'https://cdn.rudderlabs.com/v3/modern/plugins/test.min.js?version=1.0&cache=false#section';
        state.capabilities.cspBlockedURLs.value = [extractedUrl];

        const message = `Error: Failed to load - ${extractedUrl} - additional text`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(true); // Should proceed since error message doesn't match script failure patterns
      });

      it('should handle null/undefined URL extraction results', async () => {
        state.capabilities.cspBlockedURLs.value = [];

        // Message that won't match the URL extraction regex
        const message =
          'PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: not-a-url';

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(true); // Should allow notification when no valid URL extracted
      });

      it('should validate extracted URL is a string before processing', async () => {
        state.capabilities.cspBlockedURLs.value = ['https://cdn.rudderlabs.com/test.js'];

        // Message that produces a non-string match result
        const message =
          'PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ';

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        expect(result).toBe(true); // Should allow notification when URL extraction fails validation
      });

      it('should differentiate RudderStack CDN vs non-RudderStack CDN URLs', async () => {
        const rsUrl = 'https://cdn.rudderlabs.com/v3/modern/plugins/test.min.js';
        const nonRsUrl = 'https://cdn.example.com/v3/modern/plugins/test.min.js';

        // Test RudderStack CDN URL (should proceed to CSP/ad blocker checks)
        state.capabilities.cspBlockedURLs.value = [];
        state.capabilities.isAdBlocked.value = false;

        const rsMessage = `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${rsUrl}`;
        const rsResult = await checkIfAllowedToBeNotified(
          { message: rsMessage } as unknown as Exception,
          state,
          defaultHttpClient,
        );
        expect(rsResult).toBe(true); // Should proceed through checks and allow since no blocks

        // Test non-RudderStack CDN URL (should be filtered out immediately)
        const nonRsMessage = `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${nonRsUrl}`;
        const nonRsResult = await checkIfAllowedToBeNotified(
          { message: nonRsMessage } as unknown as Exception,
          state,
          defaultHttpClient,
        );
        expect(nonRsResult).toBe(false); // Should be filtered out immediately
      });

      it('should extract URLs without trailing punctuation', async () => {
        const baseUrl = 'https://cdn.rudderlabs.com/v3/modern/plugins/test.min.js';
        state.capabilities.cspBlockedURLs.value = [baseUrl];
        state.capabilities.isAdBlocked.value = false;

        // Test various trailing punctuation scenarios
        const testCases = [
          {
            description: 'URL with trailing quote',
            message: `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${baseUrl}"`,
            expectedExtracted: baseUrl,
          },
          {
            description: 'URL with trailing semicolon',
            message: `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${baseUrl};`,
            expectedExtracted: baseUrl,
          },
          {
            description: 'URL with trailing comma',
            message: `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${baseUrl}, additional text`,
            expectedExtracted: baseUrl,
          },
          {
            description: 'URL with trailing single quote',
            message: `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${baseUrl}'`,
            expectedExtracted: baseUrl,
          },
          {
            description: 'URL with trailing parenthesis',
            message: `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${baseUrl})`,
            expectedExtracted: baseUrl,
          },
          {
            description: 'URL with trailing angle bracket',
            message: `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${baseUrl}>`,
            expectedExtracted: baseUrl,
          },
          {
            description: 'URL with trailing square bracket',
            message: `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${baseUrl}]`,
            expectedExtracted: baseUrl,
          },
          {
            description: 'URL with trailing curly brace',
            message: `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${baseUrl}}`,
            expectedExtracted: baseUrl,
          },
        ];

        for (const testCase of testCases) {
          const result = await checkIfAllowedToBeNotified(
            { message: testCase.message } as unknown as Exception,
            state,
            defaultHttpClient,
          );

          // Since the URL matches the CSP blocked list (exact match), it should not notify
          expect(result).toBe(false);
        }
      });

      it('should extract URLs correctly without being affected by multiple trailing punctuation marks', async () => {
        const baseUrl = 'https://cdn.rudderlabs.com/v3/modern/plugins/test.min.js';
        state.capabilities.cspBlockedURLs.value = [baseUrl];

        const message = `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${baseUrl}"';,)>]}`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        // Should extract clean URL and match CSP blocked list
        expect(result).toBe(false);
      });

      it('should preserve valid URL characters that are not trailing punctuation', async () => {
        const urlWithValidChars =
          'https://cdn.rudderlabs.com/v3/modern/plugins/test-plugin_v1.2.3.min.js';
        state.capabilities.cspBlockedURLs.value = [urlWithValidChars];

        const message = `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${urlWithValidChars}`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        // Should extract URL with valid characters intact and match CSP blocked list
        expect(result).toBe(false);
      });

      it('should handle URLs with query parameters followed by trailing punctuation', async () => {
        const baseUrl =
          'https://cdn.rudderlabs.com/v3/modern/plugins/test.min.js?version=1.0&cache=false';
        state.capabilities.cspBlockedURLs.value = [baseUrl];

        const message = `PluginsManager:: Failed to load plugin "Test" - Failed to fetch dynamically imported module: ${baseUrl}";`;

        const result = await checkIfAllowedToBeNotified(
          { message } as unknown as Exception,
          state,
          defaultHttpClient,
        );

        // Should extract clean URL with query params and match CSP blocked list
        expect(result).toBe(false);
      });
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
      state.autoTrack.pageLifecycle.pageViewId.value = 'test-view-id';

      const userDetails = getUserDetails(
        state.source,
        state.session,
        state.lifecycle,
        state.autoTrack,
      );
      expect(userDetails).toEqual({
        id: 'dummy-source-id..123..test-view-id',
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

  describe('getErrorGroupingHash', () => {
    const getState = (installType = 'cdn') =>
      ({
        context: {
          app: { value: { installType } },
        },
      }) as any;

    it('should return undefined if installType is not cdn', () => {
      const result = getErrorGroupingHash(
        'some-hash',
        'default-hash',
        getState('npm'),
        defaultLogger,
      );
      expect(result).toBeUndefined();
    });

    it('should return undefined if installType is not cdn (testing with different install types)', () => {
      const installTypes = ['npm', 'module', 'bower'];
      installTypes.forEach(installType => {
        const result = getErrorGroupingHash(
          'some-hash',
          'default-hash',
          getState(installType),
          defaultLogger,
        );
        expect(result).toBeUndefined();
      });
    });

    it('should return groupingHash if it is a non-empty string', () => {
      const result = getErrorGroupingHash(
        'some-hash',
        'default-hash',
        getState('cdn'),
        defaultLogger,
      );
      expect(result).toBe('some-hash');
    });

    it('should return non-empty string groupingHash as-is for any string value', () => {
      // Testing different string values to ensure they're returned as-is
      const testStrings = ['custom-error-hash', 'not an error object', 'any string value'];

      testStrings.forEach(testString => {
        const result = getErrorGroupingHash(
          testString,
          'default-hash',
          getState('cdn'),
          defaultLogger,
        );
        expect(result).toBe(testString);
      });
    });

    it('should return defaultGroupingHash if groupingHash is undefined', () => {
      const result = getErrorGroupingHash(
        undefined,
        'default-hash',
        getState('cdn'),
        defaultLogger,
      );
      expect(result).toBe('default-hash');
    });

    it('should return error.message if groupingHash is an Error object', () => {
      const error = new Error('error-message');
      const result = getErrorGroupingHash(error, 'default-hash', getState('cdn'), defaultLogger);
      expect(result).toBe('error-message');
    });

    it('should return defaultGroupingHash if groupingHash is an object that is not an Error', () => {
      const notError = { foo: 'bar' };
      const result = getErrorGroupingHash(notError, 'default-hash', getState('cdn'), defaultLogger);
      expect(result).toBe('default-hash');
    });

    it('should return defaultGroupingHash when normalizeError returns undefined for invalid error objects', () => {
      // Test case where normalizeError function returns undefined (when the error is not valid)
      // Non-string inputs that are not valid Error objects should cause normalizeError to return undefined
      const invalidError = { not: 'an error object' };
      const result = getErrorGroupingHash(
        invalidError,
        'default-hash',
        getState('cdn'),
        defaultLogger,
      );
      expect(result).toBe('default-hash');
    });

    it('should return defaultGroupingHash when normalizeError returns undefined for null values', () => {
      // Test case for null input
      const result = getErrorGroupingHash(null, 'default-hash', getState('cdn'), defaultLogger);
      expect(result).toBe('default-hash');
    });

    it('should return defaultGroupingHash when normalizeError returns undefined for other non-error types', () => {
      // Test various non-error types that would cause normalizeError to return undefined
      const nonErrorTypes = [123, true, [], {}, Symbol('test')];

      nonErrorTypes.forEach(invalidType => {
        const result = getErrorGroupingHash(
          invalidType,
          'default-hash',
          getState('cdn'),
          defaultLogger,
        );
        expect(result).toBe('default-hash');
      });
    });

    it('should handle Error objects without stack trace properly', () => {
      // Test case for Error object that might not have a proper stacktrace
      const errorWithoutStack = new Error('error without stack');
      errorWithoutStack.stack = undefined;

      const result = getErrorGroupingHash(
        errorWithoutStack,
        'default-hash',
        getState('cdn'),
        defaultLogger,
      );
      // This should return default hash since normalizeError will return undefined for errors without stack
      expect(result).toBe('default-hash');
    });

    it('should handle edge case with empty string vs undefined for non-CDN installs', () => {
      // Test to ensure that even for non-CDN installs, function returns undefined consistently
      const result1 = getErrorGroupingHash(
        undefined,
        'default-hash',
        getState('npm'),
        defaultLogger,
      );
      const result2 = getErrorGroupingHash('', 'default-hash', getState('npm'), defaultLogger);
      const result3 = getErrorGroupingHash(
        'some-hash',
        'default-hash',
        getState('npm'),
        defaultLogger,
      );

      expect(result1).toBeUndefined();
      expect(result2).toBeUndefined();
      expect(result3).toBeUndefined();
    });
  });

  describe('checkIfAdBlockersAreActive', () => {
    beforeEach(() => {
      // Reset ad blocker state
      state.capabilities.isAdBlocked.value = undefined;
      state.capabilities.isAdBlockerDetectionInProgress.value = false;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should immediately resolve with true when ad blocker is not detected', () => {
      state.capabilities.isAdBlocked.value = false;
      const mockResolve = jest.fn();

      checkIfAdBlockersAreActive(state, defaultHttpClient, mockResolve);

      expect(mockResolve).toHaveBeenCalledWith(true);
    });

    it('should immediately resolve with false when ad blocker is detected', () => {
      state.capabilities.isAdBlocked.value = true;
      const mockResolve = jest.fn();

      checkIfAdBlockersAreActive(state, defaultHttpClient, mockResolve);

      expect(mockResolve).toHaveBeenCalledWith(false);
    });

    it('should set up effect listener when ad blocker status is undefined and not in progress', () => {
      state.capabilities.isAdBlocked.value = undefined;
      state.capabilities.isAdBlockerDetectionInProgress.value = false;
      const mockResolve = jest.fn();

      checkIfAdBlockersAreActive(state, defaultHttpClient, mockResolve);

      // Should not resolve immediately but wait for effect
      expect(mockResolve).not.toHaveBeenCalled();
    });

    it('should not trigger duplicate detection when already in progress', () => {
      state.capabilities.isAdBlocked.value = undefined;
      state.capabilities.isAdBlockerDetectionInProgress.value = true;
      const mockResolve = jest.fn();

      checkIfAdBlockersAreActive(state, defaultHttpClient, mockResolve);

      // Should not resolve immediately but wait for effect
      expect(mockResolve).not.toHaveBeenCalled();
    });

    it('should resolve when detection completes via effect', async () => {
      state.capabilities.isAdBlocked.value = undefined;
      state.capabilities.isAdBlockerDetectionInProgress.value = false;
      const mockResolve = jest.fn();

      checkIfAdBlockersAreActive(state, defaultHttpClient, mockResolve);

      // Simulate detection completion
      state.capabilities.isAdBlocked.value = false;

      // Wait for effect to trigger
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockResolve).toHaveBeenCalledWith(true);
    });
  });
});
