import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { SourceConfigurationOverride } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { resetState, state } from '../../__mocks__/state';
import DeviceModeDestinations from '../../src/deviceModeDestinations';

// Mock the shared chunks
jest.mock('../../src/shared-chunks/deviceModeDestinations', () => ({
  destDisplayNamesToFileNamesMap: {
    GA4: 'GA4',
    'Google Analytics': 'GoogleAnalytics',
    Amplitude: 'Amplitude',
  },
  filterDestinations: jest.fn((integrations, destinations) => destinations),
  isHybridModeDestination: jest.fn(() => false),
}));

// Mock the utils module to control behavior in integration tests
jest.mock('../../src/deviceModeDestinations/utils', () => ({
  ...jest.requireActual('../../src/deviceModeDestinations/utils'),
  applySourceConfigurationOverrides: jest.fn(),
  isDestinationSDKMounted: jest.fn(),
  initializeDestination: jest.fn(),
}));

import { filterDestinations } from '../../src/shared-chunks/deviceModeDestinations';
import {
  applySourceConfigurationOverrides,
  isDestinationSDKMounted,
  initializeDestination,
} from '../../src/deviceModeDestinations/utils';

const mockFilterDestinations = filterDestinations as jest.MockedFunction<typeof filterDestinations>;
const mockApplySourceConfigurationOverrides =
  applySourceConfigurationOverrides as jest.MockedFunction<
    typeof applySourceConfigurationOverrides
  >;
const mockIsDestinationSDKMounted = isDestinationSDKMounted as jest.MockedFunction<
  typeof isDestinationSDKMounted
>;
const mockInitializeDestination = initializeDestination as jest.MockedFunction<
  typeof initializeDestination
>;

