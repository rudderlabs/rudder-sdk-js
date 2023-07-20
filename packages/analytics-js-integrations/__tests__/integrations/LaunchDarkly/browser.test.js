import LaunchDarkly from '../../../src/integrations/LaunchDarkly/browser';
import {
  launchDarklyConfigs,
  mockTraits,
  mockAnonymousId,
  mockUserId,
  mockClientSideId,
  mockAnonymousUsersSharedKey,
  trackCallPayload,
  mockProperties,
  testEvent,
} from './__fixtures__/data';

afterAll(() => {
  jest.restoreAllMocks();
});

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

describe('LaunchDarkly init tests', () => {
  test('Testing init call of Launch Darkly without client side id', () => {
    const launchdarkly = new LaunchDarkly(launchDarklyConfigs[0], {}, destinationInfo);
    try {
      launchdarkly.init();
    } catch (error) {
      expect(error).toEqual(
        'LAUNCHDARKLY :: Unable to initialize destination - clientSideId is missing in config',
      );
    }
  });
});

describe('LaunchDarkly Identify call tests', () => {
  let launchdarkly;

  test('Testing identify call with anonymousId', () => {
    launchdarkly = new LaunchDarkly(launchDarklyConfigs[1], {}, destinationInfo);
    launchdarkly.init();
    window.LDClient = {};
    window.LDClient.initialize = jest.fn();
    launchdarkly.identify({
      message: {
        context: {
          traits: mockTraits,
        },
        anonymousId: mockAnonymousId,
      },
    });

    expect(window.LDClient.initialize.mock.calls[0][0]).toEqual(mockClientSideId);
    expect(window.LDClient.initialize.mock.calls[0][1]).toEqual({
      key: mockAnonymousId,
      ...mockTraits,
    });
  });

  test('Testing identify call with userId', () => {
    launchdarkly = new LaunchDarkly(launchDarklyConfigs[1], {}, destinationInfo);
    launchdarkly.init();
    window.LDClient = {};
    window.LDClient.initialize = jest.fn();
    launchdarkly.identify({
      message: {
        context: {
          traits: mockTraits,
        },
        userId: mockUserId,
      },
    });

    expect(window.LDClient.initialize.mock.calls[0][0]).toEqual(mockClientSideId);
    expect(window.LDClient.initialize.mock.calls[0][1]).toEqual({
      key: mockUserId,
      ...mockTraits,
    });
  });

  test('Testing identify call with anonymous user shared key', () => {
    launchdarkly = new LaunchDarkly(launchDarklyConfigs[2], {}, destinationInfo);
    launchdarkly.init();
    window.LDClient = {};
    window.LDClient.initialize = jest.fn();
    launchdarkly.identify({
      message: {
        context: {
          traits: mockTraits,
        },
        userId: mockUserId,
      },
    });

    expect(window.LDClient.initialize.mock.calls[0][0]).toEqual(mockClientSideId);
    expect(window.LDClient.initialize.mock.calls[0][1]).toEqual({
      key: mockAnonymousUsersSharedKey,
      ...mockTraits,
    });
  });
});

describe('LaunchDarkly Track call tests', () => {
  let launchdarkly;
  beforeEach(() => {
    launchdarkly = new LaunchDarkly(launchDarklyConfigs[1], {}, destinationInfo);
    launchdarkly.init();
    window.ldclient = {};
    window.ldclient.track = jest.fn();
  });

  test('Testing track call', () => {
    launchdarkly.track(trackCallPayload);
    expect(window.ldclient.track.mock.calls[0][0]).toEqual(testEvent);
    expect(window.ldclient.track.mock.calls[0][1]).toEqual(mockProperties);
  });
});

describe('LaunchDarkly Alias call tests', () => {
  let launchdarkly;
  beforeEach(() => {
    launchdarkly = new LaunchDarkly({ clientSideId: 'test-client-side-id' }, {}, destinationInfo);
    launchdarkly.init();
    window.ldclient = {};
    window.ldclient.alias = jest.fn();
    window.ldclient.identify = jest.fn();
    launchdarkly.identify({
      message: {
        context: {
          traits: mockTraits,
        },
        anonymousId: mockAnonymousId,
      },
    });
  });

  test('Testing alias call to merge anonymous and identified user', () => {
    launchdarkly.alias({
      message: {
        context: {},
        userId: mockUserId,
      },
    });

    expect(window.ldclient.alias.mock.calls[0][0]).toEqual({ key: mockUserId });
    expect(window.ldclient.alias.mock.calls[0][1]).toEqual({
      key: mockAnonymousId,
      ...mockTraits,
    });
  });
});
