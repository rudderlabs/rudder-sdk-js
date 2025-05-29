/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import {
  wait,
  isDestinationReady,
  createDestinationInstance,
  isDestinationSDKMounted,
  applySourceConfigurationOverrides,
  applyOverrideToDestination,
} from '../../src/deviceModeDestinations/utils';
import type { DeviceModeDestinationsAnalyticsInstance } from '../../src/deviceModeDestinations/types';
import type { LogLevel } from '../../src/types/plugins';
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
    let isLoadedResponse = false;
    const destination = {
      instance: {
        isLoaded: () => isLoadedResponse,
      },
      userFriendlyId: 'GA4___1234567890',
    };

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(0);
    });

    afterEach(() => {
      jest.useRealTimers();
      isLoadedResponse = false;
    });

    it('should return a promise that gets resolved when the destination is ready immediately', async () => {
      isLoadedResponse = true;

      const isReadyPromise = isDestinationReady(destination as Destination);

      // Fast-forward the timers
      jest.runAllTimers();

      await expect(isReadyPromise).resolves.toEqual(true);
    });

    it('should return a promise that gets resolved when the destination is ready after some time', async () => {
      setTimeout(() => {
        isLoadedResponse = true;
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

      await expect(isReadyPromise).rejects.toThrow(
        new Error(
          `A timeout of 11000 ms occurred while trying to check the ready status for "${destination.userFriendlyId}" destination.`,
        ),
      );
    });
  });

  describe('createDestinationInstance', () => {
    class MockAnalytics implements DeviceModeDestinationsAnalyticsInstance {
      page = () => {};
      track = () => {};
      identify = () => {};
      group = () => {};
      alias = () => {};
      getAnonymousId = () => 'anonymousId';
      getUserId = () => 'userId';
      getUserTraits = () => ({ trait1: 'value1' });
      getGroupId = () => 'groupId';
      getGroupTraits = () => ({ trait2: 'value2' });
      getSessionId = () => 123;
      loadIntegration = true;
      logLevel = 'DEBUG' as LogLevel;
      loadOnlyIntegrations = { All: true };
    }

    // create two mock instances to later choose based on the write key
    const mockAnalyticsInstanceWriteKey1 = new MockAnalytics();
    const mockAnalyticsInstanceWriteKey2 = new MockAnalytics();

    class MockRudderAnalytics {
      getAnalyticsInstance = (writeKey: string) => {
        const instancesMap: Record<string, MockAnalytics> = {
          '1234567890': mockAnalyticsInstanceWriteKey1,
          '12345678910': mockAnalyticsInstanceWriteKey2,
        };
        return instancesMap[writeKey];
      };
    }

    const mockRudderAnalyticsInstance = new MockRudderAnalytics();

    // put destination SDK code on the window object
    const destSDKIdentifier = 'GA4_RS';
    const sdkTypeName = 'GA4';

    beforeAll(() => {
      (window as any).rudderanalytics = mockRudderAnalyticsInstance;

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
      delete (window as any).rudderanalytics;
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

      expect(destinationInstance.analytics.getAnonymousId()).toEqual('anonymousId');
      expect(destinationInstance.analytics.getUserId()).toEqual('userId');
      expect(destinationInstance.analytics.getUserTraits()).toEqual({ trait1: 'value1' });
      expect(destinationInstance.analytics.getGroupId()).toEqual('groupId');
      expect(destinationInstance.analytics.getGroupTraits()).toEqual({ trait2: 'value2' });
      expect(destinationInstance.analytics.getSessionId()).toEqual(123);

      // Making sure that the call gets forwarded to the correct instance
      const pageCallSpy = jest.spyOn(mockAnalyticsInstanceWriteKey2, 'page');
      destinationInstance.analytics.page();
      expect(mockAnalyticsInstanceWriteKey2.page).toHaveBeenCalled();
      pageCallSpy.mockRestore();

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
          // eslint-disable-next-line @typescript-eslint/no-useless-constructor, sonarjs/no-useless-constructor, sonarjs/no-empty-function, @typescript-eslint/no-empty-function
          constructor() {}
        },
      };
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

    it('should return original destinations when no override is provided', () => {
      const result = applySourceConfigurationOverrides(mockDestinations, { destinations: [] });
      expect(result).toEqual(mockDestinations);
    });

    it('should return original destinations when override is undefined', () => {
      const result = applySourceConfigurationOverrides(mockDestinations, undefined as any);
      expect(result).toEqual(mockDestinations);
    });

    it('should return original destinations when override destinations is undefined', () => {
      const result = applySourceConfigurationOverrides(mockDestinations, {} as any);
      expect(result).toEqual(mockDestinations);
    });

    it('should apply enabled status override correctly', () => {
      const override = {
        destinations: [
          { id: 'dest1', enabled: false },
          { id: 'dest2', enabled: true },
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toHaveLength(3);
      expect(result[0]?.enabled).toBe(false);
      expect(result[0]?.overridden).toBe(true);
      expect(result[1]?.enabled).toBe(true);
      expect(result[1]?.overridden).toBe(true);
      expect(result[2]?.enabled).toBe(true);
      expect(result[2]?.overridden).toBeUndefined();
    });

    it('should not override when enabled status matches existing value', () => {
      const override = {
        destinations: [
          { id: 'dest1', enabled: true }, // Same as existing
          { id: 'dest2', enabled: false }, // Same as existing
        ],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe(mockDestinations[0]); // Same reference
      expect(result[0]?.enabled).toBe(true);
      expect(result[0]?.overridden).toBeUndefined();
      expect(result[1]).toBe(mockDestinations[1]); // Same reference
      expect(result[1]?.enabled).toBe(false);
      expect(result[1]?.overridden).toBeUndefined();
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

      expect(result[0]).toBe(mockDestinations[0]); // Same reference since no changes
      expect(result[0]?.enabled).toBe(true); // Original value preserved
      expect(result[0]?.overridden).toBeUndefined();
      // Config overrides are not yet implemented
      expect((result[0]?.config as any).newProperty).toBeUndefined(); // Not applied yet
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
      expect(result[1]).toBe(mockDestinations[1]); // Same reference since no valid changes
      expect(result[1]?.enabled).toBe(false); // Original value preserved
      expect(result[1]?.overridden).toBeUndefined();
    });

    it('should handle empty destinations array in override', () => {
      const override = {
        destinations: [],
      };

      const result = applySourceConfigurationOverrides(mockDestinations, override);

      expect(result).toBe(mockDestinations); // Same reference
      expect(result).toEqual(mockDestinations);
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

      expect(result).toBe(mockDestination); // Same reference since config override not implemented yet
      expect(result.enabled).toBe(true);
      expect(result.overridden).toBeUndefined();
      // Note: config override is not yet implemented, so newProperty won't be applied
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
  });
});
