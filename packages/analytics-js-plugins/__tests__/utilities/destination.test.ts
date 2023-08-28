import { filterDestinations } from '@rudderstack/analytics-js-plugins/utilities/destination';

describe('Destination Utilities', () => {
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
});
