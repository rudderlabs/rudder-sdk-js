import { normalizeIntegrationOptions } from '@rudderstack/analytics-js-common/utilities/integrationsOptions';

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
