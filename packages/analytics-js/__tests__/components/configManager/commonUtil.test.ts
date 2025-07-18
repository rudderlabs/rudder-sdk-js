import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type {
  SourceConfigResponse,
  ConfigResponseDestinationItem,
} from '../../../src/components/configManager/types';
import {
  getSDKUrl,
  updateReportingState,
  updateStorageStateFromLoadOptions,
  updateConsentsStateFromLoadOptions,
  updateConsentsState,
  updateDataPlaneEventsStateFromLoadOptions,
  getSourceConfigURL,
  getDestinationsFromConfig,
} from '../../../src/components/configManager/util/commonUtil';
import {
  getDataServiceUrl,
  isWebpageTopLevelDomain,
} from '../../../src/components/configManager/util/validate';
import { state, resetState } from '../../../src/state';

jest.mock('../../../src/components/configManager/util/validate');

const createScriptElement = (url: string, writeKey?: string) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.id = 'SOME_ID';
  if (writeKey) {
    script.setAttribute('data-rsa-write-key', writeKey);
  }
  document.head.appendChild(script);
};

const removeScriptElement = () => {
  const scriptElem = document.getElementById('SOME_ID');
  scriptElem?.remove();
};

describe('Config Manager Common Utilities', () => {
  const mockLogger = {
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as ILogger;

  let originalGetDataServiceUrl: (endpoint: string, useExactDomain: boolean) => string;
  let isWebpageTopLevelDomainOriginal: (domain: string) => boolean;

  beforeAll(() => {
    // Save the original implementation
    originalGetDataServiceUrl = jest.requireActual(
      '../../../src/components/configManager/util/validate',
    ).getDataServiceUrl;
    isWebpageTopLevelDomainOriginal = jest.requireActual(
      '../../../src/components/configManager/util/validate',
    ).isWebpageTopLevelDomain;
  });

  beforeEach(() => {
    resetState();
    state.lifecycle.writeKey.value = 'writeKey';
    (getDataServiceUrl as jest.Mock).mockRestore();
  });

  describe('getSDKUrl', () => {
    afterEach(() => {
      removeScriptElement();
    });

    const testCases: any[][] = [
      // expected, input
      [
        'https://www.dummy.url/fromScript/v3/rsa.min.js',
        ['https://www.dummy.url/fromScript/v3/rsa.min.js'],
      ],
      [undefined, ['https://www.dummy.url/fromScript/v3/other.min.js']],
      [
        'https://www.dummy.url/fromScript/v3/rsa.js',
        ['https://www.dummy.url/fromScript/v3/rsa.js'],
      ],
      [undefined, ['https://www.dummy.url/fromScript/v3/rudder.min.js']],
      [undefined, ['https://www.dummy.url/fromScript/v3/analytics.min.js']],
      [undefined, ['https://www.dummy.url/fromScript/v3/rsa.min']],
      [undefined, ['https://www.dummy.url/fromScript/v3/rsa']],
      [undefined, ['https://www.dummy.url/fromScript/v3rsa.min.js']],
      ['/rsa.min.js', ['/rsa.min.js']],
      ['/rsa.js', ['/rsa.js']],
      [undefined, ['https://www.dummy.url/fromScript/v3/rs.min.js']],
      [
        'https://www.dummy.url/fromScript/v3/rs.min.js',
        ['https://www.dummy.url/fromScript/v3/rs.min.js', 'writeKey'],
      ],
      [undefined, ['https://www.dummy.url/fromScript/v3/rs.min.js', 'writeKey-1']],
      [undefined, ['https://www.dummy.url/fromScript/v3/rsamin.js']],
      ['rsa.min.js', ['rsa.min.js']],
      ['rsa.js', ['rsa.js']],
      [undefined, ['https://www.dummy.url/fromScript/v3/rsa.min.jsx']],
      [undefined, [null]],
    ];

    test.each(testCases)(
      'should return %s when the script src is %s',
      (expected: any, input: any) => {
        createScriptElement((input as any[])[0], (input as any[])[1]);

        const sdkURL = getSDKUrl();
        expect(sdkURL).toBe(expected);
      },
    );
  });

  describe('updateReportingState', () => {
    it('should update reporting state with the data from source config', () => {
      const mockSourceConfig = {
        source: {
          config: {
            statsCollection: {
              errors: {
                enabled: true,
              },
              metrics: {
                enabled: true,
              },
            },
          },
        },
      } as SourceConfigResponse;

      updateReportingState(mockSourceConfig);

      expect(state.reporting.isErrorReportingEnabled.value).toBe(true);
      expect(state.reporting.isMetricsReportingEnabled.value).toBe(true);
    });

    it('should update reporting state with the data from source config even if error reporting provider is not specified', () => {
      const mockSourceConfig = {
        source: {
          config: {
            statsCollection: {
              errors: {
                enabled: true,
              },
              metrics: {
                enabled: true,
              },
            },
          },
        },
      } as SourceConfigResponse;

      updateReportingState(mockSourceConfig);

      expect(state.reporting.isErrorReportingEnabled.value).toBe(true);
      expect(state.reporting.isMetricsReportingEnabled.value).toBe(true);
    });
  });

  describe('updateStorageStateFromLoadOptions', () => {
    it('should update storage state with the data from load options', () => {
      state.loadOptions.value.storage = {
        encryption: {
          version: 'v3',
        },
        migrate: true,
        cookie: {
          domain: 'rudderstack.com',
        },
      };

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.storage.encryptionPluginName.value).toBe('StorageEncryption');
      expect(state.storage.migrate.value).toBe(true);
      expect(state.storage.cookie.value).toStrictEqual({ domain: 'rudderstack.com' });
    });

    it('should update storage state with the data even if encryption version is not specified', () => {
      state.loadOptions.value.storage = {};

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.storage.encryptionPluginName.value).toBe('StorageEncryption');
    });

    it('should log a warning if the specified storage type is not valid', () => {
      state.loadOptions.value.storage = {
        // @ts-expect-error testing invalid value
        type: 'random-type',
      };

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.storage.type.value).toBe('cookieStorage');
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The storage type "random-type" is not supported. Please choose one of the following supported types: "localStorage,memoryStorage,cookieStorage,sessionStorage,none". The default type "cookieStorage" will be used instead.',
      );
    });

    it('should log a warning if the encryption version is not supported', () => {
      state.loadOptions.value.storage = {
        encryption: {
          // @ts-expect-error testing invalid value
          version: 'v2',
        },
      };

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.storage.encryptionPluginName.value).toBe('StorageEncryption');
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The storage encryption version "v2" is not supported. Please choose one of the following supported versions: "v3,legacy". The default version "v3" will be used instead.',
      );
    });

    it('should update the storage state from load options for legacy encryption version', () => {
      state.loadOptions.value.storage = {
        encryption: {
          version: 'legacy',
        },
      };

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.storage.encryptionPluginName.value).toBe('StorageEncryptionLegacy');
    });

    it('should set the migration to false if the encryption version is not latest even if migrate is set to true', () => {
      state.loadOptions.value.storage = {
        encryption: {
          version: 'legacy',
        },
        migrate: true,
      };

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.storage.migrate.value).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The storage data migration has been disabled because the configured storage encryption version (legacy) is not the latest (v3). To enable storage data migration, please update the storage encryption version to the latest version.',
      );
    });

    it('should not change the value of isEnabledServerSideCookies if the useServerSideCookies is set to false', () => {
      state.loadOptions.value.useServerSideCookies = false;
      state.loadOptions.value.storage = {
        cookie: {
          samesite: 'secure',
        },
      };

      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.serverCookies.isEnabledServerSideCookies.value).toBe(false);
      expect(state.storage.cookie.value).toEqual({
        samesite: 'secure',
      });
    });

    it('should set the value of isEnabledServerSideCookies to false if the useServerSideCookies is set to true but the dataServiceUrl is not valid url', () => {
      state.loadOptions.value.useServerSideCookies = true;
      (getDataServiceUrl as jest.Mock).mockImplementation(() => 'invalid-url');
      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.serverCookies.isEnabledServerSideCookies.value).toBe(false);
    });

    it('should set the value of isEnabledServerSideCookies to true if the useServerSideCookies is set to true and the dataServiceUrl is a valid url', () => {
      state.loadOptions.value.useServerSideCookies = true;
      (getDataServiceUrl as jest.Mock).mockImplementation(() => 'https://www.dummy.url');
      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.serverCookies.isEnabledServerSideCookies.value).toBe(true);
      expect(state.serverCookies.dataServiceUrl.value).toBe('https://www.dummy.url');
    });

    it('should determine the dataServiceUrl from the exact domain if sameDomainCookiesOnly load option is set to true', () => {
      state.loadOptions.value.useServerSideCookies = true;
      state.loadOptions.value.sameDomainCookiesOnly = true;

      (getDataServiceUrl as jest.Mock).mockImplementation(originalGetDataServiceUrl);
      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.serverCookies.isEnabledServerSideCookies.value).toBe(true);
      expect(state.serverCookies.dataServiceUrl.value).toBe('https://www.test-host.com/rsaRequest');
    });

    it('should determine the dataServiceUrl from the exact domain if setCookieDomain load option is provided', () => {
      state.loadOptions.value.useServerSideCookies = true;
      state.loadOptions.value.setCookieDomain = 'www.test-host.com';

      (getDataServiceUrl as jest.Mock).mockImplementation(originalGetDataServiceUrl);
      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.serverCookies.isEnabledServerSideCookies.value).toBe(true);
      expect(state.serverCookies.dataServiceUrl.value).toBe('https://www.test-host.com/rsaRequest');
    });

    it('should set isEnabledServerSideCookies to true if provided setCookieDomain load option is top-level domain and sameDomainCookiesOnly option is not set', () => {
      state.loadOptions.value.useServerSideCookies = true;
      state.loadOptions.value.setCookieDomain = 'test-host.com';

      (isWebpageTopLevelDomain as jest.Mock).mockImplementation(isWebpageTopLevelDomainOriginal);
      (getDataServiceUrl as jest.Mock).mockImplementation(originalGetDataServiceUrl);
      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.serverCookies.isEnabledServerSideCookies.value).toBe(true);
      expect(state.serverCookies.dataServiceUrl.value).toBe('https://test-host.com/rsaRequest');
    });

    it('should set isEnabledServerSideCookies to false if provided setCookieDomain load option is different from current domain and sameDomainCookiesOnly option is not set', () => {
      state.loadOptions.value.useServerSideCookies = true;
      state.loadOptions.value.setCookieDomain = 'random-host.com';

      (isWebpageTopLevelDomain as jest.Mock).mockImplementation(isWebpageTopLevelDomainOriginal);
      (getDataServiceUrl as jest.Mock).mockImplementation(originalGetDataServiceUrl);
      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.serverCookies.isEnabledServerSideCookies.value).toBe(false);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        "ConfigManager:: The provided cookie domain (random-host.com) does not match the current webpage's domain (www.test-host.com). Hence, the cookies will be set client-side.",
      );
    });

    it('should set isEnabledServerSideCookies to true if provided setCookieDomain load option is different from current domain and sameDomainCookiesOnly option is set', () => {
      state.loadOptions.value.useServerSideCookies = true;
      state.loadOptions.value.setCookieDomain = 'test-host.com';
      state.loadOptions.value.sameDomainCookiesOnly = true;

      (getDataServiceUrl as jest.Mock).mockImplementation(originalGetDataServiceUrl);
      updateStorageStateFromLoadOptions(mockLogger);

      expect(state.serverCookies.isEnabledServerSideCookies.value).toBe(true);
    });
  });

  describe('updateConsentsStateFromLoadOptions', () => {
    it('should update consents state with the data from load options', () => {
      state.loadOptions.value.consentManagement = {
        enabled: true,
        provider: 'oneTrust',
      };

      state.loadOptions.value.preConsent = {
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      };

      updateConsentsStateFromLoadOptions(mockLogger);

      expect(state.consents.activeConsentManagerPluginName.value).toBe('OneTrustConsentManager');
      expect(state.consents.preConsent.value).toStrictEqual({
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      });
      expect(state.consents.initialized.value).toBe(false);
      expect(state.consents.data.value).toStrictEqual({
        allowedConsentIds: [],
        deniedConsentIds: [],
      });
    });

    it('should log an error if the specified consent manager is not supported', () => {
      state.loadOptions.value.consentManagement = {
        enabled: true,
        // @ts-expect-error testing invalid value
        provider: 'randomManager',
      };

      updateConsentsStateFromLoadOptions(mockLogger);

      expect(state.consents.activeConsentManagerPluginName.value).toBe(undefined);
      expect(mockLogger.error).toHaveBeenCalledWith(
        'ConfigManager:: The consent manager "randomManager" is not supported. Please choose one of the following supported consent managers: "iubenda,oneTrust,ketch,custom".',
      );
    });

    it('should log a warning if the specified storage strategy is not supported', () => {
      state.loadOptions.value.consentManagement = {
        enabled: true,
        provider: 'oneTrust',
      };

      state.loadOptions.value.preConsent = {
        enabled: true,
        storage: {
          // @ts-expect-error testing invalid value
          strategy: 'random-strategy',
        },
        events: {
          delivery: 'immediate',
        },
      };

      updateConsentsStateFromLoadOptions(mockLogger);

      expect(state.consents.preConsent.value).toStrictEqual({
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The pre-consent storage strategy "random-strategy" is not supported. Please choose one of the following supported strategies: "none, session, anonymousId". The default strategy "none" will be used instead.',
      );
    });

    it('should log a warning if the specified events delivery type is not supported', () => {
      state.loadOptions.value.consentManagement = {
        enabled: true,
        provider: 'oneTrust',
      };

      state.loadOptions.value.preConsent = {
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          // @ts-expect-error testing invalid value
          delivery: 'random-delivery',
        },
      };

      updateConsentsStateFromLoadOptions(mockLogger);

      expect(state.consents.preConsent.value).toStrictEqual({
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      });
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The pre-consent events delivery type "random-delivery" is not supported. Please choose one of the following supported types: "immediate, buffer". The default type "immediate" will be used instead.',
      );
    });

    it('should set pre-consent enabled status to false if the consents data is already provided for custom CMP', () => {
      state.loadOptions.value.preConsent = {
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      };

      state.loadOptions.value.consentManagement = {
        enabled: true,
        provider: 'custom',
        allowedConsentIds: ['consent1'],
        deniedConsentIds: ['consent2'],
      };

      updateConsentsStateFromLoadOptions(mockLogger);

      expect(state.consents.preConsent.value).toStrictEqual({
        enabled: false,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      });
    });

    it('should set pre-consent enabled status to false if the consent management itself is disabled', () => {
      state.loadOptions.value.preConsent = {
        enabled: true,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      };

      state.loadOptions.value.consentManagement = {
        enabled: false,
      };

      updateConsentsStateFromLoadOptions(mockLogger);

      expect(state.consents.preConsent.value).toStrictEqual({
        enabled: false,
        storage: {
          strategy: 'none',
        },
        events: {
          delivery: 'immediate',
        },
      });
    });
  });

  describe('updateConsentsState', () => {
    it('should update the consent management state with the data from the source config response', () => {
      state.consents.provider.value = 'ketch';
      const mockSourceConfig = {
        consentManagementMetadata: {
          providers: [
            {
              provider: 'oneTrust',
              resolutionStrategy: 'and',
            },
            {
              provider: 'ketch',
              resolutionStrategy: 'or',
            },
          ],
        },
      } as SourceConfigResponse;

      updateConsentsState(mockSourceConfig);

      expect(state.consents.metadata.value).toStrictEqual(
        mockSourceConfig.consentManagementMetadata,
      );
      expect(state.consents.resolutionStrategy.value).toBe('or');
    });

    it('should set the resolution strategy as undefined if the provider is set to "custom"', () => {
      state.consents.provider.value = 'custom';
      const mockSourceConfig = {
        consentManagementMetadata: {
          providers: [
            {
              provider: 'oneTrust',
              resolutionStrategy: 'and',
            },
            {
              provider: 'ketch',
              resolutionStrategy: 'or',
            },
          ],
        },
      } as SourceConfigResponse;

      updateConsentsState(mockSourceConfig);

      expect(state.consents.metadata.value).toStrictEqual(
        mockSourceConfig.consentManagementMetadata,
      );
      expect(state.consents.resolutionStrategy.value).toBe(undefined);
    });

    it('should not update the metadata and resolution strategy to state if the metadata in source config is not an object literal', () => {
      state.consents.provider.value = 'ketch';
      const mockSourceConfig = {
        consentManagementMetadata: 'random-metadata',
      } as unknown as SourceConfigResponse;

      updateConsentsState(mockSourceConfig);

      expect(state.consents.metadata.value).toBe(undefined);
      expect(state.consents.resolutionStrategy.value).toBe('and'); // default value
    });

    it('should not update the resolution strategy to state if the provider is not set', () => {
      state.consents.provider.value = undefined;
      const mockSourceConfig = {
        consentManagementMetadata: {
          providers: [
            {
              provider: 'oneTrust',
              resolutionStrategy: 'and',
            },
            {
              provider: 'ketch',
              resolutionStrategy: 'or',
            },
          ],
        },
      } as SourceConfigResponse;

      updateConsentsState(mockSourceConfig);

      expect(state.consents.resolutionStrategy.value).toBe('and'); // default value
    });

    it('should not update the resolution strategy to state if the provider is not supported', () => {
      // @ts-expect-error testing invalid value
      state.consents.provider.value = 'random-provider';
      const mockSourceConfig = {
        consentManagementMetadata: {
          providers: [
            {
              provider: 'oneTrust',
              resolutionStrategy: 'and',
            },
            {
              provider: 'ketch',
              resolutionStrategy: 'or',
            },
          ],
        },
      } as SourceConfigResponse;

      updateConsentsState(mockSourceConfig);

      expect(state.consents.resolutionStrategy.value).toBe('and'); // default value
    });
  });

  describe('updateDataPlaneEventsStateFromLoadOptions', () => {
    beforeEach(() => {
      resetState();
    });

    it('should not set the events queue plugin name if events delivery is disabled', () => {
      state.dataPlaneEvents.deliveryEnabled.value = false;

      updateDataPlaneEventsStateFromLoadOptions(mockLogger);

      expect(state.dataPlaneEvents.eventsQueuePluginName.value).toBeUndefined();
    });

    it('should set the events queue plugin name to XhrQueue by default', () => {
      updateDataPlaneEventsStateFromLoadOptions(mockLogger);

      expect(state.dataPlaneEvents.eventsQueuePluginName.value).toMatch('XhrQueue');
    });

    it('should set the events queue plugin name to BeaconQueue if beacon transport is selected', () => {
      state.loadOptions.value.useBeacon = true;

      // Force set the beacon availability
      state.capabilities.isBeaconAvailable.value = true;

      updateDataPlaneEventsStateFromLoadOptions(mockLogger);

      expect(state.dataPlaneEvents.eventsQueuePluginName.value).toMatch('BeaconQueue');
    });

    it('should set the events queue plugin name to XhrQueue if beacon transport is selected but not available', () => {
      state.loadOptions.value.useBeacon = true;

      // Force set the beacon availability to false
      state.capabilities.isBeaconAvailable.value = false;

      updateDataPlaneEventsStateFromLoadOptions(mockLogger);

      expect(state.dataPlaneEvents.eventsQueuePluginName.value).toMatch('XhrQueue');
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The Beacon API is not supported by your browser. The events will be sent using XHR instead.',
      );
    });
  });

  describe('getSourceConfigURL', () => {
    it('should return default source config URL if invalid source config URL is provided', () => {
      const sourceConfigURL = getSourceConfigURL('invalid-url', 'writekey', true, true, mockLogger);

      expect(sourceConfigURL).toBe(
        'https://api.rudderstack.com/sourceConfig/?p=npm&v=0.0.0-test&build=modern&writeKey=writekey&lockIntegrationsVersion=true&lockPluginsVersion=true',
      );

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The provided source config URL "invalid-url" is invalid. Using the default source config URL instead.',
      );
    });

    it('should return the source config URL with default endpoint appended if no endpoint is present', () => {
      const sourceConfigURL = getSourceConfigURL(
        'https://www.dummy.url',
        'writekey',
        false,
        false,
        mockLogger,
      );

      expect(sourceConfigURL).toBe(
        'https://www.dummy.url/sourceConfig/?p=npm&v=0.0.0-test&build=modern&writeKey=writekey&lockIntegrationsVersion=false&lockPluginsVersion=false',
      );
    });

    it('should return the source config URL with default endpoint if a different endpoint is present', () => {
      const sourceConfigURL = getSourceConfigURL(
        'https://www.dummy.url/some/path',
        'writekey',
        false,
        false,
        mockLogger,
      );

      expect(sourceConfigURL).toBe(
        'https://www.dummy.url/some/path/sourceConfig/?p=npm&v=0.0.0-test&build=modern&writeKey=writekey&lockIntegrationsVersion=false&lockPluginsVersion=false',
      );
    });

    it('should return the source config URL as it is if it already has the default endpoint', () => {
      const sourceConfigURL = getSourceConfigURL(
        'https://www.dummy.url/sourceConfig',
        'writekey',
        false,
        false,
        mockLogger,
      );

      expect(sourceConfigURL).toBe(
        'https://www.dummy.url/sourceConfig?p=npm&v=0.0.0-test&build=modern&writeKey=writekey&lockIntegrationsVersion=false&lockPluginsVersion=false',
      );
    });

    it('should return source config URL without duplicate slashes', () => {
      const sourceConfigURL = getSourceConfigURL(
        'https://www.dummy.url//sourceConfig',
        'writekey',
        false,
        false,
        mockLogger,
      );

      expect(sourceConfigURL).toBe(
        'https://www.dummy.url/sourceConfig?p=npm&v=0.0.0-test&build=modern&writeKey=writekey&lockIntegrationsVersion=false&lockPluginsVersion=false',
      );
    });

    it('should return source config URL as it is even if contains query parameters and hash already', () => {
      const sourceConfigURL = getSourceConfigURL(
        'https://www.dummy.url/some/path/?abc=def#blog',
        'writekey',
        false,
        false,
        mockLogger,
      );

      expect(sourceConfigURL).toBe(
        'https://www.dummy.url/some/path/sourceConfig/?abc=def&p=npm&v=0.0.0-test&build=modern&writeKey=writekey&lockIntegrationsVersion=false&lockPluginsVersion=false#blog',
      );
    });
  });
});

