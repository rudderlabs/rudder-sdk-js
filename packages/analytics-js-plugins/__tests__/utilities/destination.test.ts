import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import { filterDestinations } from '../../src/utilities/destination';

describe('Destination Utilities', () => {
  describe('filterDestinations', () => {
    const destinations: Destination[] = [
      {
        name: 'GA4',
        displayName: 'Google Analytics 4 (GA4)',
      } as unknown as Destination,
      {
        name: 'BRAZE',
        displayName: 'Braze',
      } as unknown as Destination,
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
        // Intentionally, set a truthy value for Braze
        Braze: [1, 2, 3],
      } as unknown as IntegrationOpts;

      const filteredDestinations = filterDestinations(loadOptions, destinations);

      expect(filteredDestinations).toEqual(destinations);
    });

    it('should not return destinations whose values are specified as falsy in the load options', () => {
      const configDestinations: Destination[] = [
        {
          name: 'GA4',
          displayName: 'Google Analytics 4 (GA4)',
        } as unknown as Destination,
        {
          name: 'BRAZE',
          displayName: 'Braze',
        } as unknown as Destination,
        {
          name: 'AM',
          displayName: 'Amplitude',
        } as unknown as Destination,
      ];

      const loadOptions = {
        All: true,
        'Google Analytics 4 (GA4)': '',
        // Intentionally, set a falsy value for Braze
        Braze: 0,
      } as unknown as IntegrationOpts;

      const filteredDestinations = filterDestinations(loadOptions, configDestinations);

      expect(filteredDestinations).toEqual([
        {
          name: 'AM',
          displayName: 'Amplitude',
        },
      ]);
    });

    it('should default "All" as true if not specified in the load options', () => {
      const loadOptions = {
        'Google Analytics 4 (GA4)': true,
      };

      const filteredDestinations = filterDestinations(loadOptions, destinations);

      expect(filteredDestinations).toEqual([
        {
          name: 'GA4',
          displayName: 'Google Analytics 4 (GA4)',
        },
        {
          name: 'BRAZE',
          displayName: 'Braze',
        },
      ]);
    });
  });
});
