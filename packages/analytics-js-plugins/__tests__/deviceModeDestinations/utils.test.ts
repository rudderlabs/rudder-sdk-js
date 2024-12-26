/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import {
  wait,
  isDestinationReady,
  createDestinationInstance,
  isDestinationSDKMounted,
} from '../../src/deviceModeDestinations/utils';
import type { DeviceModeDestinationsAnalyticsInstance } from '../../src/deviceModeDestinations/types';
import type { LogLevel } from '../../src/types/plugins';
import { resetState, state } from '../../__mocks__/state';

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
});