describe('getDestinationsFromConfig', () => {
  const sampleDestinationResponse1: ConfigResponseDestinationItem[] = [
    {
      config: {
        measurementId: 'G-SC6JGSYH6H',
        capturePageView: 'rs',
        whitelistedEvents: [
          {
            eventName: '',
          },
        ],
        blacklistedEvents: [
          {
            eventName: '',
          },
        ],
        useNativeSDKToSend: false,
        eventFilteringOption: 'disable',
        extendPageViewParams: false,
        oneTrustCookieCategories: [],
      },
      id: '2LoR1TbVG2bcISXvy7DamldfkgO',
      name: 'GA4 for JS SDK',
      updatedAt: '2023-03-14T11:34:29.216Z',
      enabled: true,
      destinationDefinition: {
        name: 'GA4',
        displayName: 'Google Analytics 4 (GA4)',
        updatedAt: '2023-03-14T11:21:29.656Z',
      },
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
    },
    {
      config: {
        measurementId: 'G-SC6JGSYH6H',
        capturePageView: 'rs',
        whitelistedEvents: [
          {
            eventName: '',
          },
        ],
        blacklistedEvents: [
          {
            eventName: '',
          },
        ],
        useNativeSDKToSend: false,
        eventFilteringOption: 'disable',
        extendPageViewParams: false,
        oneTrustCookieCategories: [],
      },
      id: '2LoR1TbVG2bcISXvy7Damldfkg1',
      name: 'Braze for JS SDK',
      updatedAt: '2023-03-14T11:34:29.216Z',
      enabled: true,
      destinationDefinition: {
        name: 'BRAZE',
        displayName: 'Braze',
        updatedAt: '2023-03-14T11:21:29.656Z',
      },
      shouldApplyDeviceModeTransformation: false,
      propagateEventsUntransformedOnError: false,
    },
  ];

  it('should transform destinations config to Destination format', () => {
    const actualOutcome = getDestinationsFromConfig(sampleDestinationResponse1);

    expect(actualOutcome).toHaveLength(2);
    expect(actualOutcome[0]).toEqual({
      id: '2LoR1TbVG2bcISXvy7DamldfkgO',
      displayName: 'Google Analytics 4 (GA4)',
      enabled: true,
      config: sampleDestinationResponse1[0]!.config,
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      userFriendlyId: 'Google-Analytics-4-(GA4)___2LoR1TbVG2bcISXvy7DamldfkgO',
    });
    expect(actualOutcome[1]).toEqual({
      id: '2LoR1TbVG2bcISXvy7Damldfkg1',
      displayName: 'Braze',
      enabled: true,
      config: sampleDestinationResponse1[1]!.config,
      shouldApplyDeviceModeTransformation: false,
      propagateEventsUntransformedOnError: false,
      userFriendlyId: 'Braze___2LoR1TbVG2bcISXvy7Damldfkg1',
    });
  });

  it('should generate correct userFriendlyId with spaces replaced by hyphens', () => {
    const destinationWithSpaces: ConfigResponseDestinationItem[] = [
      {
        config: {
          measurementId: 'G-SC6JGSYH6H',
          capturePageView: 'rs',
          whitelistedEvents: [],
          blacklistedEvents: [],
          useNativeSDKToSend: false,
          eventFilteringOption: 'disable',
          extendPageViewParams: false,
          oneTrustCookieCategories: [],
        },
        id: 'test-id',
        name: 'Test Destination',
        updatedAt: '2023-03-14T11:34:29.216Z',
        enabled: true,
        destinationDefinition: {
          name: 'TEST',
          displayName: 'Test Destination With Spaces',
          updatedAt: '2023-03-14T11:21:29.656Z',
        },
        shouldApplyDeviceModeTransformation: true,
        propagateEventsUntransformedOnError: false,
      },
    ];

    const actualOutcome = getDestinationsFromConfig(destinationWithSpaces);

    expect(actualOutcome[0]!.userFriendlyId).toBe('Test-Destination-With-Spaces___test-id');
  });

  it('should handle empty destinations array', () => {
    const actualOutcome = getDestinationsFromConfig([]);

    expect(actualOutcome).toEqual([]);
  });

  it('should preserve all config properties', () => {
    const actualOutcome = getDestinationsFromConfig(sampleDestinationResponse1);

    expect(actualOutcome[0]!.config).toEqual(sampleDestinationResponse1[0]!.config);
    expect(actualOutcome[1]!.config).toEqual(sampleDestinationResponse1[1]!.config);
  });

  it('should handle destinations with enabled false', () => {
    const disabledDestination: ConfigResponseDestinationItem[] = [
      {
        config: {
          measurementId: 'G-SC6JGSYH6H',
          capturePageView: 'rs',
          whitelistedEvents: [
            {
              eventName: '',
            },
          ],
          blacklistedEvents: [
            {
              eventName: '',
            },
          ],
          useNativeSDKToSend: false,
          eventFilteringOption: 'disable',
          extendPageViewParams: false,
          oneTrustCookieCategories: [],
        },
        id: 'disabled-id',
        name: 'Disabled Destination',
        updatedAt: '2023-03-14T11:34:29.216Z',
        enabled: false,
        destinationDefinition: {
          name: 'DISABLED',
          displayName: 'Disabled Destination',
          updatedAt: '2023-03-14T11:21:29.656Z',
        },
        shouldApplyDeviceModeTransformation: false,
        propagateEventsUntransformedOnError: false,
      },
    ];

    const actualOutcome = getDestinationsFromConfig(disabledDestination);

    expect(actualOutcome[0]!.enabled).toBe(false);
  });

  it('should default shouldApplyDeviceModeTransformation to false when undefined', () => {
    // Create a destination with undefined shouldApplyDeviceModeTransformation
    // @ts-expect-error - shouldApplyDeviceModeTransformation is intentionally omitted
    const destinationWithUndefinedTransformation = {
      config: {
        measurementId: 'G-SC6JGSYH6H',
        capturePageView: 'rs',
        whitelistedEvents: [
          {
            eventName: '',
          },
        ],
        blacklistedEvents: [
          {
            eventName: '',
          },
        ],
        useNativeSDKToSend: false,
        eventFilteringOption: 'disable',
        extendPageViewParams: false,
        oneTrustCookieCategories: [],
      },
      id: 'test-id',
      name: 'Test Destination',
      updatedAt: '2023-03-14T11:34:29.216Z',
      enabled: true,
      destinationDefinition: {
        name: 'TEST',
        displayName: 'Test Destination',
        updatedAt: '2023-03-14T11:21:29.656Z',
      },
      propagateEventsUntransformedOnError: false,
    } as ConfigResponseDestinationItem;

    const actualOutcome = getDestinationsFromConfig([destinationWithUndefinedTransformation]);

    expect(actualOutcome[0]!.shouldApplyDeviceModeTransformation).toBe(false);
  });

  it('should default propagateEventsUntransformedOnError to false when undefined', () => {
    // Create a destination with undefined propagateEventsUntransformedOnError
    // @ts-expect-error - propagateEventsUntransformedOnError is intentionally omitted
    const destinationWithUndefinedPropagation = {
      config: {
        measurementId: 'G-SC6JGSYH6H',
        capturePageView: 'rs',
        whitelistedEvents: [
          {
            eventName: '',
          },
        ],
        blacklistedEvents: [
          {
            eventName: '',
          },
        ],
        useNativeSDKToSend: false,
        eventFilteringOption: 'disable',
        extendPageViewParams: false,
        oneTrustCookieCategories: [],
      },
      id: 'test-id',
      name: 'Test Destination',
      updatedAt: '2023-03-14T11:34:29.216Z',
      enabled: true,
      destinationDefinition: {
        name: 'TEST',
        displayName: 'Test Destination',
        updatedAt: '2023-03-14T11:21:29.656Z',
      },
      shouldApplyDeviceModeTransformation: false,
    } as ConfigResponseDestinationItem;

    const actualOutcome = getDestinationsFromConfig([destinationWithUndefinedPropagation]);

    expect(actualOutcome[0]!.propagateEventsUntransformedOnError).toBe(false);
  });
});
