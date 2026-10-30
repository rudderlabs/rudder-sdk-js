import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { resetState, state } from '../../__mocks__/state';
import DeviceModeDestinations from '../../src/deviceModeDestinations';
import { destDisplayNamesToFileNamesMap } from '../../src/utilities/destDisplayNamesToFileNamesMap';

const makeDestination = (
  displayName: string,
  id = displayName,
  config: object = {},
): Destination => ({
  id,
  userFriendlyId: id,
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
    ...config,
  },
});
const plugin = DeviceModeDestinations();
const pluginsManager = { invokeSingle: jest.fn().mockReturnValue(true) };
const externalSrcLoader = { loadJSFile: jest.fn() };
const activate = (logger = defaultLogger) =>
  plugin.nativeDestinations.setActiveDestinations(
    state,
    pluginsManager,
    defaultErrorHandler,
    logger,
  );

beforeEach(() => {
  resetState();
  jest.clearAllMocks();
  pluginsManager.invokeSingle.mockReturnValue(true);
});

test('strict skips all 73 none declarations before bundle download', () => {
  state.nativeDestinations.configuredDestinations.value = Object.keys(
    destDisplayNamesToFileNamesMap,
  ).map(name => makeDestination(name));
  state.nativeDestinations.loadOnlyIntegrations.value = {
    All: { vendorSdkVersionPolicy: 'strict' },
  };
  activate();
  expect(state.nativeDestinations.activeDestinations.value.map(d => d.displayName).sort()).toEqual(
    [
      'Amplitude',
      'Bugsnag',
      'Iterable',
      'Keen',
      'LaunchDarkly',
      'Lotame',
      'Ninetailed',
      'Optimizely Web',
      'Sentry',
      'Shynet',
    ].sort(),
  );
  expect(defaultLogger.error).toHaveBeenCalledTimes(73);
  expect(defaultLogger.error).toHaveBeenCalledWith(
    'Skipped rollbar: its vendor script cannot be pinned (strict mode). Set its vendorSdkVersionPolicy to "pinned" to load it.',
  );
  plugin.nativeDestinations.load(state, externalSrcLoader, defaultErrorHandler, defaultLogger);
  expect(externalSrcLoader.loadJSFile).toHaveBeenCalledTimes(10);
  expect(
    externalSrcLoader.loadJSFile.mock.calls.some(([request]) =>
      request.url.endsWith('/RollBar.min.js'),
    ),
  ).toBe(false);
});

test('destination floating overrides All strict while booleans still filter', () => {
  state.nativeDestinations.configuredDestinations.value = [
    makeDestination('rollbar'),
    makeDestination('Keen'),
  ];
  state.nativeDestinations.loadOnlyIntegrations.value = {
    All: { vendorSdkVersionPolicy: 'strict' },
    rollbar: { vendorSdkVersionPolicy: 'floating' },
    Keen: false,
  };
  activate();
  expect(state.nativeDestinations.activeDestinations.value.map(d => d.displayName)).toEqual([
    'rollbar',
  ]);
  expect(defaultLogger.error).not.toHaveBeenCalled();
  for (const entry of [true, {}, { vendorSdkVersionPolicy: 'latest' }]) {
    state.nativeDestinations.activeDestinations.value = [];
    state.nativeDestinations.loadOnlyIntegrations.value = {
      All: { vendorSdkVersionPolicy: 'strict' },
      rollbar: entry,
      Keen: false,
    } as any;
    activate();
    expect(state.nativeDestinations.activeDestinations.value).toEqual([]);
  }
  expect(() =>
    plugin.nativeDestinations.setActiveDestinations(state, pluginsManager),
  ).not.toThrow();
  for (const policy of ['pinned', 'floating'] as const) {
    state.nativeDestinations.activeDestinations.value = [];
    state.nativeDestinations.loadOnlyIntegrations.value = {
      All: { vendorSdkVersionPolicy: policy },
      Keen: false,
    };
    activate();
    expect(state.nativeDestinations.activeDestinations.value.map(d => d.displayName)).toEqual([
      'rollbar',
    ]);
  }
});

test('custom integrations are exempt', () => {
  const destinations = [
    {
      ...makeDestination('Customer Integration'),
      isCustomIntegration: true,
      integration: { isReady: () => true },
    },
  ];
  state.nativeDestinations.configuredDestinations.value = [
    ...destinations,
    { ...makeDestination('Missing custom'), isCustomIntegration: true },
  ];
  state.nativeDestinations.loadOnlyIntegrations.value = {
    All: { vendorSdkVersionPolicy: 'strict' },
  };
  activate();
  expect(state.nativeDestinations.activeDestinations.value).toEqual(destinations);
  expect(defaultLogger.error).not.toHaveBeenCalled();
  expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
});

