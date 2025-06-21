/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type {
  SourceConfigurationOverride,
  SourceConfigurationOverrideDestination,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import {
  wait,
  isDestinationReady,
  createDestinationInstance,
  isDestinationSDKMounted,
  applySourceConfigurationOverrides,
  applyOverrideToDestination,
  filterDisabledDestination,
  getCumulativeIntegrationsConfig,
  initializeDestination,
} from '../../src/deviceModeDestinations/utils';
import { resetState, state } from '../../__mocks__/state';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';

describe('deviceModeDestinations utils', () => {
  describe('wait', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(0);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return a promise that resolves after the specified time', async () => {
      const time = 1000;
      const startTime = Date.now();

      const waitPromise = wait(time);

      // Advance the timers by the specified time
      jest.runAllTimers();

      await waitPromise;

      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(time);
    });

    it('should return a promise that resolves immediately even if the time is 0', async () => {
      const time = 0;
      const startTime = Date.now();

      const waitPromise = wait(time);

      // Advance the timers by the specified time
      jest.runAllTimers();

      await waitPromise;

      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(time);
    });

    it('should return a promise that resolves immediately even if the time is negative', async () => {
      const time = -1000;
      const startTime = Date.now();

      const waitPromise = wait(time);

      // Advance the timers by the next tick
      jest.runAllTimers();

      await waitPromise;

      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(0);
    });

    it('should return a promise that resolves immediately even if the time is not a number', async () => {
      const time = '2 seconds';
      const startTime = Date.now();

      // @ts-expect-error intentionally passing a string
      const waitPromise = wait(time);

      // Advance the timers by the next tick
      jest.runAllTimers();

      await waitPromise;

      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('isDestinationReady', () => {
    let isReadyResponse = false;
    const destination = {
      instance: {
        isReady: () => isReadyResponse,
      },
      userFriendlyId: 'GA4___1234567890',
      id: 'GA4___1234567890',
      displayName: 'Google Analytics 4 (GA4)',
      enabled: true,
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      config: {
        blacklistedEvents: [],
        whitelistedEvents: [],
        eventFilteringOption: 'disable',
      },
    };

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(0);
    });

    afterEach(() => {
      jest.useRealTimers();
      isReadyResponse = false;
    });

    it('should return a promise that gets resolved when the destination is ready immediately', async () => {
      isReadyResponse = true;

      const isReadyPromise = isDestinationReady(destination as Destination);

      // Fast-forward the timers
      jest.runAllTimers();

      await expect(isReadyPromise).resolves.toEqual(true);
    });

    it('should return a promise that gets resolved when the destination is ready after some time', async () => {
      setTimeout(() => {
        isReadyResponse = true;
      }, 1000);

      const isReadyPromise = isDestinationReady(destination as Destination);

      // Fast-forward the timers
      jest.advanceTimersByTime(1000);

      await expect(isReadyPromise).resolves.toEqual(true);
    });

    it('should return a promise that gets rejected when the destination is not ready after the timeout', async () => {
      const isReadyPromise = isDestinationReady(destination as Destination);

      // Fast-forward the timers to cause a timeout
      jest.advanceTimersByTime(11000);

      await expect(isReadyPromise).rejects.toThrow(new Error(`A timeout of 11000 ms occurred`));
    });
  });

  describe('createDestinationInstance', () => {
    // put destination SDK code on the window object
    const destSDKIdentifier = 'GA4_RS';
    const sdkTypeName = 'GA4';

    beforeAll(() => {
      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: class {
          config: any;
          analytics: any;
          constructor(config: any, analytics: any) {
            this.config = config;
            this.analytics = analytics;
          }
        },
      };
    });

    afterAll(() => {
      delete (window as any).GA4_RS;
    });

    it('should return an instance of the destination', () => {
      state.lifecycle.writeKey.value = '12345678910'; // write key 2

      const destination = {
        config: {
          apiKey: '1234',
        },
        areTransformationsConnected: false,
        id: 'GA4___5678',
      } as unknown as Destination;

      const destinationInstance = createDestinationInstance(
        destSDKIdentifier,
        sdkTypeName,
        destination,
        state,
      );

      expect(destinationInstance).toBeInstanceOf((window as any)[destSDKIdentifier][sdkTypeName]);
      expect(destinationInstance.config).toEqual(destination.config);
      expect(destinationInstance.analytics).toEqual({
        loadIntegration: true,
        loadOnlyIntegrations: {},
        logLevel: 'ERROR',
        alias: expect.any(Function),
        group: expect.any(Function),
        identify: expect.any(Function),
        page: expect.any(Function),
        track: expect.any(Function),
        getAnonymousId: expect.any(Function),
        getGroupId: expect.any(Function),
        getUserId: expect.any(Function),
        getUserTraits: expect.any(Function),
        getGroupTraits: expect.any(Function),
        getSessionId: expect.any(Function),
      });

      // Make sure all the calls are forwarded to the correct instance
      destinationInstance.analytics?.page(
        'test-category',
        'test-name',
        { test: 'test' },
        { test: 'test' },
        () => {},
      );
      expect(state.lifecycle.safeAnalyticsInstance.value?.page).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.safeAnalyticsInstance.value?.page).toHaveBeenCalledWith(
        'test-category',
        'test-name',
        { test: 'test' },
        { test: 'test' },
        expect.any(Function),
      );

      destinationInstance.analytics?.track(
        'test-event',
        { test: 'test' },
        { test: 'test' },
        () => {},
      );
      expect(state.lifecycle.safeAnalyticsInstance.value?.track).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.safeAnalyticsInstance.value?.track).toHaveBeenCalledWith(
        'test-event',
        { test: 'test' },
        { test: 'test' },
        expect.any(Function),
      );

      destinationInstance.analytics?.identify(
        'test-user-id',
        { test: 'test' },
        { test: 'test' },
        () => {},
      );
      expect(state.lifecycle.safeAnalyticsInstance.value?.identify).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.safeAnalyticsInstance.value?.identify).toHaveBeenCalledWith(
        'test-user-id',
        { test: 'test' },
        { test: 'test' },
        expect.any(Function),
      );

      destinationInstance.analytics?.group(
        'test-group-id',
        { test: 'test' },
        { test: 'test' },
        () => {},
      );
      expect(state.lifecycle.safeAnalyticsInstance.value?.group).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.safeAnalyticsInstance.value?.group).toHaveBeenCalledWith(
        'test-group-id',
        { test: 'test' },
        { test: 'test' },
        expect.any(Function),
      );

      destinationInstance.analytics?.alias('test-alias-id', 'old-id', { test: 'test' }, () => {});
      expect(state.lifecycle.safeAnalyticsInstance.value?.alias).toHaveBeenCalledTimes(1);
      expect(state.lifecycle.safeAnalyticsInstance.value?.alias).toHaveBeenCalledWith(
        'test-alias-id',
        'old-id',
        { test: 'test' },
        expect.any(Function),
      );

      destinationInstance.analytics?.getUserId();
      expect(state.lifecycle.safeAnalyticsInstance.value?.getUserId).toHaveBeenCalledTimes(1);

      destinationInstance.analytics?.getUserTraits();
      expect(state.lifecycle.safeAnalyticsInstance.value?.getUserTraits).toHaveBeenCalledTimes(1);

      destinationInstance.analytics?.getGroupId();
      expect(state.lifecycle.safeAnalyticsInstance.value?.getGroupId).toHaveBeenCalledTimes(1);

      destinationInstance.analytics?.getGroupTraits();
      expect(state.lifecycle.safeAnalyticsInstance.value?.getGroupTraits).toHaveBeenCalledTimes(1);

      destinationInstance.analytics?.getSessionId();
      expect(state.lifecycle.safeAnalyticsInstance.value?.getSessionId).toHaveBeenCalledTimes(1);

      resetState();
    });
  });

  describe('isDestinationSDKMounted', () => {
    const destSDKIdentifier = 'GA4_RS';
    const sdkTypeName = 'GA4';

    beforeEach(() => {});

    afterEach(() => {
      delete (window as any)[destSDKIdentifier];
    });

    it('should return false if the destination SDK is not evaluated', () => {
      expect(isDestinationSDKMounted(destSDKIdentifier, sdkTypeName)).toEqual(false);
    });

    it('should return false if the destination SDK is mounted but it is not a constructable type', () => {
      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: 'not a constructable type',
      };

      expect(isDestinationSDKMounted(destSDKIdentifier, sdkTypeName)).toEqual(false);
    });

    it('should return true if the destination SDK is a constructable type', () => {
      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: class {
          // eslint-disable-next-line @typescript-eslint/no-useless-constructor
          constructor() {}
        },
      };

      expect(isDestinationSDKMounted(destSDKIdentifier, sdkTypeName)).toEqual(true);
    });

    it('should return false when SDK identifier exists but no SDK type', () => {
      (window as any)[destSDKIdentifier] = {};

      const result = isDestinationSDKMounted(destSDKIdentifier, sdkTypeName);
      expect(result).toBe(false);
    });

    it('should return false when SDK type exists but no prototype', () => {
      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: {},
      };

      const result = isDestinationSDKMounted(destSDKIdentifier, sdkTypeName);
      expect(result).toBe(false);
    });

    it('should work with logger parameter', () => {
      const result = isDestinationSDKMounted(destSDKIdentifier, sdkTypeName, defaultLogger);
      expect(result).toBe(false);
    });
  });

  describe('applySourceConfigurationOverrides', () => {
    const mockDestinations: Destination[] = [
      {
        id: 'dest1',
        displayName: 'Destination 1',
        userFriendlyId: 'dest1_friendly',
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
        displayName: 'Destination 2',
        userFriendlyId: 'dest2_friendly',
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
        displayName: 'Destination 3',
        userFriendlyId: 'dest3_friendly',
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
      jest.clearAllMocks();
    });

    it('should return original enabled destinations when no override is provided', () => {
      const result = applySourceConfigurationOverrides(mockDestinations, { destinations: [] });
      expect(result).toEqual([mockDestinations[0], mockDestinations[2]]);
    });

    it('should return original enabled destinations when override is undefined', () => {
      const result = applySourceConfigurationOverrides(mockDestinations, undefined as any);
      expect(result).toEqual([mockDestinations[0], mockDestinations[2]]);
    });

    it('should return original enabled destinations when override destinations is undefined', () => {
      const result = applySourceConfigurationOverrides(mockDestinations, {} as any);
      expect(result).toEqual([mockDestinations[0], mockDestinations[2]]);
    });

    it('should apply enabled status override correctly', () => {
      const override = {
        destinations: [
          { id: 'dest1', enabled: false },
          { id: 'dest2', enabled: true },
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toHaveLength(2);
      expect(result[0]?.enabled).toBe(true);
      expect(result[0]?.overridden).toBe(true);
      expect(result[1]?.enabled).toBe(true);
      expect(result[1]?.overridden).toBeUndefined();
    });

    it('should not override when enabled status matches existing value', () => {
      const override = {
        destinations: [
          { id: 'dest1', enabled: true }, // Same as existing
          { id: 'dest2', enabled: false }, // Same as existing
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toHaveLength(2);
      expect(result[0]).toBe(mockDestinations[0]); // Same reference
      expect(result[0]?.enabled).toBe(true);
      expect(result[0]?.overridden).toBeUndefined();
      expect(result[1]).toBe(mockDestinations[2]); // Same reference
    });

    it('should log warning for unmatched destination IDs', () => {
      const override = {
        destinations: [
          { id: 'dest1', enabled: false },
          { id: 'nonexistent1', enabled: true },
          { id: 'nonexistent2', enabled: false },
        ],
      };

      applySourceConfigurationOverrides(mockDestinations, override, defaultLogger);

      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'DeviceModeDestinationsPlugin:: Source configuration override - Unable to identify the destinations with the following IDs: "nonexistent1, nonexistent2"',
      );
    });

    it('should not mutate original destinations', () => {
      const originalDest1 = { ...mockDestinations[0]! };
      const override = {
        destinations: [{ id: 'dest1', enabled: false }],
      };

      applySourceConfigurationOverrides(mockDestinations, override);

      expect(mockDestinations[0]!.enabled).toBe(originalDest1.enabled);
      expect(mockDestinations[0]!.overridden).toBeUndefined();
    });

    it('should handle undefined enabled property in override', () => {
      const override = {
        destinations: [{ id: 'dest1', config: { newProperty: 'value' } }],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result[0]).not.toBe(mockDestinations[0]); // Different reference due to config override
      expect(result[0]?.enabled).toBe(true); // Original value preserved
      expect(result[0]?.overridden).toBe(true); // Marked as overridden due to config changes
      expect((result[0]?.config as any).newProperty).toBe('value'); // Config override applied
    });

    it('should apply config override when destination is enabled via override', () => {
      const override = {
        destinations: [{ id: 'dest2', enabled: true, config: { newProperty: 'value' } }], // dest2 enabled via override
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result[1]).not.toBe(mockDestinations[1]); // Different reference due to override
      expect(result[1]?.enabled).toBe(true); // Enabled via override
      expect(result[1]?.overridden).toBe(true); // Marked as overridden
      expect((result[1]?.config as any).newProperty).toBe('value'); // Config override applied
    });

    it('should handle non-boolean enabled values in override', () => {
      const override = {
        destinations: [
          { id: 'dest1', enabled: 'true' as any }, // Invalid type
          { id: 'dest2', enabled: 1 as any }, // Invalid type
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result[0]).toBe(mockDestinations[0]); // Same reference since no valid changes
      expect(result[0]?.enabled).toBe(true); // Original value preserved
      expect(result[0]?.overridden).toBeUndefined();
      expect(result[1]).toBe(mockDestinations[2]); // Same reference since no valid changes
      expect(result[1]?.enabled).toBe(true); // Original value preserved
      expect(result[1]?.overridden).toBeUndefined();
    });

    it('should handle empty destinations array in override', () => {
      const override = {
        destinations: [],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toEqual([mockDestinations[0], mockDestinations[2]]);
    });

    //  --- Cloning scenario ---
    it('should clone destination when multiple overrides exist for the same destination id', () => {
      const override = {
        destinations: [
          { id: 'dest1', enabled: true, config: { apiKey: 'clone1' } },
          { id: 'dest1', enabled: true, config: { apiKey: 'clone2' } },
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      // Should have 3 destinations: 2 clones for dest1, dest3
      expect(result).toHaveLength(3);

      // Both clones should be marked as cloned and 2nd clones config should be updated
      const dest1Clones = result.filter(d => d.id.startsWith('dest1'));
      expect(dest1Clones).toHaveLength(2);
      expect(dest1Clones[0]?.cloned).toBe(true);
      expect(dest1Clones[1]?.cloned).toBe(true);
      expect(dest1Clones[0]?.config.apiKey).toBe('clone1');
      expect(dest1Clones[1]?.config.apiKey).toBe('clone2');
      // Enabled status should match override
      expect(dest1Clones[0]?.enabled).toBe(true);
      expect(dest1Clones[1]?.enabled).toBe(true);

      // dest2 and dest3 should be unchanged
      expect(result.find(d => d.id === 'dest3')).toBe(mockDestinations[2]);
    });

    it('should clone destination and assign unique ids/userFriendlyIds for each clone', () => {
      const override = {
        destinations: [
          { id: 'dest2', enabled: true, config: { apiKey: 'cloneA' } },
          { id: 'dest2', enabled: false, config: { apiKey: 'cloneB' } },
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      // Should have 3 destinations: 1 clones for dest2, dest1, dest3
      expect(result).toHaveLength(3);

      const dest2Clones = result.filter(d => d.id.startsWith('dest2'));
      expect(dest2Clones).toHaveLength(1);

      // Each clone should have a unique id and userFriendlyId
      expect(dest2Clones[0]).toBeDefined();
      expect(dest2Clones[0]?.id).toBe('dest2_1');
      expect(dest2Clones[0]?.userFriendlyId).toBe('dest2_friendly_1');

      // Config and enabled status should match each override
      expect(dest2Clones[0]?.config.apiKey).toBe('cloneA');
      expect([true, false]).toContain(dest2Clones[0]?.enabled);

      // dest1 and dest3 should be unchanged
      expect(result.find(d => d.id === 'dest1')).toBe(mockDestinations[0]);
      expect(result.find(d => d.id === 'dest3')).toBe(mockDestinations[2]);
    });

    it('should clone destination for each override and preserve other properties', () => {
      const override = {
        destinations: [
          { id: 'dest3', enabled: true, config: { apiKey: 'A' } },
          { id: 'dest3', enabled: true, config: { apiKey: 'B', extra: 123 } },
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      // Should have 3 destinations: 2 clones for dest3, dest1
      expect(result).toHaveLength(3);

      const dest3Clones = result.filter(d => d.id.startsWith('dest3'));
      expect(dest3Clones).toHaveLength(2);

      // Properties from original should be preserved
      dest3Clones.forEach(clone => {
        expect(clone.displayName).toBe('Destination 3');
        expect(clone.shouldApplyDeviceModeTransformation).toBe(true);
        expect(clone.propagateEventsUntransformedOnError).toBe(false);
        expect(clone.cloned).toBe(true);
      });

      // Config and enabled status should match each override
      expect(dest3Clones[0]?.config?.apiKey).toBe('A');
      expect(dest3Clones[1]?.config?.apiKey).toBe('B');
      expect(dest3Clones[1]?.config?.extra).toBe(123);
      expect(dest3Clones[0]?.enabled).toBe(true);
      expect(dest3Clones[1]?.enabled).toBe(true);
      // inherit other config properties
      expect(dest3Clones[0]?.config?.eventFilteringOption).toBe('disable');
      expect(dest3Clones[1]?.config?.eventFilteringOption).toBe('disable');
      expect(dest3Clones[0]?.config?.blacklistedEvents).toEqual([]);
      expect(dest3Clones[1]?.config?.blacklistedEvents).toEqual([]);
      expect(dest3Clones[0]?.config?.whitelistedEvents).toEqual([]);
      expect(dest3Clones[1]?.config?.whitelistedEvents).toEqual([]);

      // dest1 should be unchanged
      expect(result.find(d => d.id === 'dest1')).toBe(mockDestinations[0]);
    });

    //   ---- Filter destination ----
    it('should filter out destinations that are not enabled', () => {
      const override = {
        destinations: [
          { id: 'dest1', enabled: true },
          { id: 'dest2', enabled: false }, // This should be filtered out
          { id: 'dest3', enabled: true },
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe('dest1');
      expect(result[1]?.id).toBe('dest3');
    });

    it('should filter out destinations that are not enabled even if they have config overrides', () => {
      const override = {
        destinations: [
          { id: 'dest2', enabled: true },
          { id: 'dest1', enabled: false, config: { newProperty: 'value' } }, // This should be filtered out
          { id: 'dest3', enabled: true },
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe('dest2');
      expect(result[1]?.id).toBe('dest3');
    });

    it('should not filter out destinations that are enabled', () => {
      const override = {
        destinations: [
          { id: 'dest1', enabled: true },
          { id: 'dest2', enabled: true }, // This should not be filtered out
          { id: 'dest3', enabled: true },
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toHaveLength(3);
      expect(result[0]?.id).toBe('dest1');
      expect(result[1]?.id).toBe('dest2');
      expect(result[2]?.id).toBe('dest3');
    });

    it('should filter out original destinations that are not enabled when override destination is provided', () => {
      const override = {
        destinations: [
          { id: 'dest1', enabled: true, config: { newProperty: 'value' } }, // This should be included
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe('dest1');
      expect(result[1]?.id).toBe('dest3');
    });

    it('should filter out original destinations that are not enabled when override destination is empty', () => {
      const override = {
        destinations: [],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe('dest1');
      expect(result[1]?.id).toBe('dest3');
    });

    it('should apply multiple overrides to different destinations', () => {
      const override: SourceConfigurationOverride = {
        destinations: [
          { id: 'dest1', enabled: false },
          { id: 'dest2', enabled: true },
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toHaveLength(2);
      expect(result[0]!.enabled).toBe(true);
      expect(result[0]!.overridden).toBe(true);
      expect(result[1]!.enabled).toBe(true);
      expect(result[1]!.overridden).toBeUndefined();
    });

    it('should not log warning when all destination IDs match', () => {
      const mockWarn = jest.fn();
      const mockLogger = { warn: mockWarn } as any;

      const override: SourceConfigurationOverride = {
        destinations: [
          { id: 'dest1', enabled: false },
          { id: 'dest2', enabled: true },
        ],
      };

      applySourceConfigurationOverrides(mockDestinations, override, mockLogger);

      expect(mockWarn).not.toHaveBeenCalled();
    });

    it('should work without logger parameter', () => {
      const override: SourceConfigurationOverride = {
        destinations: [{ id: 'nonexistent', enabled: true }],
      };

      expect(() => {
        applySourceConfigurationOverrides(mockDestinations, override);
      }).not.toThrow();
    });

    it('should handle empty destinations array', () => {
      const override: SourceConfigurationOverride = {
        destinations: [{ id: 'dest1', enabled: false }],
      };

      const result = applySourceConfigurationOverrides([], override);
      expect(result).toEqual([]);
    });

    it('should handle complex override scenarios', () => {
      const override: SourceConfigurationOverride = {
        destinations: [
          { id: 'dest1', enabled: false },
          { id: 'nonexistent', enabled: true },
        ],
      };

      const mockLogger = { warn: jest.fn() } as any;
      const result = applySourceConfigurationOverrides(mockDestinations, override, mockLogger);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockDestinations[2]); // unchanged

      expect(mockLogger.warn).toHaveBeenCalledWith(expect.stringContaining('nonexistent'));
    });
  });

  describe('applyOverrideToDestination', () => {
    const mockDestination: Destination = {
      id: 'dest1',
      displayName: 'Destination 1',
      userFriendlyId: 'dest1_friendly',
      enabled: true,
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      config: {
        apiKey: 'key1',
        blacklistedEvents: [],
        whitelistedEvents: [],
        eventFilteringOption: 'disable' as const,
      },
    };

    it('should return original destination when enabled status matches and no config override', () => {
      const override = { id: 'dest1', enabled: true };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).toBe(mockDestination); // Same reference
      expect(result.overridden).toBeUndefined();
    });

    it('should clone and override enabled status when different', () => {
      const override = { id: 'dest1', enabled: false };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).not.toBe(mockDestination); // Different reference
      expect(result.enabled).toBe(false);
      expect(result.overridden).toBe(true);
      expect(mockDestination.enabled).toBe(true); // Original unchanged
    });

    it('should clone when config override is provided even if enabled status matches', () => {
      const override = {
        id: 'dest1',
        enabled: true,
        config: { newProperty: 'value' },
      };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).not.toBe(mockDestination); // Different reference due to config override
      expect(result.enabled).toBe(true);
      expect(result.overridden).toBe(true); // Marked as overridden due to config changes
      expect((result.config as any).newProperty).toBe('value'); // Config override applied
    });

    it('should return original destination when no changes needed', () => {
      const override = { id: 'dest1' }; // No enabled or config specified
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).toBe(mockDestination); // Same reference since no changes
      expect(result.overridden).toBeUndefined();
    });

    it('should return original destination when empty config override provided', () => {
      const override = { id: 'dest1', config: {} }; // Empty config object
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).toBe(mockDestination); // Same reference since no actual changes
      expect(result.overridden).toBeUndefined();
    });

    it('should handle non-boolean enabled values', () => {
      const override = { id: 'dest1', enabled: 'false' as any }; // Invalid type
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).toBe(mockDestination); // Same reference since invalid enabled value
      expect(result.enabled).toBe(true); // Original value preserved
      expect(result.overridden).toBeUndefined();
    });

    it('should handle undefined enabled value', () => {
      const override = { id: 'dest1', enabled: undefined };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).toBe(mockDestination); // Same reference since no valid changes
      expect(result.enabled).toBe(true); // Original value preserved
      expect(result.overridden).toBeUndefined();
    });

    it('should handle null enabled value', () => {
      const override = { id: 'dest1', enabled: null as any };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).toBe(mockDestination); // Same reference since invalid enabled value
      expect(result.enabled).toBe(true); // Original value preserved
      expect(result.overridden).toBeUndefined();
    });

    it('should clone destination when cloneId is provided even with no other changes', () => {
      const override = { id: 'dest1', enabled: true }; // Same as existing
      const result = applyOverrideToDestination(mockDestination, override, 'clone1');

      expect(result).not.toBe(mockDestination); // Different reference due to cloneId
      expect(result.id).toBe('dest1_clone1');
      expect(result.userFriendlyId).toBe('dest1_friendly_clone1');
      expect(result.enabled).toBe(true);
      expect(result.overridden).toBeUndefined(); // No override applied, just cloned
    });

    it('should clone and override when both cloneId and enabled change are provided', () => {
      const override = { id: 'dest1', enabled: false };
      const result = applyOverrideToDestination(mockDestination, override, 'clone1');

      expect(result).not.toBe(mockDestination); // Different reference
      expect(result.id).toBe('dest1_clone1');
      expect(result.userFriendlyId).toBe('dest1_friendly_clone1');
      expect(result.enabled).toBe(false);
      expect(result.overridden).toBe(true);
    });

    it('should preserve all other destination properties when cloning', () => {
      const override = { id: 'dest1', enabled: false };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result.displayName).toBe(mockDestination.displayName);
      expect(result.shouldApplyDeviceModeTransformation).toBe(
        mockDestination.shouldApplyDeviceModeTransformation,
      );
      expect(result.propagateEventsUntransformedOnError).toBe(
        mockDestination.propagateEventsUntransformedOnError,
      );
      expect(result.config).toEqual(mockDestination.config);
      expect(result.config).not.toBe(mockDestination.config); // Deep cloned
    });

    // Config override specific tests
    it('should apply config overrides correctly', () => {
      const override = {
        id: 'dest1',
        config: {
          newProperty: 'newValue',
          apiKey: 'overriddenKey', // Override existing property
        },
      };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).not.toBe(mockDestination);
      expect(result.overridden).toBe(true);
      expect((result.config as any).newProperty).toBe('newValue');
      expect(result.config.apiKey).toBe('overriddenKey');
      expect(result.config.eventFilteringOption).toBe('disable'); // Inherited property
    });

    it('should remove properties when config value is null', () => {
      const override = {
        id: 'dest1',
        config: {
          apiKey: null, // Remove this property
          newProperty: 'value',
        },
      };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).not.toBe(mockDestination);
      expect(result.overridden).toBe(true);
      expect(result.config.apiKey).toBeUndefined(); // Property removed
      expect((result.config as any).newProperty).toBe('value');
      expect(result.config.eventFilteringOption).toBe('disable'); // Inherited property
    });

    it('should remove properties when config value is undefined', () => {
      const override = {
        id: 'dest1',
        config: {
          apiKey: undefined, // Remove this property
          newProperty: 'value',
        },
      };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).not.toBe(mockDestination);
      expect(result.overridden).toBe(true);
      expect(result.config.apiKey).toBeUndefined(); // Property removed
      expect((result.config as any).newProperty).toBe('value');
      expect(result.config.eventFilteringOption).toBe('disable'); // Inherited property
    });

    it('should handle data type changes in config override', () => {
      const override = {
        id: 'dest1',
        config: {
          apiKey: { nested: 'object' }, // String to object
          blacklistedEvents: 'stringValue', // Array to string
        },
      };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).not.toBe(mockDestination);
      expect(result.overridden).toBe(true);
      expect(result.config.apiKey).toEqual({ nested: 'object' });
      expect(result.config.blacklistedEvents).toBe('stringValue');
    });

    it('should combine enabled and config overrides when destination remains enabled', () => {
      const override = {
        id: 'dest1',
        enabled: true,
        config: {
          newProperty: 'value',
        },
      };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).not.toBe(mockDestination);
      expect(result.enabled).toBe(true);
      expect(result.overridden).toBe(true);
      expect((result.config as any).newProperty).toBe('value');
    });

    it('should not apply config override when destination is disabled via enabled override', () => {
      const override = {
        id: 'dest1',
        enabled: false,
        config: {
          newProperty: 'value',
        },
      };
      const result = applyOverrideToDestination(mockDestination, override);

      expect(result).not.toBe(mockDestination);
      expect(result.enabled).toBe(false);
      expect(result.overridden).toBe(true); // Marked as overridden due to enabled change
      expect((result.config as any).newProperty).toBeUndefined(); // Config override not applied
      expect(result.config).toEqual(mockDestination.config); // Config unchanged
    });

    it('should not apply config override to originally disabled destination', () => {
      const disabledDestination: Destination = {
        ...mockDestination,
        enabled: false,
      };
      const override = {
        id: 'dest1',
        config: {
          newProperty: 'value',
        },
      };
      const result = applyOverrideToDestination(disabledDestination, override);

      expect(result).toBe(disabledDestination); // Same reference since no changes applied
      expect(result.enabled).toBe(false);
      expect(result.overridden).toBeUndefined(); // Not marked as overridden
      expect((result.config as any).newProperty).toBeUndefined(); // Config override not applied
    });

    it('should clone destination when cloneId is provided', () => {
      const override: SourceConfigurationOverrideDestination = { id: 'dest1' };
      const cloneId = 'clone1';

      const result = applyOverrideToDestination(mockDestination, override, cloneId);

      expect(result).not.toBe(mockDestination); // Different reference
      expect(result.id).toBe('dest1_clone1');
      expect(result.userFriendlyId).toBe('dest1_friendly_clone1');
      expect(result.enabled).toBe(mockDestination.enabled); // Same enabled status
      expect(result.overridden).toBeUndefined(); // No override flag since only cloneId
    });

    it('should clone and override when both cloneId and enabled are provided', () => {
      const override: SourceConfigurationOverrideDestination = {
        id: 'dest1',
        enabled: false,
      };
      const cloneId = 'clone1';

      const result = applyOverrideToDestination(mockDestination, override, cloneId);

      expect(result).not.toBe(mockDestination); // Different reference
      expect(result.id).toBe('dest1_clone1');
      expect(result.userFriendlyId).toBe('dest1_friendly_clone1');
      expect(result.enabled).toBe(false);
      expect(result.overridden).toBe(true);
    });

    it('should deep clone the destination config', () => {
      const override: SourceConfigurationOverrideDestination = {
        id: 'dest1',
        enabled: false,
      };

      const result = applyOverrideToDestination(mockDestination, override);

      expect(result.config).toEqual(mockDestination.config);
      expect(result.config).not.toBe(mockDestination.config); // Different reference
    });

    it('should handle complex cloneId values', () => {
      const override: SourceConfigurationOverrideDestination = { id: 'dest1' };
      const cloneId = 'complex_clone-123';

      const result = applyOverrideToDestination(mockDestination, override, cloneId);

      expect(result.id).toBe('dest1_complex_clone-123');
      expect(result.userFriendlyId).toBe('dest1_friendly_complex_clone-123');
    });
  });

  describe('filterDisabledDestination', () => {
    it('should return only enabled destinations', () => {
      const destinations = [
        { id: '1', enabled: true },
        { id: '2', enabled: false },
        { id: '3', enabled: true },
      ] as any[];

      const result = filterDisabledDestination(destinations);

      expect(result).toHaveLength(2);
      expect(result.every(dest => dest.enabled)).toBe(true);
      expect(result.map(d => d.id)).toEqual(['1', '3']);
    });

    it('should return empty array if all destinations are disabled', () => {
      const destinations = [
        { id: '1', enabled: false },
        { id: '2', enabled: false },
      ] as any[];

      const result = filterDisabledDestination(destinations);

      expect(result).toEqual([]);
    });

    it('should return all destinations if all are enabled', () => {
      const destinations = [
        { id: '1', enabled: true },
        { id: '2', enabled: true },
      ] as any[];

      const result = filterDisabledDestination(destinations);

      expect(result).toHaveLength(2);
      expect(result.map(d => d.id)).toEqual(['1', '2']);
    });

    it('should return empty array if input is empty', () => {
      const result = filterDisabledDestination([]);

      expect(result).toEqual([]);
    });
  });
  describe('getCumulativeIntegrationsConfig', () => {
    it('should return the cumulative integrations config', () => {
      const destination = {
        instance: {
          getDataForIntegrationsObject: () => ({
            GA4: {
              client_id: '1234567890',
            },
          }),
        },
        userFriendlyId: 'GA4___1234567890',
      } as unknown as Destination;

      const currentIntegrationsConfig = {
        Amplitude: {
          someKey: 'someValue',
        },
      };

      const integrationsConfig = getCumulativeIntegrationsConfig(
        destination,
        currentIntegrationsConfig,
      );
      expect(integrationsConfig).toEqual({
        GA4: {
          client_id: '1234567890',
        },
        Amplitude: {
          someKey: 'someValue',
        },
      });
    });

    it('should return the current integrations config if the destination does not have a getDataForIntegrationsObject method', () => {
      const destination = {
        instance: {},
        userFriendlyId: 'GA4___1234567890',
      } as unknown as Destination;

      const currentIntegrationsConfig = {
        Amplitude: {
          someKey: 'someValue',
        },
      };

      const integrationsConfig = getCumulativeIntegrationsConfig(
        destination,
        currentIntegrationsConfig,
      );
      expect(integrationsConfig).toEqual(currentIntegrationsConfig);
    });

    it('should handle errors thrown by the getDataForIntegrationsObject method', () => {
      const destination = {
        instance: {
          getDataForIntegrationsObject: () => {
            throw new Error('Error');
          },
        },
        userFriendlyId: 'GA4___1234567890',
        displayName: 'Google Analytics 4 (GA4)',
      } as unknown as Destination;

      const currentIntegrationsConfig = {
        Amplitude: {
          someKey: 'someValue',
        },
      };

      const integrationsConfig = getCumulativeIntegrationsConfig(
        destination,
        currentIntegrationsConfig,
        defaultErrorHandler,
      );
      expect(integrationsConfig).toEqual(currentIntegrationsConfig);

      expect(defaultErrorHandler.onError).toHaveBeenCalledWith({
        error: new Error('Error'),
        context: 'DeviceModeDestinationsPlugin',
        customMessage: 'Failed to get integrations data for destination "GA4___1234567890".',
        groupingHash: 'Failed to get integrations data for destination "Google Analytics 4 (GA4)".',
      });
    });

    it('should handle null or undefined destination instance', () => {
      const destination = {
        instance: null,
        userFriendlyId: 'GA4___1234567890',
      } as unknown as Destination;

      const currentConfig = { Amplitude: { key: 'value' } };

      const result = getCumulativeIntegrationsConfig(destination, currentConfig);

      expect(result).toEqual(currentConfig);
    });

    it('should handle destination instance without getDataForIntegrationsObject method', () => {
      const destination = {
        instance: { someOtherMethod: () => {} },
        userFriendlyId: 'GA4___1234567890',
      } as unknown as Destination;

      const currentConfig = { Amplitude: { key: 'value' } };

      const result = getCumulativeIntegrationsConfig(destination, currentConfig);

      expect(result).toEqual(currentConfig);
    });

    it('should merge data from getDataForIntegrationsObject', () => {
      const destination = {
        instance: {
          getDataForIntegrationsObject: () => ({
            GA4: { client_id: '12345' },
            NewIntegration: { data: 'test' },
          }),
        },
        userFriendlyId: 'GA4___1234567890',
      } as unknown as Destination;

      const currentConfig = {
        Amplitude: { key: 'value' },
      };

      const result = getCumulativeIntegrationsConfig(destination, currentConfig);

      expect(result).toEqual({
        Amplitude: { key: 'value' },
        GA4: { client_id: '12345' },
        NewIntegration: { data: 'test' },
      });
    });

    it('should handle getDataForIntegrationsObject returning null/undefined', () => {
      const destination = {
        instance: {
          getDataForIntegrationsObject: () => null,
        },
        userFriendlyId: 'GA4___1234567890',
      } as unknown as Destination;

      const currentConfig = { Amplitude: { key: 'value' } };

      const result = getCumulativeIntegrationsConfig(destination, currentConfig);

      expect(result).toEqual(currentConfig);
    });

    it('should work without error handler parameter', () => {
      const destination = {
        instance: {
          getDataForIntegrationsObject: () => {
            throw new Error('Test error');
          },
        },
        userFriendlyId: 'GA4___1234567890',
      } as unknown as Destination;

      const currentConfig = { Amplitude: { key: 'value' } };

      expect(() => {
        getCumulativeIntegrationsConfig(destination, currentConfig);
      }).not.toThrow();
    });
  });

  describe('initializeDestination', () => {
    const destSDKIdentifier = 'GA4_RS';
    const sdkTypeName = 'GA4';
    const initMock = jest.fn();

    beforeEach(() => {
      // Mock the SDK instance
      (window as any).rudderanalytics = {
        getAnalyticsInstance: () => {
          return {};
        },
      };

      // Mock the destination SDK
      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: class {
          // eslint-disable-next-line @typescript-eslint/no-useless-constructor
          constructor() {}
          init = initMock;
        },
      };
    });

    afterEach(() => {
      initMock.mockClear();

      delete (window as any)[destSDKIdentifier];
      delete (window as any).rudderanalytics;
    });

    it('should initialize the destination', () => {
      const destination = {
        userFriendlyId: 'GA4___1234567890',
        displayName: 'Google Analytics 4 (GA4)',
      } as unknown as Destination;

      initializeDestination(
        destination,
        state,
        destSDKIdentifier,
        sdkTypeName,
        defaultErrorHandler,
      );

      expect(initMock).toHaveBeenCalledTimes(1);
    });

    it('should handle errors thrown by the integration during initialization', () => {
      // Mock the destination SDK
      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: class {
          // eslint-disable-next-line @typescript-eslint/no-useless-constructor
          constructor() {}
          init = () => {
            throw new Error('Error');
          };
        },
      };

      const destination = {
        userFriendlyId: 'GA4___1234567890',
        displayName: 'Google Analytics 4 (GA4)',
      } as unknown as Destination;

      initializeDestination(
        destination,
        state,
        destSDKIdentifier,
        sdkTypeName,
        defaultErrorHandler,
      );

      expect(defaultErrorHandler.onError).toHaveBeenCalledWith({
        error: new Error('Error'),
        context: 'DeviceModeDestinationsPlugin',
        customMessage: 'Failed to initialize integration for destination "GA4___1234567890".',
        groupingHash:
          'Failed to initialize integration for destination "Google Analytics 4 (GA4)".',
      });
    });

    it('should handle when the integration does not get ready on time', done => {
      jest.useFakeTimers();
      jest.setSystemTime(0);

      // Mock the destination SDK
      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: class {
          // eslint-disable-next-line @typescript-eslint/no-useless-constructor
          constructor() {}
          init = () => initMock();
          isReady = () => false;
        },
      };

      const destination = {
        userFriendlyId: 'GA4___1234567890',
        displayName: 'Google Analytics 4 (GA4)',
      } as unknown as Destination;

      initializeDestination(
        destination,
        state,
        destSDKIdentifier,
        sdkTypeName,
        defaultErrorHandler,
      );

      // Fast-forward the timers to cause a timeout
      jest.advanceTimersByTime(11000);

      // Just asynchronously wait for the next tick to ensure that the error handler is called
      setTimeout(() => {
        expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
        expect(defaultErrorHandler.onError).toHaveBeenCalledWith({
          error: new Error('A timeout of 11000 ms occurred'),
          context: 'DeviceModeDestinationsPlugin',
          customMessage:
            'Failed to get the ready status from integration for destination "GA4___1234567890"',
          groupingHash:
            'Failed to get the ready status from integration for destination "Google Analytics 4 (GA4)"',
        });

        jest.useRealTimers();

        done();
      }, 1);

      // Fast-forward the timers to the next tick asynchronously
      jest.advanceTimersByTimeAsync(1);
    });
  });
});
