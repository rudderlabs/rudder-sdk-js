import { filterDestinations, normalizeIntegrationOptions } from '@rudderstack/analytics-js-plugins/deviceModeDestinations/utils';

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
        'GA4': true,
        BRAZE: true,
      };

      const normalizedIntegrationOptions = normalizeIntegrationOptions(integrationOptions);

      expect(normalizedIntegrationOptions).toEqual({
        All: true,
        'Google Analytics 4 (GA4)': true,
        'Braze': true,
      });
    });

    it('should return integration options with destinations unmodified that do not have any common names defined', () => {
      const integrationOptions = {
        All: true,
        'GA4': true,
        Braze: true,
        'Some Destination': true,
      };

      const normalizedIntegrationOptions = normalizeIntegrationOptions(integrationOptions);

      expect(normalizedIntegrationOptions).toEqual({
        All: true,
        'Google Analytics 4 (GA4)': true,
        'Braze': true,
        'Some Destination': true,
      });
    });

    it('should return integration options with destinations value unmodified', () => {
      const integrationOptions = {
        All: true,
        'GA4': {
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
        'Braze': [1, 2, 3],
      });
    });

    it('should return integration options with "All" key with always a boolean value', () => {
      const integrationOptions = {
        All: '',
        'GA4': true,
        Braze: true,
      };

      const normalizedIntegrationOptions = normalizeIntegrationOptions(integrationOptions);

      expect(normalizedIntegrationOptions).toEqual({
        All: false,
        'Google Analytics 4 (GA4)': true,
        'Braze': true,
      });
    });

    it('should return integration options with default value for "All" if "All" key is not defined', () => {
      const integrationOptions = {
        'GA4': true,
        Braze: true,
      };

      const normalizedIntegrationOptions = normalizeIntegrationOptions(integrationOptions);

      expect(normalizedIntegrationOptions).toEqual({
        All: true,
        'Google Analytics 4 (GA4)': true,
        'Braze': true,
      });
    });
  });
});
