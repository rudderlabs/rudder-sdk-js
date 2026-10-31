import Bugsnag from '../../../src/integrations/Bugsnag/browser';
import { ScriptLoader } from '@rudderstack/analytics-js-legacy-utilities/ScriptLoader';
import {
  VENDOR_SDK_PINNED_URL,
  VENDOR_SDK_FLOATING_URL,
} from '../../../src/integrations/Bugsnag/constants';

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
  delete window.bugsnag;
  delete window.bugsnagClient;
});

test('Bugsnag uses the selected vendor artifact', () => {
  for (const loadOnlyIntegrations of [
    undefined,
    {},
    { All: { vendorSdkVersionPolicy: 'pinned' } },
    { All: { vendorSdkVersionPolicy: 'strict' }, Bugsnag: {} },
  ]) {
    new Bugsnag({ apiKey: 'key', releaseStage: 'production' }, { loadOnlyIntegrations }).init();
    expect(ScriptLoader).toHaveBeenLastCalledWith(
      'bugsnag-id',
      'https://d2wy8f7a9ursnm.cloudfront.net/v6.5.2/bugsnag.min.js',
      {
        integrity: 'sha384-HLLE081l7CZ3SQUdBd9Lm13LHdl+BlWO54d1rVFhH4RCnCoXw9OUtxswT05Gp2V1',
        crossOrigin: 'anonymous',
      },
    );
  }
  for (const loadOnlyIntegrations of [
    { All: { vendorSdkVersionPolicy: 'floating' } },
    { All: { vendorSdkVersionPolicy: 'strict' }, Bugsnag: { vendorSdkVersionPolicy: 'floating' } },
  ]) {
    new Bugsnag({ apiKey: 'key' }, { loadOnlyIntegrations }).init();
    expect(ScriptLoader).toHaveBeenLastCalledWith(
      'bugsnag-id',
      'https://d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js',
      {},
    );
  }
  expect(new Bugsnag({}, {}).getVendorSdkPinSupport()).toBe('full');
  expect(new URL(VENDOR_SDK_PINNED_URL).hostname).toBe(new URL(VENDOR_SDK_FLOATING_URL).hostname);
});

test('Bugsnag retains v6 initialization and identify contract', () => {
  window.bugsnag = jest.fn().mockReturnValue({ notify: jest.fn() });
  const bugsnag = new Bugsnag({ apiKey: 'key', releaseStage: 'production' }, {});
  bugsnag.init();
  jest.advanceTimersByTime(1000);
  expect(window.bugsnag).toHaveBeenCalledWith('key');
  expect(window.bugsnagClient.releaseStage).toBe('production');
  expect(bugsnag.isReady()).toBe(true);
  bugsnag.identify({
    message: {
      userId: 'user-1',
      anonymousId: 'anon-1',
      context: { traits: { name: 'Sam', email: 'sam@example.com' } },
    },
  });
  expect(window.bugsnagClient.user).toEqual({
    id: 'user-1',
    name: 'Sam',
    email: 'sam@example.com',
  });
  expect(window.bugsnagClient.notify).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'error in identify' }),
  );
  expect(jest.getTimerCount()).toBe(0);
});
