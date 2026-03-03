import Optimizely from '../../../src/integrations/Optimizely/browser';

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

const defaultConfig = {
  sendExperimentTrack: true,
  sendExperimentIdentify: true,
  sendExperimentTrackAsNonInteractive: false,
  revenueOnlyOnOrderCompleted: true,
  trackCategorizedPages: true,
  trackNamedPages: true,
};

const mockAnalytics = {
  logLevel: 'debug',
  track: jest.fn(),
  identify: jest.fn(),
};

beforeEach(() => {
  loggerErrorMock = jest.fn();
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
  delete window.optimizely;
  jest.clearAllMocks();
});

describe('Optimizely init tests', () => {
  test('should initialize with correct name and config', () => {
    const optimizely = new Optimizely(defaultConfig, mockAnalytics, destinationInfo);
    optimizely.init();

    expect(optimizely.name).toBe('OPTIMIZELY');
    expect(optimizely.sendExperimentTrack).toBe(true);
    expect(optimizely.trackCategorizedPages).toBe(true);
    expect(optimizely.trackNamedPages).toBe(true);
  });

  test('isLoaded should return false when optimizely is not loaded', () => {
    const optimizely = new Optimizely(defaultConfig, mockAnalytics, destinationInfo);
    optimizely.init();

    expect(optimizely.isLoaded()).toBe(false);
  });

  test('isLoaded should return true when optimizely push is available and not Array prototype', () => {
    window.optimizely = { push: jest.fn() };
    const optimizely = new Optimizely(defaultConfig, mockAnalytics, destinationInfo);

    expect(optimizely.isLoaded()).toBe(true);
  });

  test('isReady should match isLoaded', () => {
    window.optimizely = { push: jest.fn() };
    const optimizely = new Optimizely(defaultConfig, mockAnalytics, destinationInfo);

    expect(optimizely.isReady()).toBe(optimizely.isLoaded());
  });
});

describe('Optimizely getAudienceIdsAndNames', () => {
  let optimizely;

  beforeEach(() => {
    optimizely = new Optimizely(defaultConfig, mockAnalytics, destinationInfo);
  });

  test('should return empty arrays for null or undefined audiences', () => {
    const emptyResult = { audienceIds: [], audienceNames: [] };

    expect(optimizely.getAudienceIdsAndNames(null)).toEqual(emptyResult);
    expect(optimizely.getAudienceIdsAndNames(undefined)).toEqual(emptyResult);
  });

  test('should return empty arrays for non-array audiences', () => {
    const emptyResult = { audienceIds: [], audienceNames: [] };

    expect(optimizely.getAudienceIdsAndNames({})).toEqual(emptyResult);
    expect(optimizely.getAudienceIdsAndNames('not-array')).toEqual(emptyResult);
  });

  test('should handle audiences with valid id and name', () => {
    const audiences = [
      { id: '7527562222', name: 'Peaky Blinders' },
      { id: '7527111138', name: 'Trust Tree' },
    ];
    const result = optimizely.getAudienceIdsAndNames(audiences);

    expect(result.audienceIds).toEqual(['7527111138', '7527562222']);
    expect(result.audienceNames).toEqual(['Peaky Blinders', 'Trust Tree']);
  });

  test('should safely handle null audience names without throwing', () => {
    const audiences = [
      { id: '7527562222', name: 'Peaky Blinders' },
      { id: '7527111138', name: null },
      { id: '7527562223' },
    ];
    const result = optimizely.getAudienceIdsAndNames(audiences);

    expect(result.audienceIds).toEqual(['7527111138', '7527562222', '7527562223']);
    expect(result.audienceNames).toEqual(['Peaky Blinders']);
  });

  test('should safely handle undefined audience names', () => {
    const audiences = [{ id: '123', name: undefined }, null, undefined];
    const result = optimizely.getAudienceIdsAndNames(audiences);

    expect(result.audienceIds).toEqual(['123']);
    expect(result.audienceNames).toEqual([]);
  });

  test('should skip audiences with empty or null id', () => {
    const audiences = [
      { id: '123', name: 'Audience A' },
      { id: null, name: 'Should Skip' },
      { id: '', name: 'Also Skip' },
    ];
    const result = optimizely.getAudienceIdsAndNames(audiences);

    expect(result.audienceIds).toEqual(['123']);
    expect(result.audienceNames).toEqual(['Also Skip', 'Audience A', 'Should Skip']);
  });

  test('should return empty audienceNames array when all names are null', () => {
    const audiences = [
      { id: '1', name: null },
      { id: '2', name: null },
    ];
    const result = optimizely.getAudienceIdsAndNames(audiences);

    expect(result.audienceIds).toEqual(['1', '2']);
    expect(result.audienceNames).toEqual([]);
  });
});