test('consent replaces rather than merges policy', () => {
  state.nativeDestinations.configuredDestinations.value = [makeDestination('rollbar')];
  state.nativeDestinations.loadOnlyIntegrations.value = {
    All: { vendorSdkVersionPolicy: 'strict' },
  };
  state.consents.postConsent.value = { integrations: {} };
  activate();
  expect(state.nativeDestinations.activeDestinations.value.map(d => d.displayName)).toEqual([
    'rollbar',
  ]);
  expect(defaultLogger.error).not.toHaveBeenCalled();
  state.nativeDestinations.activeDestinations.value = [];
  state.consents.postConsent.value = {
    integrations: { All: { vendorSdkVersionPolicy: 'strict' } },
  };
  activate();
  expect(state.nativeDestinations.activeDestinations.value).toEqual([]);
});

test('strict skips GA4 with a customer vendor URL before bundle download', () => {
  state.nativeDestinations.configuredDestinations.value = [
    makeDestination('Google Analytics 4 (GA4)', 'ga4', { sdkBaseUrl: 'https://customer.example' }),
  ];
  state.nativeDestinations.loadOnlyIntegrations.value = {
    All: { vendorSdkVersionPolicy: 'strict' },
  };
  activate();
  expect(state.nativeDestinations.activeDestinations.value).toEqual([]);
  expect(defaultLogger.error).toHaveBeenCalledTimes(1);
  expect(defaultLogger.error).toHaveBeenCalledWith(
    'Skipped Google Analytics 4 (GA4): its vendor script cannot be pinned (strict mode). Set its vendorSdkVersionPolicy to "pinned" to load it.',
  );
  plugin.nativeDestinations.load(state, externalSrcLoader, defaultErrorHandler, defaultLogger);
  expect(externalSrcLoader.loadJSFile).not.toHaveBeenCalled();
});

test('GA4 pinned policy opts out of All strict and loads its bundle', () => {
  const destination = makeDestination('Google Analytics 4 (GA4)', 'ga4', {
    sdkBaseUrl: 'https://customer.example',
  });
  state.nativeDestinations.configuredDestinations.value = [destination];
  state.nativeDestinations.loadOnlyIntegrations.value = {
    All: { vendorSdkVersionPolicy: 'strict' },
    'Google Analytics 4 (GA4)': { vendorSdkVersionPolicy: 'pinned' },
  };
  activate();
  expect(state.nativeDestinations.activeDestinations.value).toEqual([destination]);
  expect(defaultLogger.error).not.toHaveBeenCalled();
  plugin.nativeDestinations.load(state, externalSrcLoader, defaultErrorHandler, defaultLogger);
  expect(externalSrcLoader.loadJSFile).toHaveBeenCalledTimes(1);
  expect(externalSrcLoader.loadJSFile.mock.calls[0][0].url).toMatch(/\/GA4\.min\.js$/);
});

test('disabled and unconsented destinations stay excluded', () => {
  state.nativeDestinations.configuredDestinations.value = [
    { ...makeDestination('Keen'), enabled: false },
    makeDestination('Bugsnag'),
  ];
  state.nativeDestinations.loadOnlyIntegrations.value = {
    All: { vendorSdkVersionPolicy: 'strict' },
  };
  pluginsManager.invokeSingle.mockReturnValue(false);
  activate();
  expect(state.nativeDestinations.activeDestinations.value).toEqual([]);
  expect(defaultLogger.error).not.toHaveBeenCalled();
});

test.each([false, true])('strict unpinnable destination with consent %s', consented => {
  state.nativeDestinations.configuredDestinations.value = [makeDestination('rollbar')];
  state.nativeDestinations.loadOnlyIntegrations.value = {
    All: { vendorSdkVersionPolicy: 'strict' },
  };
  pluginsManager.invokeSingle.mockReturnValue(consented);
  activate();
  expect(defaultLogger.error).toHaveBeenCalledTimes(consented ? 1 : 0);
  if (consented) {
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'Skipped rollbar: its vendor script cannot be pinned (strict mode). Set its vendorSdkVersionPolicy to "pinned" to load it.',
    );
  }
  expect(state.nativeDestinations.activeDestinations.value).toEqual([]);
  plugin.nativeDestinations.load(state, externalSrcLoader, defaultErrorHandler, defaultLogger);
  expect(externalSrcLoader.loadJSFile).not.toHaveBeenCalled();
});
