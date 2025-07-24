import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { SourceConfigurationOverride } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import type { RSACustomIntegration } from '@rudderstack/analytics-js-common/types/IRudderAnalytics';
import { resetState, state } from '../../__mocks__/state';
import DeviceModeDestinations from '../../src/deviceModeDestinations';
import { filterDestinations } from '../../src/shared-chunks/deviceModeDestinations';
import {
  applySourceConfigurationOverrides,
  isDestinationSDKMounted,
  initializeDestination,
} from '../../src/deviceModeDestinations/utils';

// Mock the shared chunks
jest.mock('../../src/shared-chunks/deviceModeDestinations', () => ({
  destDisplayNamesToFileNamesMap: {
    'Google Analytics 4 (GA4)': 'GA4',
    'Google Analytics': 'GoogleAnalytics',
    Amplitude: 'Amplitude',
    VWO: 'VWO',
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
      displayName: 'Google Analytics 4 (GA4)',
      userFriendlyId: 'Google-Analytics-4-(GA4)___dest1',
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
        category: 'integrations',
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
          expect.objectContaining({ id: 'dest1', displayName: 'Google Analytics 4 (GA4)' }),
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
        category: 'integrations',
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

    it('should append configured destinations to active destinations (custom integrations)', () => {
      state.nativeDestinations.activeDestinations.value = [
        {
          id: 'Custom-Integration-1___custom-xyz123',
          displayName: 'Custom Integration 1',
          userFriendlyId: 'Custom-Integration-1___custom-xyz123',
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
          id: 'Custom-Integration-2___custom-xyz123',
          displayName: 'Custom Integration 2',
          userFriendlyId: 'Custom-Integration-2___custom-xyz123',
          enabled: true,
          shouldApplyDeviceModeTransformation: true,
          propagateEventsUntransformedOnError: false,
          config: {
            apiKey: 'key2',
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable' as const,
          },
        },
      ];

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(state.nativeDestinations.activeDestinations.value).toEqual([
        {
          id: 'Custom-Integration-1___custom-xyz123',
          displayName: 'Custom Integration 1',
          userFriendlyId: 'Custom-Integration-1___custom-xyz123',
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
          id: 'Custom-Integration-2___custom-xyz123',
          displayName: 'Custom Integration 2',
          userFriendlyId: 'Custom-Integration-2___custom-xyz123',
          enabled: true,
          shouldApplyDeviceModeTransformation: true,
          propagateEventsUntransformedOnError: false,
          config: {
            apiKey: 'key2',
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable' as const,
          },
        },
        {
          id: 'dest1',
          displayName: 'Google Analytics 4 (GA4)',
          userFriendlyId: 'Google-Analytics-4-(GA4)___dest1',
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
      ]);
    });

    // disabled destination filtering
    describe('Disabled Destination Filtering', () => {
      it('should set only enabled destination to active destinations', () => {
        const mixedDestinations: Destination[] = [
          {
            ...mockDestinations[0]!,
            enabled: true, // Should be included
          },
          {
            ...mockDestinations[1]!,
            enabled: false, // Should be filtered out
          },
          {
            id: 'dest4',
            displayName: 'Amplitude',
            userFriendlyId: 'Amplitude___dest4',
            enabled: false, // Should be filtered out
            shouldApplyDeviceModeTransformation: true,
            propagateEventsUntransformedOnError: false,
            config: {
              apiKey: 'key4',
              blacklistedEvents: [],
              whitelistedEvents: [],
              eventFilteringOption: 'disable' as const,
            },
          },
        ];

        mockState.nativeDestinations.configuredDestinations.value = mixedDestinations;

        plugin.nativeDestinations.setActiveDestinations(
          mockState,
          mockPluginsManager,
          mockErrorHandler,
          mockLogger,
        );

        expect(state.nativeDestinations.activeDestinations.value).toEqual([mixedDestinations[0]]);
      });

      it('should always filter out disabled destinations when no load options are provided', () => {
        // Set up destinations with mixed enabled states
        const mixedDestinations: Destination[] = [
          {
            ...mockDestinations[0]!,
            enabled: true, // Should be included
          },
          {
            ...mockDestinations[1]!,
            enabled: false, // Should be filtered out
          },
          {
            id: 'dest4',
            displayName: 'Amplitude',
            userFriendlyId: 'Amplitude___dest4',
            enabled: false, // Should be filtered out
            shouldApplyDeviceModeTransformation: true,
            propagateEventsUntransformedOnError: false,
            config: {
              apiKey: 'key4',
              blacklistedEvents: [],
              whitelistedEvents: [],
              eventFilteringOption: 'disable' as const,
            },
          },
        ];

        mockState.nativeDestinations.configuredDestinations.value = mixedDestinations;
        mockState.loadOptions.value = {};
        mockState.nativeDestinations.loadOnlyIntegrations.value = { All: true };

        // Mock filterDisabledDestination to actually filter (since we're testing the real behavior)
        mockApplySourceConfigurationOverrides.mockImplementation(destinations =>
          destinations.filter(dest => dest.enabled),
        );

        plugin.nativeDestinations.setActiveDestinations(
          mockState,
          mockPluginsManager,
          mockErrorHandler,
          mockLogger,
        );

        // Verify only enabled destinations are passed to filterDestinations
        expect(mockFilterDestinations).toHaveBeenCalledWith(
          { All: true },
          expect.arrayContaining([expect.objectContaining({ id: 'dest1', enabled: true })]),
        );

        // Verify disabled destinations are not included
        const passedDestinations = mockFilterDestinations.mock.calls[0]?.[1];
        expect(passedDestinations).not.toContainEqual(expect.objectContaining({ enabled: false }));
        expect(passedDestinations).toHaveLength(1);
        expect(passedDestinations?.[0]).toEqual(
          expect.objectContaining({ id: 'dest1', enabled: true }),
        );
      });

      it('should filter disabled destinations even when load options explicitly include them', () => {
        const mixedDestinations: Destination[] = [
          {
            ...mockDestinations[0]!,
            enabled: true,
          },
          {
            ...mockDestinations[1]!,
            enabled: false, // Disabled destination
          },
        ];

        mockState.nativeDestinations.configuredDestinations.value = mixedDestinations;
        mockState.loadOptions.value.sourceConfigurationOverride = undefined;

        // Load options that would normally include both destinations
        mockState.nativeDestinations.loadOnlyIntegrations.value = {
          All: false,
          GA4: true,
          'Google Analytics': true, // Explicitly requested but should still be filtered if disabled
        };

        mockApplySourceConfigurationOverrides.mockImplementation(destinations =>
          destinations.filter(dest => dest.enabled),
        );

        plugin.nativeDestinations.setActiveDestinations(
          mockState,
          mockPluginsManager,
          mockErrorHandler,
          mockLogger,
        );

        // Verify only enabled destinations make it through, regardless of load options
        const passedDestinations = mockFilterDestinations.mock.calls[0]?.[1];
        expect(passedDestinations).not.toContainEqual(expect.objectContaining({ enabled: false }));
        expect(passedDestinations).toHaveLength(1);
        expect(passedDestinations?.[0]).toEqual(
          expect.objectContaining({
            displayName: 'Google Analytics 4 (GA4)',
            enabled: true,
          }),
        );
      });

      it('should filter disabled destinations when using source configuration overrides', () => {
        const sourceConfigOverride: SourceConfigurationOverride = {
          destinations: [
            { id: 'dest1', enabled: true }, // Enable dest1
            { id: 'dest2', enabled: false }, // Explicitly disable dest2
            { id: 'dest3', enabled: true }, // Enable dest3
          ],
        };

        const testDestinations: Destination[] = [
          { ...mockDestinations[0]!, id: 'dest1', enabled: false }, // Originally disabled, should be enabled by override
          { ...mockDestinations[1]!, id: 'dest2', enabled: true }, // Originally enabled, should be disabled by override
          {
            id: 'dest3',
            displayName: 'Amplitude',
            userFriendlyId: 'Amplitude___dest3',
            enabled: false, // Originally disabled, should be enabled by override
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

        mockState.nativeDestinations.configuredDestinations.value = testDestinations;
        mockState.loadOptions.value.sourceConfigurationOverride = sourceConfigOverride;

        // Mock the actual filtering behavior
        const expectedAfterOverrides = [
          { ...testDestinations[0]!, enabled: true, overridden: true }, // dest1 - enabled by override
          { ...testDestinations[2]!, enabled: true, overridden: true }, // dest3 - enabled by override
          // dest2 should be filtered out as it's disabled by override
        ];

        mockApplySourceConfigurationOverrides.mockReturnValue(expectedAfterOverrides);

        plugin.nativeDestinations.setActiveDestinations(
          mockState,
          mockPluginsManager,
          mockErrorHandler,
          mockLogger,
        );

        // Verify overrides were applied
        expect(mockApplySourceConfigurationOverrides).toHaveBeenCalledWith(
          expect.any(Array),
          sourceConfigOverride,
          mockLogger,
        );

        // Verify only enabled destinations after overrides are passed to filterDestinations
        expect(mockFilterDestinations).toHaveBeenCalledWith({ All: true }, expectedAfterOverrides);

        // Ensure no disabled destinations make it through
        const passedDestinations = mockFilterDestinations.mock.calls[0]?.[1];
        expect(passedDestinations).toEqual(expectedAfterOverrides);
      });

      it('should handle all destinations disabled scenario', () => {
        const allDisabledDestinations: Destination[] = [
          { ...mockDestinations[0]!, enabled: false },
          { ...mockDestinations[1]!, enabled: false },
        ];

        mockState.nativeDestinations.configuredDestinations.value = allDisabledDestinations;

        mockApplySourceConfigurationOverrides.mockImplementation(destinations =>
          destinations.filter(dest => dest.enabled),
        );

        plugin.nativeDestinations.setActiveDestinations(
          mockState,
          mockPluginsManager,
          mockErrorHandler,
          mockLogger,
        );

        // Should result in empty array passed to filterDestinations
        expect(mockFilterDestinations).toHaveBeenCalledWith({ All: true }, []);

        // Final active destinations should be empty
        expect(mockState.nativeDestinations.activeDestinations.value).toEqual([]);
      });

      it('should preserve enabled destinations filtering regardless of consent manager response', () => {
        const mixedDestinations: Destination[] = [
          { ...mockDestinations[0]!, enabled: true }, // Should pass filtering
          { ...mockDestinations[1]!, enabled: false }, // Should be filtered out before consent check
        ];

        mockState.nativeDestinations.configuredDestinations.value = mixedDestinations;
        mockState.loadOptions.value.sourceConfigurationOverride = undefined;

        mockApplySourceConfigurationOverrides.mockImplementation(destinations =>
          destinations.filter(dest => dest.enabled),
        );

        mockFilterDestinations.mockImplementation((integrations, destinations) => destinations);

        // Mock consent manager to deny all destinations (this shouldn't matter for disabled ones)
        mockPluginsManager.invokeSingle = jest.fn().mockReturnValue(false);

        plugin.nativeDestinations.setActiveDestinations(
          mockState,
          mockPluginsManager,
          mockErrorHandler,
          mockLogger,
        );

        // Consent manager should only be called for enabled destinations
        expect(mockPluginsManager.invokeSingle).toHaveBeenCalledTimes(1);
        expect(mockPluginsManager.invokeSingle).toHaveBeenCalledWith(
          'consentManager.isDestinationConsented',
          mockState,
          expect.objectContaining({ apiKey: 'key1' }), // Only the enabled destination
          mockErrorHandler,
          mockLogger,
        );

        // Disabled destinations should never reach consent manager
        expect(mockPluginsManager.invokeSingle).not.toHaveBeenCalledWith(
          'consentManager.isDestinationConsented',
          mockState,
          expect.objectContaining({ apiKey: 'key2' }), // The disabled destination
          mockErrorHandler,
          mockLogger,
        );
      });

      it('should filter out disabled destination with post consent integration option', () => {
        const mixedDestinations: Destination[] = [
          { ...mockDestinations[0]!, enabled: true },
          { ...mockDestinations[1]!, enabled: true },
        ];

        mockState.nativeDestinations.configuredDestinations.value = mixedDestinations;
        mockState.consents.postConsent.value = {
          integrations: {
            All: true,
            'Google Analytics 4 (GA4)': false,
            'Google Analytics': true,
          },
        };

        // Access real implementation at runtime
        const { filterDestinations: realFilterDestinations } = jest.requireActual(
          '../../src/shared-chunks/deviceModeDestinations',
        );
        // Use the real filterDestinations implementation for this test only
        mockFilterDestinations.mockImplementationOnce(realFilterDestinations);

        plugin.nativeDestinations.setActiveDestinations(
          mockState,
          mockPluginsManager,
          mockErrorHandler,
          mockLogger,
        );

        expect(mockState.nativeDestinations.activeDestinations.value).toEqual([
          mixedDestinations[1]!,
        ]);
      });
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
        id: 'Google-Analytics-4-(GA4)___dest1',
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

    it('should categorize integration SDK load errors with integrations category', () => {
      mockIsDestinationSDKMounted.mockReturnValueOnce(false);

      plugin.nativeDestinations.load(
        mockState,
        mockExternalSrcLoader,
        mockErrorHandler,
        mockLogger,
      );

      // Get the callback function passed to loadJSFile
      const firstCall = mockExternalSrcLoader.loadJSFile.mock.calls[0];
      const callback = firstCall[0].callback;

      // Simulate an error in the callback
      const loadError = new Error('Script load failed');
      callback('Google-Analytics-4-(GA4)___dest1', loadError);

      expect(mockErrorHandler.onError).toHaveBeenCalledWith({
        error: loadError,
        context: 'DeviceModeDestinationsPlugin',
        customMessage: 'Failed to load integration SDK for destination "Google Analytics 4 (GA4)"',
        groupingHash: 'Failed to load integration SDK for destination "Google Analytics 4 (GA4)"',
        category: 'integrations',
      });

      mockIsDestinationSDKMounted.mockClear();
    });

    it('should handle multiple integration SDK load errors with proper categorization', () => {
      mockIsDestinationSDKMounted.mockReturnValue(false);

      plugin.nativeDestinations.load(
        mockState,
        mockExternalSrcLoader,
        mockErrorHandler,
        mockLogger,
      );

      // Get the callback functions from both loadJSFile calls
      const firstCall = mockExternalSrcLoader.loadJSFile.mock.calls[0];
      const secondCall = mockExternalSrcLoader.loadJSFile.mock.calls[1];
      const firstCallback = firstCall[0].callback;
      const secondCallback = secondCall[0].callback;

      // Simulate errors in both callbacks
      const loadError1 = new Error('Script load failed 1');
      const loadError2 = new Error('Script load failed 2');

      firstCallback('Google-Analytics-4-(GA4)___dest1', loadError1);
      secondCallback('Google-Analytics___dest2', loadError2);

      expect(mockErrorHandler.onError).toHaveBeenCalledTimes(2);
      expect(mockErrorHandler.onError).toHaveBeenCalledWith({
        error: loadError1,
        context: 'DeviceModeDestinationsPlugin',
        customMessage: 'Failed to load integration SDK for destination "Google Analytics 4 (GA4)"',
        groupingHash: 'Failed to load integration SDK for destination "Google Analytics 4 (GA4)"',
        category: 'integrations',
      });
      expect(mockErrorHandler.onError).toHaveBeenCalledWith({
        error: loadError2,
        context: 'DeviceModeDestinationsPlugin',
        customMessage: 'Failed to load integration SDK for destination "Google Analytics"',
        groupingHash: 'Failed to load integration SDK for destination "Google Analytics"',
        category: 'integrations',
      });

      mockIsDestinationSDKMounted.mockClear();
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

    it('should construct correct integration SDK URLs based on integrations CDN path', () => {
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

        callback('Google-Analytics-4-(GA4)___dest1');

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
        callback('Google-Analytics-4-(GA4)___dest1', mockError);

        expect(mockErrorHandler.onError).toHaveBeenCalledWith({
          error: mockError,
          context: 'DeviceModeDestinationsPlugin',
          customMessage:
            'Failed to load integration SDK for destination "Google Analytics 4 (GA4)"',
          groupingHash: 'Failed to load integration SDK for destination "Google Analytics 4 (GA4)"',
          category: 'integrations',
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
          callback('Google-Analytics-4-(GA4)___dest1', mockError);
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
        callback('Google-Analytics-4-(GA4)___dest1', timeoutError);

        expect(mockErrorHandler.onError).toHaveBeenCalledWith({
          error: timeoutError,
          context: 'DeviceModeDestinationsPlugin',
          customMessage:
            'Failed to load integration SDK for destination "Google Analytics 4 (GA4)"',
          groupingHash: 'Failed to load integration SDK for destination "Google Analytics 4 (GA4)"',
          category: 'integrations',
        });

        expect(mockState.nativeDestinations.failedDestinations.value).toContain(
          mockDestinations[0],
        );
      });
    });
  });

  describe('addCustomIntegration', () => {
    const mockCustomIntegration: RSACustomIntegration = {
      init: jest.fn(),
      isReady: jest.fn(() => true),
      track: jest.fn(),
      page: jest.fn(),
      identify: jest.fn(),
      group: jest.fn(),
      alias: jest.fn(),
    };

    let mockCustomDestination: Destination;

    beforeEach(() => {
      mockCustomDestination = {
        id: 'custom-dest-123',
        displayName: 'Custom Device Mode',
        userFriendlyId: 'custom-dest-123',
        enabled: true,
        shouldApplyDeviceModeTransformation: false,
        propagateEventsUntransformedOnError: false,
        config: {
          blacklistedEvents: [],
          whitelistedEvents: [],
          eventFilteringOption: 'disable',
          connectionMode: 'device',
          useNativeSDKToSend: true,
        },
      };
      mockState.nativeDestinations.configuredDestinations.value = [mockCustomDestination];
      jest.clearAllMocks();
    });

    it('should add custom integration to configured destination when validation passes', () => {
      const destinationId = 'custom-dest-123';

      plugin.nativeDestinations.addCustomIntegration(
        destinationId,
        mockCustomIntegration,
        mockState,
        mockLogger,
      );

      // Verify the destination was updated with the integration
      const updatedDestination = mockState.nativeDestinations.configuredDestinations.value.find(
        dest => dest.id === destinationId,
      );
      expect(updatedDestination).toBeDefined();
      expect(updatedDestination!.isCustomIntegration).toBe(true);
      expect(updatedDestination!.integration).toBeDefined();
    });

    it('should not add custom integration when destination ID is not found', () => {
      const invalidDestinationId = 'non-existent-dest';

      plugin.nativeDestinations.addCustomIntegration(
        invalidDestinationId,
        mockCustomIntegration,
        mockState,
        mockLogger,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        `DeviceModeDestinationsPlugin:: The destination ID "${invalidDestinationId}" does not correspond to a custom device mode destination.`,
      );
    });

    it('should add custom integration when destination is not enabled', () => {
      const disabledDestination = {
        ...mockCustomDestination,
        id: 'disabled-dest-456',
        enabled: false,
      };
      mockState.nativeDestinations.configuredDestinations.value = [disabledDestination];

      plugin.nativeDestinations.addCustomIntegration(
        'disabled-dest-456',
        mockCustomIntegration,
        mockState,
        mockLogger,
      );

      // Verify the destination was updated with the integration
      const updatedDestination = mockState.nativeDestinations.configuredDestinations.value.find(
        dest => dest.id === disabledDestination.id,
      );
      expect(updatedDestination).toBeDefined();
      expect(updatedDestination!.isCustomIntegration).toBe(true);
      expect(updatedDestination!.integration).toBeDefined();
    });

    it('should not add custom integration when destination display name is not "Custom Device Mode"', () => {
      const regularDestination = {
        ...mockCustomDestination,
        id: 'regular-dest-789',
        displayName: 'Google Analytics',
      };
      mockState.nativeDestinations.configuredDestinations.value = [regularDestination];

      plugin.nativeDestinations.addCustomIntegration(
        'regular-dest-789',
        mockCustomIntegration,
        mockState,
        mockLogger,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        'DeviceModeDestinationsPlugin:: The destination ID "regular-dest-789" does not correspond to a custom device mode destination.',
      );
    });

    it('should not add custom integration when integration already exists for destination', () => {
      const destinationWithIntegration = {
        ...mockCustomDestination,
        integration: { isReady: jest.fn(() => true) },
      };
      mockState.nativeDestinations.configuredDestinations.value = [destinationWithIntegration];

      plugin.nativeDestinations.addCustomIntegration(
        'custom-dest-123',
        mockCustomIntegration,
        mockState,
        mockLogger,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        'DeviceModeDestinationsPlugin:: A custom integration with destination ID "custom-dest-123" was already added.',
      );
    });

    it('should not add custom integration when it is not in the expected format', () => {
      // Create a fresh destination without any existing integration
      const cleanDestination = {
        ...mockCustomDestination,
        id: 'fresh-dest-456',
      };
      mockState.nativeDestinations.configuredDestinations.value = [cleanDestination];

      const invalidIntegration = {
        track: jest.fn(),
        // Missing required isReady method
      };

      plugin.nativeDestinations.addCustomIntegration(
        'fresh-dest-456',
        invalidIntegration,
        mockState,
        mockLogger,
      );

      expect(mockLogger.error).toHaveBeenCalledWith(
        'DeviceModeDestinationsPlugin:: The custom integration added for destination ID "fresh-dest-456" does not match the expected implementation format.',
      );
    });

    it('should create integration wrapper with correct properties', () => {
      const destinationId = 'custom-dest-123';

      plugin.nativeDestinations.addCustomIntegration(
        destinationId,
        mockCustomIntegration,
        mockState,
        mockLogger,
      );

      const updatedDestination = mockState.nativeDestinations.configuredDestinations.value.find(
        dest => dest.id === destinationId,
      );
      const integration = updatedDestination!.integration!;

      expect(integration.init).toBeDefined();
      expect(integration.track).toBeDefined();
      expect(integration.page).toBeDefined();
      expect(integration.identify).toBeDefined();
      expect(integration.group).toBeDefined();
      expect(integration.alias).toBeDefined();
      expect(integration.isReady).toBeDefined();
    });

    it('should handle custom integration with minimal methods', () => {
      // Create a fresh destination without any existing integration
      const minimalDestination = {
        ...mockCustomDestination,
        id: 'minimal-dest-789',
      };
      mockState.nativeDestinations.configuredDestinations.value = [minimalDestination];

      const minimalIntegration: RSACustomIntegration = {
        isReady: jest.fn(() => true),
      };

      plugin.nativeDestinations.addCustomIntegration(
        'minimal-dest-789',
        minimalIntegration,
        mockState,
        mockLogger,
      );

      const updatedDestination = mockState.nativeDestinations.configuredDestinations.value.find(
        dest => dest.id === 'minimal-dest-789',
      );
      const integration = updatedDestination!.integration!;

      expect(integration.isReady).toBeDefined();
      expect(integration.init).toBeUndefined();
      expect(integration.track).toBeUndefined();
      expect(integration.page).toBeUndefined();
      expect(integration.identify).toBeUndefined();
      expect(integration.group).toBeUndefined();
      expect(integration.alias).toBeUndefined();
    });

    it('should work with multiple custom destinations', () => {
      const customDest1 = { ...mockCustomDestination, id: 'custom-dest-1' };
      const customDest2 = { ...mockCustomDestination, id: 'custom-dest-2' };
      mockState.nativeDestinations.configuredDestinations.value = [customDest1, customDest2];

      const integration1 = { isReady: jest.fn(() => true) };
      const integration2 = { isReady: jest.fn(() => true) };

      plugin.nativeDestinations.addCustomIntegration(
        'custom-dest-1',
        integration1,
        mockState,
        mockLogger,
      );

      plugin.nativeDestinations.addCustomIntegration(
        'custom-dest-2',
        integration2,
        mockState,
        mockLogger,
      );

      const updatedDest1 = mockState.nativeDestinations.configuredDestinations.value.find(
        dest => dest.id === 'custom-dest-1',
      );
      const updatedDest2 = mockState.nativeDestinations.configuredDestinations.value.find(
        dest => dest.id === 'custom-dest-2',
      );

      expect(updatedDest1!.integration).toBeDefined();
      expect(updatedDest2!.integration).toBeDefined();
      expect(updatedDest1!.isCustomIntegration).toBe(true);
      expect(updatedDest2!.isCustomIntegration).toBe(true);
    });
  });

  describe('integration with destination filtering', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should complete full workflow: add custom integration and filter destinations correctly', () => {
      const customDestination: Destination = {
        id: 'custom-dest-workflow',
        displayName: 'Custom Device Mode',
        userFriendlyId: 'custom-dest-workflow',
        enabled: true,
        shouldApplyDeviceModeTransformation: false,
        propagateEventsUntransformedOnError: false,
        config: {
          blacklistedEvents: [],
          whitelistedEvents: [],
          eventFilteringOption: 'disable',
          connectionMode: 'device',
          useNativeSDKToSend: true,
        },
      };

      const regularDestination: Destination = {
        id: 'regular-dest-workflow',
        displayName: 'Google Analytics',
        userFriendlyId: 'regular-dest-workflow',
        enabled: true,
        shouldApplyDeviceModeTransformation: false,
        propagateEventsUntransformedOnError: false,
        config: {
          blacklistedEvents: [],
          whitelistedEvents: [],
          eventFilteringOption: 'disable',
          connectionMode: 'device',
          useNativeSDKToSend: true,
        },
      };

      mockState.nativeDestinations.configuredDestinations.value = [
        customDestination,
        regularDestination,
      ];

      const mockCustomIntegration: RSACustomIntegration = {
        init: jest.fn(),
        isReady: jest.fn(() => true),
        track: jest.fn(),
      };

      // Step 1: Add custom integration
      plugin.nativeDestinations.addCustomIntegration(
        'custom-dest-workflow',
        mockCustomIntegration,
        mockState,
        mockLogger,
      );

      // Verify integration was added
      const updatedDestination = mockState.nativeDestinations.configuredDestinations.value.find(
        dest => dest.id === 'custom-dest-workflow',
      );
      expect(updatedDestination!.isCustomIntegration).toBe(true);
      expect(updatedDestination!.integration).toBeDefined();
    });

    it('should warn about custom destinations without integrations during filtering', () => {
      const customDestWithoutIntegration: Destination = {
        id: 'custom-dest-no-integration',
        displayName: 'Custom Device Mode',
        userFriendlyId: 'custom-dest-no-integration',
        enabled: true,
        shouldApplyDeviceModeTransformation: false,
        propagateEventsUntransformedOnError: false,
        config: {
          blacklistedEvents: [],
          whitelistedEvents: [],
          eventFilteringOption: 'disable',
          connectionMode: 'device',
          useNativeSDKToSend: true,
        },
        isCustomIntegration: true, // Marked as custom but no integration added
      };

      const customDestWithIntegration: Destination = {
        id: 'custom-dest-with-integration',
        displayName: 'Custom Device Mode',
        userFriendlyId: 'custom-dest-with-integration',
        enabled: true,
        shouldApplyDeviceModeTransformation: false,
        propagateEventsUntransformedOnError: false,
        config: {
          blacklistedEvents: [],
          whitelistedEvents: [],
          eventFilteringOption: 'disable',
          connectionMode: 'device',
          useNativeSDKToSend: true,
        },
        isCustomIntegration: true,
        integration: { isReady: jest.fn(() => true) },
      };

      mockState.nativeDestinations.configuredDestinations.value = [
        customDestWithoutIntegration,
        customDestWithIntegration,
      ];

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      // Should warn about the destination without integration
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'DeviceModeDestinationsPlugin:: No valid custom integration was added for destination ID "custom-dest-no-integration". Ignoring it.',
      );

      // Should not warn about destination with integration
      expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple custom destinations with mixed integration states', () => {
      const destinations: Destination[] = [
        {
          id: 'custom-1',
          displayName: 'Custom Device Mode',
          userFriendlyId: 'custom-1',
          enabled: true,
          shouldApplyDeviceModeTransformation: false,
          propagateEventsUntransformedOnError: false,
          config: {
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable',
            connectionMode: 'device',
            useNativeSDKToSend: true,
          },
          isCustomIntegration: true,
          integration: { isReady: jest.fn(() => true) },
        },
        {
          id: 'custom-2',
          displayName: 'Custom Device Mode',
          userFriendlyId: 'custom-2',
          enabled: true,
          shouldApplyDeviceModeTransformation: false,
          propagateEventsUntransformedOnError: false,
          config: {
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable',
            connectionMode: 'device',
            useNativeSDKToSend: true,
          },
          isCustomIntegration: true,
          // No integration added
        },
        {
          id: 'custom-3',
          displayName: 'Custom Device Mode',
          userFriendlyId: 'custom-3',
          enabled: false, // Disabled
          shouldApplyDeviceModeTransformation: false,
          propagateEventsUntransformedOnError: false,
          config: {
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable',
            connectionMode: 'device',
            useNativeSDKToSend: true,
          },
          isCustomIntegration: true,
        },
        {
          id: 'regular-dest',
          displayName: 'Google Analytics',
          userFriendlyId: 'regular-dest',
          enabled: true,
          shouldApplyDeviceModeTransformation: false,
          propagateEventsUntransformedOnError: false,
          config: {
            blacklistedEvents: [],
            whitelistedEvents: [],
            eventFilteringOption: 'disable',
            connectionMode: 'device',
            useNativeSDKToSend: true,
          },
        },
      ];

      mockState.nativeDestinations.configuredDestinations.value = destinations;

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      // Should warn about custom-2 and custom-3 (both enabled and disabled custom destination without integration)
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'DeviceModeDestinationsPlugin:: No valid custom integration was added for destination ID "custom-2". Ignoring it.',
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'DeviceModeDestinationsPlugin:: No valid custom integration was added for destination ID "custom-3". Ignoring it.',
      );
      expect(mockLogger.warn).toHaveBeenCalledTimes(2);
    });
  });
});