describe('DeviceModeDestinations Plugin', () => {
  let plugin: any;
  let mockState: ApplicationState;
  let mockPluginsManager: IPluginsManager;
  let mockErrorHandler: IErrorHandler;
  let mockLogger: ILogger;

  const mockDestinations: Destination[] = [
    {
      id: 'dest1',
      displayName: 'GA4',
      userFriendlyId: 'GA4___dest1',
      enabled: true,
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      config: {
        apiKey: 'key1',
        blacklistedEvents: [],
        whitelistedEvents: [],
        eventFilteringOption: 'disable' as const,
      },
    },
    {
      id: 'dest2',
      displayName: 'Google Analytics',
      userFriendlyId: 'Google-Analytics___dest2',
      enabled: false,
      shouldApplyDeviceModeTransformation: false,
      propagateEventsUntransformedOnError: true,
      config: {
        apiKey: 'key2',
        blacklistedEvents: [],
        whitelistedEvents: [],
        eventFilteringOption: 'disable' as const,
      },
    },
    {
      id: 'dest3',
      displayName: 'Unsupported Destination',
      userFriendlyId: 'Unsupported-Destination___dest3',
      enabled: true,
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      config: {
        apiKey: 'key3',
        blacklistedEvents: [],
        whitelistedEvents: [],
        eventFilteringOption: 'disable' as const,
      },
    },
  ];

  beforeEach(() => {
    resetState();
    plugin = DeviceModeDestinations();

    mockState = state;
    mockState.nativeDestinations.configuredDestinations.value = [...mockDestinations];
    mockState.loadOptions.value = {
      ...mockState.loadOptions.value,
      loadIntegration: true,
      sourceConfigurationOverride: undefined,
    };
    mockState.nativeDestinations.loadOnlyIntegrations.value = { All: true };
    mockState.consents.postConsent.value = {};

    mockPluginsManager = {
      invokeSingle: jest.fn().mockReturnValue(true),
    } as any;

    mockErrorHandler = defaultErrorHandler;
    mockLogger = defaultLogger;

    // Reset mocks
    jest.clearAllMocks();
    mockFilterDestinations.mockImplementation((integrations, destinations) => destinations);
    mockApplySourceConfigurationOverrides.mockImplementation(destinations => destinations);
  });

  describe('Plugin Initialization', () => {
    it('should add plugin name to loaded plugins', () => {
      plugin.initialize(mockState);

      expect(mockState.plugins.loadedPlugins.value).toContain('DeviceModeDestinations');
    });

    it('should have correct plugin name', () => {
      expect(plugin.name).toBe('DeviceModeDestinations');
    });

    it('should have nativeDestinations extension point', () => {
      expect(plugin.nativeDestinations).toBeDefined();
      expect(plugin.nativeDestinations.setActiveDestinations).toBeDefined();
    });
  });

  describe('setActiveDestinations', () => {
    it('should filter out unsupported destinations', () => {
      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockErrorHandler.onError).toHaveBeenCalledWith({
        context: 'DeviceModeDestinationsPlugin',
        error: new Error('Integration for destination "Unsupported Destination" is not supported.'),
      });
    });

    it('should set loadIntegration from loadOptions', () => {
      mockState.loadOptions.value.loadIntegration = false;

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockState.nativeDestinations.loadIntegration.value).toBe(false);
    });

    it('should use postConsent integrations when available', () => {
      mockState.consents.postConsent.value = {
        integrations: { GA4: true, GoogleAnalytics: false },
      };

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockFilterDestinations).toHaveBeenCalledWith(
        { GA4: true, GoogleAnalytics: false },
        expect.any(Array),
      );
    });

    it('should fallback to loadOnlyIntegrations when postConsent is not available', () => {
      mockState.consents.postConsent.value = {};
      mockState.nativeDestinations.loadOnlyIntegrations.value = { Amplitude: true };

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockFilterDestinations).toHaveBeenCalledWith({ Amplitude: true }, expect.any(Array));
    });

    it('should apply source configuration overrides when provided', () => {
      const sourceConfigOverride: SourceConfigurationOverride = {
        destinations: [
          { id: 'dest1', enabled: false },
          { id: 'dest2', enabled: true },
        ],
      };

      mockState.loadOptions.value.sourceConfigurationOverride = sourceConfigOverride;

      const overriddenDestinations = [
        { ...mockDestinations[0]!, enabled: false, overridden: true },
        { ...mockDestinations[1]!, enabled: true, overridden: true },
      ];

      mockApplySourceConfigurationOverrides.mockReturnValueOnce(overriddenDestinations);

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockApplySourceConfigurationOverrides).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: 'dest1', displayName: 'GA4' }),
          expect.objectContaining({ id: 'dest2', displayName: 'Google Analytics' }),
        ]),
        sourceConfigOverride,
        mockLogger,
      );
    });

    it('should not apply source configuration overrides when not provided', () => {
      mockState.loadOptions.value.sourceConfigurationOverride = undefined;

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockApplySourceConfigurationOverrides).not.toHaveBeenCalled();
    });

    it('should apply consent filtering after overrides and enabled filtering', () => {
      const sourceConfigOverride: SourceConfigurationOverride = {
        destinations: [{ id: 'dest2', enabled: true }],
      };

      mockState.loadOptions.value.sourceConfigurationOverride = sourceConfigOverride;

      const overriddenDestinations = [
        mockDestinations[0]!, // dest1 - originally enabled, no override
        { ...mockDestinations[1]!, enabled: true, overridden: true }, // dest2 - enabled via override
      ];

      mockApplySourceConfigurationOverrides.mockReturnValue(overriddenDestinations);
      mockFilterDestinations.mockImplementation((integrations, destinations) => destinations);

      // Mock consent manager to deny consent for dest2
      mockPluginsManager.invokeSingle = jest.fn().mockImplementation((method, state, config) => {
        if (config.apiKey === 'key2') return false;
        return true;
      });

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockPluginsManager.invokeSingle).toHaveBeenCalledWith(
        'consentManager.isDestinationConsented',
        mockState,
        expect.objectContaining({ apiKey: 'key1' }),
        mockErrorHandler,
        mockLogger,
      );

      expect(mockPluginsManager.invokeSingle).toHaveBeenCalledWith(
        'consentManager.isDestinationConsented',
        mockState,
        expect.objectContaining({ apiKey: 'key2' }),
        mockErrorHandler,
        mockLogger,
      );
    });

    it('should handle the complete integration flow', () => {
      const sourceConfigOverride: SourceConfigurationOverride = {
        destinations: [
          { id: 'dest1', enabled: false },
          { id: 'dest2', enabled: true },
        ],
      };

      mockState.loadOptions.value.sourceConfigurationOverride = sourceConfigOverride;

      const supportedDestinations = [mockDestinations[0]!, mockDestinations[1]!];
      const overriddenDestinations = [{ ...mockDestinations[1]!, enabled: true, overridden: true }];

      mockApplySourceConfigurationOverrides.mockReturnValueOnce(overriddenDestinations);
      mockFilterDestinations.mockReturnValueOnce(overriddenDestinations);
      mockPluginsManager.invokeSingle = jest.fn().mockReturnValueOnce(true);

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      // Verify the integration flow
      expect(mockApplySourceConfigurationOverrides).toHaveBeenCalledWith(
        supportedDestinations,
        sourceConfigOverride,
        mockLogger,
      );

      expect(mockFilterDestinations).toHaveBeenCalledWith({ All: true }, overriddenDestinations);

      expect(mockState.nativeDestinations.activeDestinations.value).toEqual(overriddenDestinations);
    });

    it('should handle empty configured destinations array', () => {
      mockState.nativeDestinations.configuredDestinations.value = [];

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockState.nativeDestinations.activeDestinations.value).toEqual([]);
      expect(mockErrorHandler.onError).not.toHaveBeenCalled();
    });

    it('should handle destinations with missing displayName', () => {
      const destinationWithoutDisplayName = {
        ...mockDestinations[0]!,
        displayName: undefined as any,
      };

      mockState.nativeDestinations.configuredDestinations.value = [destinationWithoutDisplayName];

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockErrorHandler.onError).toHaveBeenCalledWith({
        context: 'DeviceModeDestinationsPlugin',
        error: new Error('Integration for destination "undefined" is not supported.'),
      });
    });

    it('should handle malformed postConsent integrations', () => {
      mockState.consents.postConsent.value = {
        integrations: null as any,
      };

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      // Should fallback to loadOnlyIntegrations
      expect(mockFilterDestinations).toHaveBeenCalledWith({ All: true }, expect.any(Array));
    });
  });

  describe('load method', () => {
    let mockExternalSrcLoader: any;

    beforeEach(() => {
      mockExternalSrcLoader = {
        loadJSFile: jest.fn(),
      };
      mockState.lifecycle.integrationsCDNPath.value = 'https://cdn.rudderlabs.com/v3';
      mockState.nativeDestinations.activeDestinations.value = [
        mockDestinations[0]!,
        mockDestinations[1]!,
      ];
    });

    it('should load JS files for all active destinations when SDKs are not mounted', () => {
      mockIsDestinationSDKMounted.mockReturnValueOnce(false);

      plugin.nativeDestinations.load(
        mockState,
        mockExternalSrcLoader,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledTimes(2);

      expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledWith({
        url: 'https://cdn.rudderlabs.com/v3/GA4.min.js',
        id: 'GA4___dest1',
        callback: expect.any(Function),
        timeout: 10000,
      });

      expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledWith({
        url: 'https://cdn.rudderlabs.com/v3/GoogleAnalytics.min.js',
        id: 'Google-Analytics___dest2',
        callback: expect.any(Function),
        timeout: 10000,
      });
    });

    it('should initialize destinations directly when SDKs are already mounted', () => {
      mockIsDestinationSDKMounted.mockReturnValue(true);

      plugin.nativeDestinations.load(
        mockState,
        mockExternalSrcLoader,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockExternalSrcLoader.loadJSFile).not.toHaveBeenCalled();
      expect(mockInitializeDestination).toHaveBeenCalledTimes(2);

      expect(mockInitializeDestination).toHaveBeenCalledWith(
        mockDestinations[0],
        mockState,
        'GA4_RS',
        'GA4',
        mockErrorHandler,
        mockLogger,
      );

      expect(mockInitializeDestination).toHaveBeenCalledWith(
        mockDestinations[1],
        mockState,
        'GoogleAnalytics_RS',
        'GoogleAnalytics',
        mockErrorHandler,
        mockLogger,
      );

      // Clear mocks
      mockIsDestinationSDKMounted.mockClear();
    });

    it('should handle mixed scenarios - some SDKs mounted, some not', () => {
      mockIsDestinationSDKMounted.mockImplementation((destSDKIdentifier: string) => {
        return destSDKIdentifier === 'GA4_RS';
      });

      plugin.nativeDestinations.load(
        mockState,
        mockExternalSrcLoader,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledTimes(1);
      expect(mockInitializeDestination).toHaveBeenCalledTimes(1);
    });

    it('should work without optional parameters', () => {
      mockIsDestinationSDKMounted.mockReturnValueOnce(false);

      plugin.nativeDestinations.load(mockState, mockExternalSrcLoader);

      expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledTimes(2);
    });

    it('should handle empty active destinations array', () => {
      mockState.nativeDestinations.activeDestinations.value = [];

      plugin.nativeDestinations.load(
        mockState,
        mockExternalSrcLoader,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockExternalSrcLoader.loadJSFile).not.toHaveBeenCalled();
      expect(mockInitializeDestination).not.toHaveBeenCalled();
    });

    it('should use custom external script onLoad callback when provided', () => {
      const customCallback = jest.fn();
      mockIsDestinationSDKMounted.mockReturnValueOnce(false);

      plugin.nativeDestinations.load(
        mockState,
        mockExternalSrcLoader,
        mockErrorHandler,
        mockLogger,
        customCallback,
      );

      expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledWith(
        expect.objectContaining({
          callback: customCallback,
        }),
      );
    });

    it('should construct correct SDK URLs based on integrations CDN path', () => {
      const customCDNPath = 'https://custom-cdn.example.com/integrations';
      mockState.lifecycle.integrationsCDNPath.value = customCDNPath;
      mockIsDestinationSDKMounted.mockReturnValueOnce(false);

      plugin.nativeDestinations.load(
        mockState,
        mockExternalSrcLoader,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${customCDNPath}/GA4.min.js`,
        }),
      );

      expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${customCDNPath}/GoogleAnalytics.min.js`,
        }),
      );
    });

    it('should pass correct timeout to external src loader', () => {
      mockIsDestinationSDKMounted.mockReturnValueOnce(false);

      plugin.nativeDestinations.load(
        mockState,
        mockExternalSrcLoader,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 10000,
        }),
      );
    });

    describe('default callback behavior', () => {
      it('should handle successful script load', () => {
        mockIsDestinationSDKMounted.mockReturnValueOnce(false);

        plugin.nativeDestinations.load(
          mockState,
          mockExternalSrcLoader,
          mockErrorHandler,
          mockLogger,
        );

        const loadJSFileCall = mockExternalSrcLoader.loadJSFile.mock.calls[0];
        const callback = loadJSFileCall[0].callback;

        callback('GA4___dest1');

        expect(mockInitializeDestination).toHaveBeenCalledWith(
          mockDestinations[0],
          mockState,
          'GA4_RS',
          'GA4',
          mockErrorHandler,
          mockLogger,
        );
      });

      it('should handle script load errors', () => {
        mockIsDestinationSDKMounted.mockReturnValueOnce(false);

        plugin.nativeDestinations.load(
          mockState,
          mockExternalSrcLoader,
          mockErrorHandler,
          mockLogger,
        );

        const loadJSFileCall = mockExternalSrcLoader.loadJSFile.mock.calls[0];
        const callback = loadJSFileCall[0].callback;

        const mockError = new Error('Script load failed');
        callback('GA4___dest1', mockError);

        expect(mockErrorHandler.onError).toHaveBeenCalledWith({
          error: mockError,
          context: 'DeviceModeDestinationsPlugin',
          customMessage: 'Failed to load integration SDK for destination "GA4"',
          groupingHash: 'Failed to load integration SDK for destination "GA4"',
        });

        expect(mockState.nativeDestinations.failedDestinations.value).toContain(
          mockDestinations[0],
        );
        expect(mockInitializeDestination).not.toHaveBeenCalled();
      });

      it('should handle script load errors without error handler', () => {
        mockIsDestinationSDKMounted.mockReturnValueOnce(false);

        plugin.nativeDestinations.load(mockState, mockExternalSrcLoader, undefined, mockLogger);

        const loadJSFileCall = mockExternalSrcLoader.loadJSFile.mock.calls[0];
        const callback = loadJSFileCall[0].callback;

        const mockError = new Error('Script load failed');

        expect(() => {
          callback('GA4___dest1', mockError);
        }).not.toThrow();

        expect(mockState.nativeDestinations.failedDestinations.value).toContain(
          mockDestinations[0],
        );
      });
    });

    describe('Edge Cases', () => {
      it('should handle destinations with undefined display names', () => {
        const destinationWithUndefinedDisplayName = {
          ...mockDestinations[0]!,
          displayName: undefined as any,
        };

        mockState.nativeDestinations.activeDestinations.value = [
          destinationWithUndefinedDisplayName,
        ];
        mockIsDestinationSDKMounted.mockReturnValueOnce(false);

        plugin.nativeDestinations.load(
          mockState,
          mockExternalSrcLoader,
          mockErrorHandler,
          mockLogger,
        );

        expect(mockExternalSrcLoader.loadJSFile).not.toHaveBeenCalled();
      });

      it('should handle destinations with null config', () => {
        const destinationWithNullConfig = {
          ...mockDestinations[0]!,
          config: null as any,
        };

        mockState.nativeDestinations.activeDestinations.value = [destinationWithNullConfig];
        mockIsDestinationSDKMounted.mockReturnValueOnce(false);

        plugin.nativeDestinations.load(
          mockState,
          mockExternalSrcLoader,
          mockErrorHandler,
          mockLogger,
        );

        expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledTimes(1);
      });

      it('should handle missing integrations CDN path', () => {
        mockState.lifecycle.integrationsCDNPath.value = '';
        mockIsDestinationSDKMounted.mockReturnValueOnce(false);

        plugin.nativeDestinations.load(
          mockState,
          mockExternalSrcLoader,
          mockErrorHandler,
          mockLogger,
        );

        expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledWith(
          expect.objectContaining({
            url: '/GA4.min.js',
          }),
        );
      });

      it('should handle destinations with invalid userFriendlyId format', () => {
        const destinationWithInvalidId = {
          ...mockDestinations[0]!,
          userFriendlyId: 'InvalidFormat',
        };

        mockState.nativeDestinations.activeDestinations.value = [destinationWithInvalidId];
        mockIsDestinationSDKMounted.mockReturnValueOnce(false);

        plugin.nativeDestinations.load(
          mockState,
          mockExternalSrcLoader,
          mockErrorHandler,
          mockLogger,
        );

        expect(mockExternalSrcLoader.loadJSFile).toHaveBeenCalledTimes(1);
      });

      it('should handle destinations without displayName mapping', () => {
        const destinationWithUnmappedName = {
          ...mockDestinations[0]!,
          displayName: 'Unknown Destination',
        };

        mockState.nativeDestinations.activeDestinations.value = [destinationWithUnmappedName];
        mockIsDestinationSDKMounted.mockReturnValueOnce(false);

        plugin.nativeDestinations.load(
          mockState,
          mockExternalSrcLoader,
          mockErrorHandler,
          mockLogger,
        );

        // Should not load since mapping doesn't exist
        expect(mockExternalSrcLoader.loadJSFile).not.toHaveBeenCalled();
      });

      it('should handle script load timeout correctly', () => {
        mockIsDestinationSDKMounted.mockReturnValueOnce(false);

        plugin.nativeDestinations.load(
          mockState,
          mockExternalSrcLoader,
          mockErrorHandler,
          mockLogger,
        );

        const loadJSFileCall = mockExternalSrcLoader.loadJSFile.mock.calls[0];
        const callback = loadJSFileCall[0].callback;

        // Simulate timeout error
        const timeoutError = new Error('Script load timeout');
        callback('GA4___dest1', timeoutError);

        expect(mockErrorHandler.onError).toHaveBeenCalledWith({
          error: timeoutError,
          context: 'DeviceModeDestinationsPlugin',
          customMessage: 'Failed to load integration SDK for destination "GA4"',
          groupingHash: 'Failed to load integration SDK for destination "GA4"',
        });

        expect(mockState.nativeDestinations.failedDestinations.value).toContain(
          mockDestinations[0],
        );
      });
    });
  });
});
