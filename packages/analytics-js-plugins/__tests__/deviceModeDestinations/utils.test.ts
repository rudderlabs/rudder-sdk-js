import {
  filterDestinations,
  normalizeIntegrationOptions,
  wait,
  isDestinationReady,
} from '@rudderstack/analytics-js-plugins/deviceModeDestinations/utils';
import * as dmdConstants from '@rudderstack/analytics-js-plugins/deviceModeDestinations/constants';
import { Destination } from '@rudderstack/analytics-js-plugins/types/common';

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
        new Error(`Destination "${destination.userFriendlyId}" ready check timed out`),
      );
    });
  });
});
