import {
  filterDestinations,
  normalizeIntegrationOptions,
  wait,
  isDestinationReady,
  createDestinationInstance,
  isDestinationSDKEvaluated,
} from '@rudderstack/analytics-js-plugins/deviceModeDestinations/utils';
import * as dmdConstants from '@rudderstack/analytics-js-plugins/deviceModeDestinations/constants';
import { signal } from '@preact/signals-core';
import { Destination } from '@rudderstack/analytics-js-common/types/Destination';

describe('deviceModeDestinations utils', () => {
  describe('filterDestinations', () => {
    const destinations = [
      {
        name: 'GA4',
        displayName: 'Google Analytics 4 (GA4)',
      },
      {
        name: 'BRAZE',
        displayName: 'Braze',
      },
    ];

    it('return value should not contain destinations that are specified as false in the load options', () => {
      const loadOptions = {
        All: true,
        'Google Analytics 4 (GA4)': false,
      };

      const filteredDestinations = filterDestinations(loadOptions, destinations);

      expect(filteredDestinations).toEqual([
        {
          name: 'BRAZE',
          displayName: 'Braze',
        },
      ]);
    });

    it('return value should only contain destinations that are specified as true in the load options', () => {
      const loadOptions = {
        All: false,
        'Google Analytics 4 (GA4)': true,
      };

      const filteredDestinations = filterDestinations(loadOptions, destinations);

      expect(filteredDestinations).toEqual([
        {
          name: 'GA4',
          displayName: 'Google Analytics 4 (GA4)',
        },
      ]);
    });

    it('return value should contain all destinations if All is true', () => {
      const loadOptions = {
        All: true,
      };

      const filteredDestinations = filterDestinations(loadOptions, destinations);

      expect(filteredDestinations).toEqual(destinations);
    });

    it('return value should not contain any destinations if All is false', () => {
      const loadOptions = {
        All: false,
      };

      const filteredDestinations = filterDestinations(loadOptions, destinations);

      expect(filteredDestinations).toEqual([]);
    });

    it('should return destinations whose values are specified as truthful in the load options', () => {
      const loadOptions = {
        All: false,
        'Google Analytics 4 (GA4)': {
          customKey: 'customValue',
        },
        Braze: [1, 2, 3],
      };

      const filteredDestinations = filterDestinations(loadOptions, destinations);

      expect(filteredDestinations).toEqual(destinations);
    });

    it('should not return destinations whose values are specified as falsy in the load options', () => {
      const configDestinations = [
        {
          name: 'GA4',
          displayName: 'Google Analytics 4 (GA4)',
        },
        {
          name: 'BRAZE',
          displayName: 'Braze',
        },
        {
          name: 'AM',
          displayName: 'Amplitude',
        },
      ];

      const loadOptions = {
        All: true,
        'Google Analytics 4 (GA4)': '',
        Braze: 0,
      };

      const filteredDestinations = filterDestinations(loadOptions, configDestinations);

      expect(filteredDestinations).toEqual([
        {
          name: 'AM',
          displayName: 'Amplitude',
        },
      ]);
    });
  });

  describe('normalizeIntegrationOptions', () => {
    it('should return integration options with all keys set with destination display names', () => {
      const integrationOptions = {
        All: true,
        GA4: true,
        BRAZE: true,
      };

      const normalizedIntegrationOptions = normalizeIntegrationOptions(integrationOptions);

      expect(normalizedIntegrationOptions).toEqual({
        All: true,
        'Google Analytics 4 (GA4)': true,
        Braze: true,
      });
    });

    it('should return integration options with destinations unmodified that do not have any common names defined', () => {
      const integrationOptions = {
        All: true,
        GA4: true,
        Braze: true,
        'Some Destination': true,
      };

      const normalizedIntegrationOptions = normalizeIntegrationOptions(integrationOptions);

      expect(normalizedIntegrationOptions).toEqual({
        All: true,
        'Google Analytics 4 (GA4)': true,
        Braze: true,
        'Some Destination': true,
      });
    });

    it('should return integration options with destinations value unmodified', () => {
      const integrationOptions = {
        All: true,
        GA4: {
          customKey: 'customValue',
        },
        Braze: [1, 2, 3],
      };

      const normalizedIntegrationOptions = normalizeIntegrationOptions(integrationOptions);

      expect(normalizedIntegrationOptions).toEqual({
        All: true,
        'Google Analytics 4 (GA4)': {
          customKey: 'customValue',
        },
        Braze: [1, 2, 3],
      });
    });

    it('should return integration options with "All" key with always a boolean value', () => {
      const integrationOptions = {
        All: '',
        GA4: true,
        Braze: true,
      };

      const normalizedIntegrationOptions = normalizeIntegrationOptions(integrationOptions);

      expect(normalizedIntegrationOptions).toEqual({
        All: false,
        'Google Analytics 4 (GA4)': true,
        Braze: true,
      });
    });

    it('should return integration options with default value for "All" if "All" key is not defined', () => {
      const integrationOptions = {
        GA4: true,
        Braze: true,
      };

      const normalizedIntegrationOptions = normalizeIntegrationOptions(integrationOptions);

      expect(normalizedIntegrationOptions).toEqual({
        All: true,
        'Google Analytics 4 (GA4)': true,
        Braze: true,
      });
    });
  });

  describe('wait', () => {
    it('should return a promise that resolves after the specified time', async () => {
      const time = 1000;
      const startTime = Date.now();

      await wait(time);

      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(time);
    });

    it('should return a promise that resolves immediately even if the time is 0', async () => {
      const time = 0;
      const startTime = Date.now();

      await wait(time);

      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(time);
    });

    it('should return a promise that resolves immediately even if the time is negative', async () => {
      const time = -1000;
      const startTime = Date.now();

      await wait(time);

      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(0);
    });

    it('should return a promise that resolves immediately even if the time is not a number', async () => {
      const time = '2 seconds';
      const startTime = Date.now();

      await wait(time);

      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('isDestinationReady', () => {
    const originalInitializedCheckTimeout = dmdConstants.INITIALIZED_CHECK_TIMEOUT;
    const originalInitializedPollInterval = dmdConstants.LOAD_CHECK_POLL_INTERVAL;
    const destination = {
      instance: {
        isLoaded: () => false,
      },
      userFriendlyId: 'GA4___1234567890',
    };

    beforeEach(() => {
      // temporarily manipulate the timeout and interval constants to speed up the test
      dmdConstants.INITIALIZED_CHECK_TIMEOUT = 200;
      dmdConstants.LOAD_CHECK_POLL_INTERVAL = 100;
    });

    afterEach(() => {
      dmdConstants.INITIALIZED_CHECK_TIMEOUT = originalInitializedCheckTimeout;
      dmdConstants.LOAD_CHECK_POLL_INTERVAL = originalInitializedPollInterval;
      destination.instance.isLoaded = () => false;
    });

    it('should return a promise that gets resolved when the destination is ready immediately', async () => {
      destination.instance.isLoaded = () => true;

      const isReadyPromise = isDestinationReady(destination as Destination);
      await expect(isReadyPromise).resolves.toEqual(true);
    });

    it('should return a promise that gets resolved when the destination is ready after some time', async () => {
      const isReadyPromise = isDestinationReady(destination as Destination);

      await wait(100);

      destination.instance.isLoaded = () => true;

      await expect(isReadyPromise).resolves.toEqual(true);
    });

    it('should return a promise that gets rejected when the destination is not ready after the timeout', async () => {
      const isReadyPromise = isDestinationReady(destination as Destination);

      await expect(isReadyPromise).rejects.toThrow(
        new Error(
          `A timeout of 200 ms occurred while trying to check the ready status for "${destination.userFriendlyId}" destination.`,
        ),
      );
    });
  });

  describe('createDestinationInstance', () => {
    class mockAnalytics {
      page = () => {};
      track = () => {};
      identify = () => {};
      group = () => {};
      alias = () => {};
    }

    // create two mock instances to later choose based on the write key
    const mockAnalyticsInstance_writeKey1 = new mockAnalytics();
    const mockAnalyticsInstance_writeKey2 = new mockAnalytics();

    class mockRudderAnalytics {
      getAnalyticsInstance = writeKey => {
        const instancesMap = {
          '1234567890': mockAnalyticsInstance_writeKey1,
          '12345678910': mockAnalyticsInstance_writeKey2,
        };
        return instancesMap[writeKey];
      };
    }

    const mockRudderAnalyticsInstance = new mockRudderAnalytics();

    // put destination SDK code on the window object
    const destSDKIdentifier = 'GA4_RS';
    const sdkTypeName = 'GA4';

    beforeAll(() => {
      (window as any).rudderanalytics = mockRudderAnalyticsInstance;

      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: class {
          config: any;
          analytics: any;
          constructor(config, analytics) {
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
      const state = {
        nativeDestinations: {
          loadIntegration: signal(true),
          loadOnlyIntegrations: signal({ All: true }),
        },
        lifecycle: {
          logLevel: signal('DEBUG'),
          writeKey: signal('12345678910'), // mockAnalyticsInstance_writeKey2
        },
      };

      const destination = {
        config: {
          apiKey: '1234',
        },
        areTransformationsConnected: false,
        id: 'GA4___5678',
      };

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
        loadOnlyIntegrations: { All: true },
        logLevel: 'DEBUG',
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

      // Making sure that the call gets forwarded to the correct instance
      const pageCallSpy = jest.spyOn(mockAnalyticsInstance_writeKey2, 'page');
      destinationInstance.analytics.page();
      expect(mockAnalyticsInstance_writeKey2.page).toHaveBeenCalled();
      pageCallSpy.mockRestore();
    });
  });

  describe('isDestinationSDKEvaluated', () => {
    const destSDKIdentifier = 'GA4_RS';
    const sdkTypeName = 'GA4';

    beforeEach(() => {});

    afterEach(() => {
      delete (window as any)[destSDKIdentifier];
    });

    class MockLogger implements ILogger {
      warn = jest.fn();
      log = jest.fn();
      error = jest.fn();
      info = jest.fn();
      debug = jest.fn();
      minLogLevel = 0;
      scope = 'test scope';
      setMinLogLevel = jest.fn();
      setScope = jest.fn();
      logProvider = console;
    }

    const mockLogger = new MockLogger();

    it('should return false if the destination SDK is not evaluated', () => {
      expect(isDestinationSDKEvaluated(destSDKIdentifier, sdkTypeName)).toEqual(false);
    });

    it('should return false if the destination SDK is mounted but it is not a constructable type', () => {
      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: 'not a constructable type',
      };

      expect(isDestinationSDKEvaluated(destSDKIdentifier, sdkTypeName)).toEqual(false);
    });

    it('should return true if the destination SDK is a constructable type', () => {
      (window as any)[destSDKIdentifier] = {
        [sdkTypeName]: class {
          constructor() {}
        },
      };
    });
  });
});
