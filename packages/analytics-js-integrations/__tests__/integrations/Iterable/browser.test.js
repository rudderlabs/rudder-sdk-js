import Iterable from '../../../src/integrations/Iterable/browser';
import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import {
  VENDOR_SDK_PIN_SUPPORT,
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
  for (const loadOnlyIntegrations of [
    undefined,
    {},
    { All: { vendorSdkVersionPolicy: 'pinned' } },
    { All: { vendorSdkVersionPolicy: 'strict' }, Iterable: {} },
  ]) {
    new Iterable({ apiKey: 'key', releaseStage: 'production' }, { loadOnlyIntegrations }).init();
    expect(ScriptLoader).toHaveBeenLastCalledWith(
      'iterable-web',
      'https://unpkg.com/@iterable/web-sdk@2.3.3/index.js',
      {
        integrity: 'sha384-RzEdjNnap/ghW3ER+a0s+gCQNO+U+mLgjw/UQ5QJc4tH6xUu+B41646M7Goqjxx9',
        crossOrigin: 'anonymous',
      },
    );
  }
  for (const loadOnlyIntegrations of [
    { All: { vendorSdkVersionPolicy: 'floating' } },
    { All: { vendorSdkVersionPolicy: 'strict' }, Iterable: { vendorSdkVersionPolicy: 'floating' } },
  ]) {
    new Iterable({ apiKey: 'key' }, { loadOnlyIntegrations }).init();
    expect(ScriptLoader).toHaveBeenLastCalledWith(
      'iterable-web',
      'https://unpkg.com/@iterable/web-sdk/index.js',
      {},
    );
  }
  expect(VENDOR_SDK_PIN_SUPPORT).toBe('full');
  expect(new URL(VENDOR_SDK_PINNED_URL).hostname).toBe(new URL(VENDOR_SDK_FLOATING_URL).hostname);
});

test('Iterable retains initialization, in-app and event contracts', () => {
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
  iterable.identify(identify);
  expect(sdk.initialize).toHaveBeenCalledWith('key', expect.any(Function));
  expect(sdk.initialize.mock.calls[0][1]({ Iterable: { jwt_token: 'jwt-test' } })).toBe('jwt-test');
  expect(sdk.initialize.mock.results[0].value.setUserID).toHaveBeenCalledWith('user-1');
  expect(sdk.getInAppMessages).toHaveBeenCalledWith(
    expect.objectContaining({ count: 20, animationDuration: 400 }),
    { display: 'immediate' },
  );
  expect(iterable.isReady()).toBe(true);
  iterable.track({
    message: { event: 'Show Message', userId: 'user-1', properties: {}, context: {} },
  });
  expect(sdk.getInAppMessages.mock.results[0].value.request).toHaveBeenCalledTimes(1);
  iterable.track({
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
  iterable.track({
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
  new Iterable({ ...config, initialisationIdentifier: 'email' }, {}).identify(identify);
  expect(sdk.initialize.mock.results[1].value.setEmail).toHaveBeenCalledWith('sam@example.com');
});
