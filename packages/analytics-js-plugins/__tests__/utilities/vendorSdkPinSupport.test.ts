import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { destDisplayNamesToFileNamesMap } from '../../src/utilities/destDisplayNamesToFileNamesMap';
import { destDisplayNamesToPinSupportMap } from '../../src/utilities/destDisplayNamesToPinSupportMap';
import { hasCustomerUrlOverride } from '../../src/utilities/destDisplayNamesToCustomerUrlOverrideMap';

const destination = (displayName: string, config: object): Destination => ({
  id: 'dest-test',
  userFriendlyId: 'dest-test',
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
const page = globalThis as typeof window & { MIXPANEL_CUSTOM_LIB_URL?: unknown };
let original: PropertyDescriptor | undefined;
beforeEach(() => {
  original = Object.getOwnPropertyDescriptor(page, 'MIXPANEL_CUSTOM_LIB_URL');
});
afterEach(() => {
  if (original) Object.defineProperty(page, 'MIXPANEL_CUSTOM_LIB_URL', original);
  else delete page.MIXPANEL_CUSTOM_LIB_URL;
});

test('support map contains six full and four no-script declarations', () => {
  expect(destDisplayNamesToPinSupportMap).toEqual({
    Bugsnag: 'full',
    Iterable: 'full',
    Keen: 'full',
    LaunchDarkly: 'full',
    Amplitude: 'full',
    Sentry: 'full',
    Lotame: 'no-script',
    Ninetailed: 'no-script',
    'Optimizely Web': 'no-script',
    Shynet: 'no-script',
  });
  expect(Object.keys(destDisplayNamesToFileNamesMap)).toHaveLength(83);
  expect(
    Object.keys(destDisplayNamesToFileNamesMap).filter(
      name => (destDisplayNamesToPinSupportMap[name] ?? 'none') === 'none',
    ),
  ).toHaveLength(73);
  expect(destDisplayNamesToPinSupportMap.RollBar ?? 'none').toBe('none');
  expect(destDisplayNamesToPinSupportMap.toString ?? 'none').toBe('none');
});

test('override detection mirrors vendor loaders', () => {
  expect(
    hasCustomerUrlOverride(
      destination('Appcues', { nativeSdkUrl: 'https://customer.example/tags' }),
    ),
  ).toBe(true);
  for (const value of ['', 123, undefined])
    expect(hasCustomerUrlOverride(destination('Appcues', { nativeSdkUrl: value }))).toBe(false);
  expect(hasCustomerUrlOverride(destination('Appcues', { nativeSdkUrl: ' ' }))).toBe(true);
  for (const name of ['Google Analytics 4 (GA4)', 'Google Analytics 4 (GA4) V2', 'Google Ads']) {
    expect(
      hasCustomerUrlOverride(destination(name, { sdkBaseUrl: 'https://customer.example/' })),
    ).toBe(true);
    for (const value of [undefined, null, '', '/', '///'])
      expect(hasCustomerUrlOverride(destination(name, { sdkBaseUrl: value }))).toBe(false);
  }
  expect(
    hasCustomerUrlOverride(destination('Rockerbox', { customDomain: 'customer.example' })),
  ).toBe(true);
  expect(hasCustomerUrlOverride(destination('Rockerbox', { customDomain: '' }))).toBe(false);
  expect(
    hasCustomerUrlOverride(destination('Keen', { sdkBaseUrl: 'https://customer.example' })),
  ).toBe(false);
  expect(hasCustomerUrlOverride(destination('toString', {}))).toBe(false);
  delete page.MIXPANEL_CUSTOM_LIB_URL;
  expect(hasCustomerUrlOverride(destination('Mixpanel', {}))).toBe(false);
  for (const value of ['https://customer.example/mixpanel.js', '', null]) {
    page.MIXPANEL_CUSTOM_LIB_URL = value;
    expect(hasCustomerUrlOverride(destination('Mixpanel', {}))).toBe(true);
  }
  page.MIXPANEL_CUSTOM_LIB_URL = undefined;
  expect(hasCustomerUrlOverride(destination('Mixpanel', {}))).toBe(false);
});

test('Mixpanel lexical globals follow the native loader definedness check', () => {
  const { readFileSync } = require('node:fs');
  const { join } = require('node:path');
  const { runInNewContext } = require('node:vm');
  const { transpileModule, ModuleKind } = require('typescript');
  const source = readFileSync(
    join(__dirname, '../../src/utilities/destDisplayNamesToCustomerUrlOverrideMap.ts'),
    'utf8',
  );
  const compiled = transpileModule(source, {
    compilerOptions: { module: ModuleKind.CommonJS },
  }).outputText;
  for (const declaration of ['let', 'const']) {
    const result = runInNewContext(
      `${declaration} MIXPANEL_CUSTOM_LIB_URL = 'https://customer.example/mixpanel.js';\n${compiled}\n[Object.hasOwn(globalThis, 'MIXPANEL_CUSTOM_LIB_URL'), exports.hasCustomerUrlOverride(destination)];`,
      { exports: {}, require, destination: destination('Mixpanel', {}) },
    );
    expect(result).toEqual([false, true]);
  }
});
