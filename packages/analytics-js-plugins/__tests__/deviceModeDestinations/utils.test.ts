/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { LogLevel } from '@rudderstack/analytics-js-common/types/Logger';
import type { DeviceModeDestinationsAnalyticsInstance } from '../../src/deviceModeDestinations/types';
import {
  isDestinationReady,
  createDestinationInstance,
  isDestinationSDKMounted,
  getCumulativeIntegrationsConfig,
} from '../../src/deviceModeDestinations/utils';
import { defaultErrorHandler } from '../../__mocks__/ErrorHandler';
import { resetState, state } from '../../__mocks__/state';

describe('deviceModeDestinations utils', () => {
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

    it('should return a promise that gets resolve when the destinations loaded and ready', async () => {
      destination.instance.isLoaded = () => true;

      const isReadyPromise = isDestinationReady(destination as Destination);

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

    it('should return false if the destination SDK is mounted but type is not defined', () => {
      (window as any)[destSDKIdentifier] = {};

      expect(isDestinationSDKMounted(destSDKIdentifier, sdkTypeName)).toEqual(false);
    });

    it('should return false if the destination SDK is mounted but it is not a constructable type', () => {
      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: 'not a constructable type',
      };

      expect(isDestinationSDKMounted(destSDKIdentifier, sdkTypeName)).toEqual(false);
    });

    it('should return false if the destination SDK is mounted but the type does not have a constructor', () => {
      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: {
          prototype: {
            constructor: undefined,
          },
        },
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

  describe('getCumulativeIntegrationsConfig', () => {
    let curIntegrationsConfig: any;

    beforeEach(() => {
      curIntegrationsConfig = {
        Amplitude: false,
      };
    });

    it('should return the input integrations config if the destination does not support any API for integration config', () => {
      const dest = {
        instance: class {},
      } as unknown as Destination;

      const cumulativeIntegrationsConfig = getCumulativeIntegrationsConfig(
        dest,
        curIntegrationsConfig,
      );

      expect(cumulativeIntegrationsConfig).toEqual(curIntegrationsConfig);
    });

    it('should return the input integrations config if the destination API for integrations config is not a function', () => {
      const dest = {
        instance: {
          getDataForIntegrationsObject: 'not a function',
        },
      } as unknown as Destination;

      const cumulativeIntegrationsConfig = getCumulativeIntegrationsConfig(
        dest,
        curIntegrationsConfig,
      );

      expect(cumulativeIntegrationsConfig).toEqual(curIntegrationsConfig);
    });

    it('should return the input integrations config if the destination API throws an error', () => {
      const dest = {
        userFriendlyId: 'DEST_123',
        instance: {
          getDataForIntegrationsObject: () => {
            throw new Error('Some error');
          },
        },
      } as unknown as Destination;

      const cumulativeIntegrationsConfig = getCumulativeIntegrationsConfig(
        dest,
        curIntegrationsConfig,
        defaultErrorHandler,
      );

      expect(cumulativeIntegrationsConfig).toEqual(curIntegrationsConfig);

      // Also, ensure that the error handler is called
      expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
        new Error('Some error'),
        'DeviceModeDestinationsPlugin',
        'Failed to get integrations data for destination "DEST_123".',
      );

      // Also, check the case when the error handler is not provided
      defaultErrorHandler.onError.mockClear();

      const cumulativeIntegrationsConfig2 = getCumulativeIntegrationsConfig(
        dest,
        curIntegrationsConfig,
      );

      expect(cumulativeIntegrationsConfig2).toEqual(curIntegrationsConfig);

      // Also, ensure that the error handler is not called
      // It is already called once above
      expect(defaultErrorHandler.onError).not.toHaveBeenCalled();
    });

    it('should return the combined integrations config after deeply merging the data with the input integrations config', () => {
      const dest = {
        instance: {
          getDataForIntegrationsObject: () => ({
            Mixpanel: {
              someStaticData: '1234',
            },
          }),
        },
      } as unknown as Destination;

      curIntegrationsConfig = {
        Amplitude: false,
      };

      const cumulativeIntegrationsConfig = getCumulativeIntegrationsConfig(
        dest,
        curIntegrationsConfig,
      );

      expect(cumulativeIntegrationsConfig).toEqual({
        Amplitude: false,
        Mixpanel: {
          someStaticData: '1234',
        },
      });
    });
  });
});
