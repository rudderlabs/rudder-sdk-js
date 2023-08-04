import {
  getNonCloudDestinations,
  isNonCloudDestination,
  isHybridModeDestination,
  normalizeIntegrationOptions,
} from '@rudderstack/analytics-js-common/utilities/destinations';
import { dummySourceConfigResponse } from '../../__fixtures__/fixtures';

describe('Config manager util - filterEnabledDestination', () => {
  it('should get non-cloud destinations', () => {
    const actualOutcome = getNonCloudDestinations(dummySourceConfigResponse.source.destinations);
    expect(actualOutcome.length).toBe(3);
  });

  it('should detect if destination is non-cloud', () => {
    const hybridDestination = isNonCloudDestination(
      dummySourceConfigResponse.source.destinations[0],
    );
    expect(hybridDestination).toBeTruthy();

    const nativeDest = isNonCloudDestination(dummySourceConfigResponse.source.destinations[1]);
    expect(nativeDest).toBeTruthy();

    const cloudDest = isNonCloudDestination(dummySourceConfigResponse.source.destinations[2]);
    expect(cloudDest).toBeFalsy();
  });

  it('should detect if a destination is hybrid', () => {
    const hybridDestination = isHybridModeDestination(
      dummySourceConfigResponse.source.destinations[0],
    );
    expect(hybridDestination).toBeTruthy();

    const nativeDest = isHybridModeDestination(dummySourceConfigResponse.source.destinations[1]);
    expect(nativeDest).toBeFalsy();

    const cloudDest = isHybridModeDestination(dummySourceConfigResponse.source.destinations[2]);
    expect(cloudDest).toBeFalsy();

    const hybridDestination2 = isHybridModeDestination(
      dummySourceConfigResponse.source.destinations[3],
    );
    expect(hybridDestination2).toBeTruthy();
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
});
