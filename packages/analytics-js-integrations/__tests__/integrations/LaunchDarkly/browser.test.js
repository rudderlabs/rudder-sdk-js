import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import {
  VENDOR_SDK_PINNED_URL,
  VENDOR_SDK_FLOATING_URL,
} from '../../../src/integrations/LaunchDarkly/constants';
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

jest.mock('@rudderstack/analytics-js-legacy-utilities/ScriptLoader', () => ({
  ScriptLoader: jest.fn(),
}));
beforeEach(() => {
  jest.clearAllMocks();
});
afterEach(() => {
  delete window.LDClient;
  delete window.ldclient;
});

afterAll(() => {
  jest.restoreAllMocks();
});

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

describe('LaunchDarkly init tests', () => {
  test('LaunchDarkly does not request a script without clientSideId', () => {
    new LaunchDarkly({}, {}).init();
    expect(ScriptLoader).not.toHaveBeenCalled();
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

test('LaunchDarkly uses the selected vendor artifact', () => {
  for (const loadOnlyIntegrations of [
    undefined,
    {},
    { All: { vendorSdkVersionPolicy: 'pinned' } },
    { All: { vendorSdkVersionPolicy: 'strict' }, LaunchDarkly: {} },
  ]) {
    new LaunchDarkly({ clientSideId: 'client-1' }, { loadOnlyIntegrations }).init();
    expect(ScriptLoader).toHaveBeenLastCalledWith(
      null,
      'https://unpkg.com/launchdarkly-js-client-sdk@2.24.2/dist/ldclient.min.js',
      {
        integrity: 'sha384-n/oFkkwm6UKpr8pGEbmNoGKFjm8npB9KfZsG0HT7N89mdKXeIGiTS2r9qTwHl+aI',
        crossOrigin: 'anonymous',
      },
    );
  }
  for (const loadOnlyIntegrations of [
    { All: { vendorSdkVersionPolicy: 'floating' } },
    {
      All: { vendorSdkVersionPolicy: 'strict' },
      LaunchDarkly: { vendorSdkVersionPolicy: 'floating' },
    },
  ]) {
    new LaunchDarkly({ clientSideId: 'client-1' }, { loadOnlyIntegrations }).init();
    expect(ScriptLoader).toHaveBeenLastCalledWith(
      null,
      'https://unpkg.com/launchdarkly-js-client-sdk@2',
      {},
    );
  }
  expect(new LaunchDarkly({}, {}).getVendorSdkPinSupport()).toBe('full');
  expect(new URL(VENDOR_SDK_PINNED_URL).hostname).toBe(new URL(VENDOR_SDK_FLOATING_URL).hostname);
});
