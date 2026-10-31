import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { VendorSdkPinSupport } from '@rudderstack/analytics-js-common/types/Integration';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { effect } from '@preact/signals-core';
import { resetState, state } from '../../__mocks__/state';
import DeviceModeDestinations from '../../src/deviceModeDestinations';

const makeDestination = (displayName = 'rollbar'): Destination => ({
  id: displayName,
  userFriendlyId: displayName,
  displayName,
  enabled: true,
  shouldApplyDeviceModeTransformation: false,
  propagateEventsUntransformedOnError: false,
  config: {
    blacklistedEvents: [],
    whitelistedEvents: [],
    eventFilteringOption: 'disable',
    consentManagement: [],
    connectionMode: 'device',
  },
});
const plugin = DeviceModeDestinations();
const pluginsManager = { invokeSingle: jest.fn().mockReturnValue(true) };
const externalSrcLoader = { loadJSFile: jest.fn() };
const init = jest.fn();
const isReady = jest.fn().mockReturnValue(true);
let getVendorSdkPinSupport: jest.Mock | undefined;
let constructed: jest.Mock;
const activateAndLoad = () => {
  plugin.nativeDestinations.setActiveDestinations(
    state,
    pluginsManager,
    defaultErrorHandler,
    defaultLogger,
  );
  plugin.nativeDestinations.load(state, externalSrcLoader, defaultErrorHandler, defaultLogger);
};

beforeEach(() => {
  resetState();
  jest.clearAllMocks();
  jest.useFakeTimers();
  pluginsManager.invokeSingle.mockReturnValue(true);
  isReady.mockReturnValue(true);
  getVendorSdkPinSupport = undefined;
  constructed = jest.fn();
  // No mounted constructor: exercise bundle download and its actual initialization callback.
  delete (globalThis as any).RollBar_RS;
  externalSrcLoader.loadJSFile.mockImplementation(({ callback, id }) => {
    (globalThis as any).RollBar_RS = {
      RollBar: function (config: object, analytics: object) {
        constructed(config, analytics);
        return { init, isReady, getVendorSdkPinSupport };
      },
    };
    callback(id);
  });
  state.nativeDestinations.configuredDestinations.value = [makeDestination()];
  state.nativeDestinations.loadOnlyIntegrations.value = {
    All: { vendorSdkVersionPolicy: 'strict' },
  };
});
afterEach(() => {
  delete (globalThis as any).RollBar_RS;
  jest.useRealTimers();
});

test.each(['missing', 'none', 'undefined'])('strict fails closed for %s support', support => {
  if (support !== 'missing') {
    getVendorSdkPinSupport = jest.fn().mockReturnValue(support === 'none' ? 'none' : undefined);
  }
  // Mirror the core ready/onLoaded completion condition using the existing failed state.
  let ready = false;
  const dispose = effect(() => {
    ready =
      state.nativeDestinations.activeDestinations.value.length > 0 &&
      state.nativeDestinations.initializedDestinations.value.length +
        state.nativeDestinations.failedDestinations.value.length ===
        state.nativeDestinations.activeDestinations.value.length;
  });
  activateAndLoad();
  expect(externalSrcLoader.loadJSFile).toHaveBeenCalledTimes(1);
  expect(constructed).toHaveBeenCalledTimes(1);
  expect(init).not.toHaveBeenCalled();
  expect(isReady).not.toHaveBeenCalled();
  expect(defaultLogger.error).toHaveBeenCalledTimes(1);
  expect(defaultLogger.error).toHaveBeenCalledWith(
    'Skipped rollbar: its vendor script cannot be pinned (strict mode). Set its vendorSdkVersionPolicy to "pinned" to load it.',
  );
  expect(state.nativeDestinations.failedDestinations.value).toEqual([
    state.nativeDestinations.configuredDestinations.value[0],
  ]);
  expect(ready).toBe(true);
  expect(jest.getTimerCount()).toBe(0);
  expect(defaultErrorHandler.onError).not.toHaveBeenCalled();
  dispose();
});

test.each<VendorSdkPinSupport>(['full', 'no-script', 'customer'])(
  'strict initializes %s support',
  async support => {
    getVendorSdkPinSupport = jest.fn().mockReturnValue(support);
    activateAndLoad();
    await Promise.resolve();
    expect(init).toHaveBeenCalledTimes(1);
    expect(state.nativeDestinations.initializedDestinations.value).toHaveLength(1);
    expect(state.nativeDestinations.failedDestinations.value).toEqual([]);
    expect(defaultLogger.error).not.toHaveBeenCalled();
  },
);

test('strict initializes custom integrations without support', async () => {
  state.nativeDestinations.configuredDestinations.value = [
    {
      ...makeDestination('Customer Integration'),
      isCustomIntegration: true,
      integration: { init, isReady },
    },
  ];
  activateAndLoad();
  await Promise.resolve();
  expect(init).toHaveBeenCalledTimes(1);
  expect(state.nativeDestinations.initializedDestinations.value).toHaveLength(1);
  expect(defaultLogger.error).not.toHaveBeenCalled();
});

test.each(['pinned', 'floating'] as const)('destination %s overrides All strict', async policy => {
  state.nativeDestinations.loadOnlyIntegrations.value = {
    All: { vendorSdkVersionPolicy: 'strict' },
    rollbar: { vendorSdkVersionPolicy: policy },
  };
  activateAndLoad();
  await Promise.resolve();
  expect(init).toHaveBeenCalledTimes(1);
  expect(state.nativeDestinations.initializedDestinations.value).toHaveLength(1);
  expect(defaultLogger.error).not.toHaveBeenCalled();
});

test('consent options replace rather than merge strict policy', async () => {
  state.consents.postConsent.value = { integrations: {} };
  activateAndLoad();
  await Promise.resolve();
  expect(constructed).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      loadOnlyIntegrations: {},
    }),
  );
  expect(init).toHaveBeenCalledTimes(1);
  expect(defaultLogger.error).not.toHaveBeenCalled();
});

test('post-consent strict policy is enforced at initialization', () => {
  state.nativeDestinations.loadOnlyIntegrations.value = {};
  state.consents.postConsent.value = {
    integrations: { All: { vendorSdkVersionPolicy: 'strict' } },
  };
  activateAndLoad();
  expect(init).not.toHaveBeenCalled();
  expect(state.nativeDestinations.failedDestinations.value).toHaveLength(1);
  expect(defaultLogger.error).toHaveBeenCalledTimes(1);
});

test.each(['consent manager', 'consent options', 'disabled'])(
  '%s exclusion never reaches the gate',
  exclusion => {
    if (exclusion === 'consent manager') pluginsManager.invokeSingle.mockReturnValue(false);
    if (exclusion === 'consent options')
      state.consents.postConsent.value = {
        integrations: { All: { vendorSdkVersionPolicy: 'strict' }, rollbar: false },
      };
    if (exclusion === 'disabled')
      state.nativeDestinations.configuredDestinations.value[0]!.enabled = false;
    activateAndLoad();
    expect(state.nativeDestinations.activeDestinations.value).toEqual([]);
    expect(externalSrcLoader.loadJSFile).not.toHaveBeenCalled();
    expect(constructed).not.toHaveBeenCalled();
    expect(init).not.toHaveBeenCalled();
    expect(defaultLogger.error).not.toHaveBeenCalled();
    expect(defaultErrorHandler.onError).not.toHaveBeenCalled();
  },
);
