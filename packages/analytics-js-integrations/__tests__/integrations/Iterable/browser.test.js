import * as vendorSdkPolicy from '../../../src/utils/vendorSdkVersionPolicy';
import Iterable from '../../../src/integrations/Iterable/browser';
import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import {
  VENDOR_SDK_PINNED_URL,
  VENDOR_SDK_FLOATING_URL,
} from '../../../src/integrations/Iterable/constants';

jest.mock('@rudderstack/analytics-js-legacy-utilities/ScriptLoader', () => ({
  ScriptLoader: jest.fn(),
}));

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  delete window['@iterable/web-sdk'];
});

test('Iterable uses the selected vendor artifact', () => {
  for (const vendorSdkVersionPolicy of [undefined, 'strict', 'pinned', 'floating', 'latest']) {
    new Iterable({ apiKey: 'key', releaseStage: 'production' }, { vendorSdkVersionPolicy }).init();
    expect(ScriptLoader).toHaveBeenLastCalledWith(
      'iterable-web',
      'https://unpkg.com/@iterable/web-sdk@2.3.3/index.js',
      {
        integrity: 'sha384-RzEdjNnap/ghW3ER+a0s+gCQNO+U+mLgjw/UQ5QJc4tH6xUu+B41646M7Goqjxx9',
        crossOrigin: 'anonymous',
      },
    );
  }
  const resolver = jest.spyOn(vendorSdkPolicy, 'resolveVendorSdkVersionPolicy');
  resolver.mockReturnValueOnce('floating');
  try {
    new Iterable({ apiKey: 'key' }, {}).init();
    expect(ScriptLoader).toHaveBeenLastCalledWith(
      'iterable-web',
      'https://unpkg.com/@iterable/web-sdk/index.js',
      {},
    );
  } finally {
    resolver.mockRestore();
  }
  expect(new Iterable({}, {}).getVendorSdkPinSupport()).toBe('full');
  expect(new URL(VENDOR_SDK_PINNED_URL).hostname).toBe(new URL(VENDOR_SDK_FLOATING_URL).hostname);
});

test('Iterable retains initialization, in-app and event contracts', async () => {
  const sdk = {
    initialize: jest.fn().mockImplementation(() => ({
      setUserID: jest.fn().mockResolvedValue(undefined),
      setEmail: jest.fn().mockResolvedValue(undefined),
    })),
    getInAppMessages: jest.fn().mockImplementation(() => ({ request: jest.fn() })),
    track: jest.fn().mockResolvedValue(undefined),
    trackPurchase: jest.fn(),
  };
  window['@iterable/web-sdk'] = sdk;
  const config = {
    apiKey: 'key',
    initialisationIdentifier: 'userId',
    getInAppEventMapping: [{ eventName: 'Show Message' }],
    purchaseEventMapping: [{ eventName: 'Order Completed' }],
  };
  const iterable = new Iterable(config, {});
  const identify = {
    message: {
      userId: 'user-1',
      integrations: { Iterable: { jwt_token: 'jwt-test' } },
      context: { traits: { email: 'sam@example.com' } },
    },
  };
  await iterable.identify(identify);
  expect(sdk.initialize).toHaveBeenCalledWith('key', expect.any(Function));
  await expect(sdk.initialize.mock.calls[0][1]({ userID: 'user-1' })).resolves.toBe('jwt-test');
  expect(sdk.initialize.mock.results[0].value.setUserID).toHaveBeenCalledWith('user-1');
  expect(sdk.getInAppMessages).toHaveBeenCalledWith(
    expect.objectContaining({ count: 20, animationDuration: 400 }),
    { display: 'immediate' },
  );
  expect(iterable.isReady()).toBe(true);
  await iterable.track({
    message: { event: 'Show Message', userId: 'user-1', properties: {}, context: {} },
  });
  expect(sdk.getInAppMessages.mock.results[0].value.request).toHaveBeenCalledTimes(1);
  await iterable.track({
    message: {
      event: 'Clicked',
      userId: 'user-1',
      properties: { plan: 'pro' },
      context: { traits: { email: 'sam@example.com' } },
    },
  });
  expect(sdk.track).toHaveBeenCalledWith({
    email: 'sam@example.com',
    userId: 'user-1',
    eventName: 'Clicked',
    dataFields: { plan: 'pro' },
  });
  await iterable.track({
    message: {
      event: 'Order Completed',
      properties: {
        order_id: 'order-1',
        total: 10,
        products: [{ product_id: 'product-1', price: 10, quantity: 1 }],
      },
      context: {},
    },
  });
  expect(sdk.trackPurchase).toHaveBeenCalledWith({
    id: 'order-1',
    total: 10,
    items: [{ id: 'product-1', price: 10, quantity: 1 }],
  });
  await new Iterable({ ...config, initialisationIdentifier: 'email' }, {}).identify(identify);
  expect(sdk.initialize.mock.results[1].value.setEmail).toHaveBeenCalledWith('sam@example.com');
});