describe('Optimizely sendDataToRudder', () => {
  let optimizely;

  beforeEach(() => {
    optimizely = new Optimizely(defaultConfig, mockAnalytics, destinationInfo);
  });

  test('should call analytics.track with Experiment Viewed when sendExperimentTrack is true', () => {
    const campaignState = {
      id: 'campaign-123',
      campaignName: 'Test Campaign',
      isInCampaignHoldback: false,
      audiences: [
        { id: '7527562222', name: 'Audience One' },
        { id: '7527562223', name: null },
        { id: null, name: 'Audience Three' }
      ],
      experiment: { id: 'exp-1', name: 'Test Experiment', referrer: null },
      variation: { id: 'var-1', name: 'Variation A' },
    };

    optimizely.sendDataToRudder(campaignState);

    expect(mockAnalytics.track).toHaveBeenCalledWith(
      'Experiment Viewed',
      expect.objectContaining({
        campaignName: 'Test Campaign',
        campaignId: 'campaign-123',
        experimentId: 'exp-1',
        experimentName: 'Test Experiment',
        variationName: 'Variation A',
        variationId: 'var-1',
        audienceId: '7527562222,7527562223',
        audienceName: 'Audience One,Audience Three',
        isInCampaignHoldback: false,
      }),
      {
        integrations: { All: true },
      },
    );
  });

  test('should call analytics.identify when sendExperimentIdentify is true', () => {
    const campaignState = {
      id: 'campaign-123',
      campaignName: 'Test Campaign',
      isInCampaignHoldback: false,
      audiences: [],
      experiment: { id: 'exp-1', name: 'Test Experiment' },
      variation: { id: 'var-1', name: 'Variation A' },
    };

    optimizely.sendDataToRudder(campaignState);

    expect(mockAnalytics.identify).toHaveBeenCalledWith({
      'Experiment: Test Experiment': 'Variation A',
    });
  });

  test('should not throw when audiences contain null names', () => {
    const campaignState = {
      id: 'campaign-123',
      campaignName: 'Test Campaign',
      isInCampaignHoldback: false,
      audiences: [
        { id: '7527562222', name: 'Valid Audience' },
        { id: '7527111138', name: null },
      ],
      experiment: { id: 'exp-1', name: 'Test Experiment' },
      variation: { id: 'var-1', name: 'Variation A' },
    };

    expect(() => optimizely.sendDataToRudder(campaignState)).not.toThrow();
    expect(mockAnalytics.track).toHaveBeenCalled();
  });
});

describe('Optimizely track', () => {
  let optimizely;

  beforeEach(() => {
    optimizely = new Optimizely(defaultConfig, mockAnalytics, destinationInfo);
    window.optimizely = { push: jest.fn() };
  });

  test('should push event to optimizely with colons replaced by underscores', () => {
    optimizely.track({
      message: {
        event: 'Custom: Event',
        properties: { item: 'Test' },
      },
    });

    expect(window.optimizely.push).toHaveBeenCalledWith({
      type: 'event',
      eventName: 'Custom_ Event',
      tags: { item: 'Test' },
    });
  });

  test('should convert revenue to cents for Order Completed when revenueOnlyOnOrderCompleted is true', () => {
    optimizely.track({
      message: {
        event: 'Order Completed',
        properties: { revenue: 25.5 },
      },
    });

    expect(window.optimizely.push).toHaveBeenCalledWith(
      expect.objectContaining({
        tags: expect.objectContaining({ revenue: 2550 }),
      }),
    );
  });

  test('should remove revenue for non-Order Completed events when revenueOnlyOnOrderCompleted is true', () => {
    optimizely.track({
      message: {
        event: 'Product Viewed',
        properties: { revenue: 50 },
      },
    });

    const tags = window.optimizely.push.mock.calls[0][0].tags;
    expect(tags.revenue).toBeUndefined();
  });
});

describe('Optimizely page', () => {
  let optimizely;

  beforeEach(() => {
    optimizely = new Optimizely(defaultConfig, mockAnalytics, destinationInfo);
    window.optimizely = { push: jest.fn() };
  });

  test('should track categorized page when trackCategorizedPages is true', () => {
    optimizely.page({
      message: {
        properties: { category: 'Products' },
      },
    });

    expect(window.optimizely.push).toHaveBeenCalledWith({
      type: 'event',
      eventName: 'Viewed Products page',
      tags: { category: 'Products' },
    });
  });

  test('should track named page when trackNamedPages is true', () => {
    optimizely.page({
      message: {
        name: 'Home',
        properties: {},
      },
    });

    expect(window.optimizely.push).toHaveBeenCalledWith({
      type: 'event',
      eventName: 'Viewed Home page',
      tags: {},
    });
  });

  test('should not track when category and name are missing', () => {
    optimizely.page({
      message: {
        properties: {},
      },
    });

    expect(window.optimizely.push).not.toHaveBeenCalled();
  });
});
