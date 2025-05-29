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
}));

import { filterDestinations } from '../../src/shared-chunks/deviceModeDestinations';
import { applySourceConfigurationOverrides } from '../../src/deviceModeDestinations/utils';

const mockFilterDestinations = filterDestinations as jest.MockedFunction<typeof filterDestinations>;
const mockApplySourceConfigurationOverrides =
  applySourceConfigurationOverrides as jest.MockedFunction<
    typeof applySourceConfigurationOverrides
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

      expect(mockErrorHandler.onError).toHaveBeenCalledWith(
        expect.any(Error),
        'DeviceModeDestinationsPlugin',
      );
      expect(mockErrorHandler.onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Unsupported-Destination___dest3'),
        }),
        'DeviceModeDestinationsPlugin',
      );
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

      mockApplySourceConfigurationOverrides.mockReturnValue(overriddenDestinations);

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

    it('should filter enabled destinations after applying overrides', () => {
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

      mockApplySourceConfigurationOverrides.mockReturnValue(overriddenDestinations);

      // Mock filterDestinations to return only enabled destinations
      mockFilterDestinations.mockImplementation((integrations, destinations) =>
        destinations.filter(dest => dest.enabled),
      );

      plugin.nativeDestinations.setActiveDestinations(
        mockState,
        mockPluginsManager,
        mockErrorHandler,
        mockLogger,
      );

      expect(mockFilterDestinations).toHaveBeenCalledWith(
        { All: true },
        expect.arrayContaining([expect.objectContaining({ id: 'dest2', enabled: true })]),
      );

      expect(mockFilterDestinations).toHaveBeenCalledWith(
        { All: true },
        expect.not.arrayContaining([expect.objectContaining({ id: 'dest1', enabled: false })]),
      );
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
      const overriddenDestinations = [
        { ...mockDestinations[0]!, enabled: false, overridden: true },
        { ...mockDestinations[1]!, enabled: true, overridden: true },
      ];
      const enabledDestinations = [overriddenDestinations[1]!];

      mockApplySourceConfigurationOverrides.mockReturnValue(overriddenDestinations);
      mockFilterDestinations.mockReturnValue(enabledDestinations);
      mockPluginsManager.invokeSingle = jest.fn().mockReturnValue(true);

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

      expect(mockFilterDestinations).toHaveBeenCalledWith({ All: true }, enabledDestinations);

      expect(mockState.nativeDestinations.activeDestinations.value).toEqual(enabledDestinations);
    });
  });
});