describe('Iterable identity ordering', () => {
  let sdk;
  let identity;
  const identify = {
    message: {
      userId: 'user-1',
      traits: { email: 'sam@example.com' },
      integrations: { Iterable: { jwt_token: 'jwt-test' } },
    },
  };

  beforeEach(() => {
    identity = {
      setEmail: jest.fn().mockResolvedValue(undefined),
      setUserID: jest.fn().mockResolvedValue(undefined),
    };
    sdk = {
      initialize: jest.fn().mockReturnValue(identity),
      track: jest.fn().mockResolvedValue(undefined),
      trackPurchase: jest.fn().mockResolvedValue(undefined),
      getInAppMessages: jest.fn().mockReturnValue({ request: jest.fn() }),
    };
    window['@iterable/web-sdk'] = sdk;
  });

  test.each([
    ['email', 'setEmail', { email: 'sam@example.com' }],
    ['userId', 'setUserID', { userID: 'user-1' }],
  ])(
    'waits for %s before sending queued events and fetching in-app messages',
    async (initialisationIdentifier, setter, jwtPayload) => {
      let resolveIdentity;
      identity[setter].mockReturnValueOnce(
        new Promise(resolve => {
          resolveIdentity = resolve;
        }),
      );
      const iterable = new Iterable(
        {
          apiKey: 'key',
          initialisationIdentifier,
          getInAppEventMapping: [{ eventName: 'Show Message' }],
          purchaseEventMapping: [{ eventName: 'Order Completed' }],
          sendTrackForInapp: true,
        },
        {},
      );
      const pendingIdentify = iterable.identify(identify);
      const pendingEvents = [
        iterable.track({ message: { event: 'Clicked', properties: {} } }),
        iterable.track({ message: { event: 'Order Completed', properties: { total: 10 } } }),
        iterable.track({ message: { event: 'Show Message', properties: {} } }),
      ];
      await Promise.resolve();
      expect(identity[setter]).toHaveBeenCalledTimes(1);
      expect(sdk.track).not.toHaveBeenCalled();
      expect(sdk.trackPurchase).not.toHaveBeenCalled();
      expect(sdk.getInAppMessages).not.toHaveBeenCalled();
      await expect(sdk.initialize.mock.calls[0][1](jwtPayload)).resolves.toBe('jwt-test');

      resolveIdentity();
      await pendingIdentify;
      await Promise.all(pendingEvents);
      expect(sdk.track).toHaveBeenCalledTimes(2);
      expect(sdk.track.mock.calls.map(([payload]) => payload.eventName)).toEqual([
        'Clicked',
        'Track getInAppMessages',
      ]);
      expect(sdk.trackPurchase).toHaveBeenCalledTimes(1);
      expect(sdk.getInAppMessages).toHaveBeenCalledTimes(1);
      expect(sdk.getInAppMessages.mock.results[0].value.request).toHaveBeenCalledTimes(1);
    },
  );

  test.each([undefined, []])(
    'does not fetch in-app messages without mapping %p',
    async getInAppEventMapping => {
      const iterable = new Iterable(
        { apiKey: 'key', initialisationIdentifier: 'email', getInAppEventMapping },
        {},
      );
      await iterable.identify(identify);
      expect(sdk.getInAppMessages).not.toHaveBeenCalled();
      await iterable.track({ message: { event: 'Clicked', properties: {} } });
      expect(sdk.track).toHaveBeenCalledTimes(1);
    },
  );

  test('initializes once and serializes repeated identifies with their JWTs', async () => {
    let resolveFirstIdentity;
    identity.setEmail.mockReturnValueOnce(
      new Promise(resolve => {
        resolveFirstIdentity = resolve;
      }),
    );
    const iterable = new Iterable({ apiKey: 'key', initialisationIdentifier: 'email' }, {});
    const firstIdentify = iterable.identify(identify);
    const firstTrack = iterable.track({ message: { event: 'First', properties: {} } });
    const secondIdentify = iterable.identify({
      message: {
        traits: { email: 'other@example.com' },
        integrations: { Iterable: { jwt_token: 'jwt-other' } },
      },
    });
    const secondTrack = iterable.track({ message: { event: 'Second', properties: {} } });
    await Promise.resolve();
    expect(identity.setEmail).toHaveBeenCalledTimes(1);
    const generateJWT = sdk.initialize.mock.calls[0][1];
    await expect(generateJWT({ email: 'sam@example.com' })).resolves.toBe('jwt-test');
    resolveFirstIdentity();
    await firstIdentify;
    await firstTrack;
    await secondIdentify;
    await secondTrack;
    expect(sdk.initialize).toHaveBeenCalledTimes(1);
    expect(identity.setEmail.mock.calls).toEqual([['sam@example.com'], ['other@example.com']]);
    await expect(generateJWT({ email: 'other@example.com' })).resolves.toBe('jwt-other');
    expect(sdk.track.mock.calls.map(([payload]) => payload.eventName)).toEqual(['First', 'Second']);
    expect(sdk.track.mock.invocationCallOrder[0]).toBeLessThan(
      identity.setEmail.mock.invocationCallOrder[1],
    );
  });
});
