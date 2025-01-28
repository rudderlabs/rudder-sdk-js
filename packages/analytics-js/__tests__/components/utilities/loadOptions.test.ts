/* eslint-disable compat/compat */
import type { LoadOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { normalizeLoadOptions } from '../../../src/components/utilities/loadOptions';

describe('load API options', () => {
  const defaultLoadOptions: LoadOptions = {
    logLevel: 'ERROR',
    configUrl: 'https://api.rudderstack.com',
    loadIntegration: true,
    sessions: {
      autoTrack: true,
      timeout: 30 * 60 * 1000, // 30 minutes
    },
    sameSiteCookie: 'Lax',
    polyfillIfRequired: true,
    integrations: {
      All: true,
    },
    useBeacon: false,
    beaconQueueOptions: {},
    destinationsQueueOptions: {},
    queueOptions: {},
    lockIntegrationsVersion: false,
    lockPluginsVersion: false,
    uaChTrackLevel: 'none',
    plugins: [],
    useGlobalIntegrationsConfigInEvents: false,
    bufferDataPlaneEventsUntilReady: false,
    dataPlaneEventsBufferTimeout: 10 * 1000, // 10 seconds
    storage: {
      encryption: {
        version: 'v3',
      },
      migrate: true,
      cookie: {},
    },
    sendAdblockPageOptions: {},
    useServerSideCookies: false,
    sendAdblockPage: false,
    sameDomainCookiesOnly: false,
    secureCookie: false,
  };

  const defaultOptionalPluginsList: PluginName[] = [
    'BeaconQueue',
    'CustomConsentManager',
    'DeviceModeDestinations',
    'DeviceModeTransformation',
    'ExternalAnonymousId',
    'GoogleLinker',
    'IubendaConsentManager',
    'KetchConsentManager',
    'NativeDestinationQueue',
    'OneTrustConsentManager',
    'StorageEncryption',
    'StorageEncryptionLegacy',
    'StorageMigrator',
    'XhrQueue',
  ];

  describe('normalizeLoadOptions', () => {
    describe('setCookieDomain', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore setCookieDomain if it is a number',
          input: { setCookieDomain: 123 },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore setCookieDomain if it is a boolean',
          input: { setCookieDomain: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore setCookieDomain if it is an object',
          input: { setCookieDomain: { domain: 'rudderstack.com' } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore setCookieDomain if it is an array',
          input: { setCookieDomain: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore setCookieDomain if it is a function',
          input: { setCookieDomain: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore setCookieDomain if it is a symbol',
          input: { setCookieDomain: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore setCookieDomain if it is null',
          input: { setCookieDomain: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore setCookieDomain if it is undefined',
          input: { setCookieDomain: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set setCookieDomain to the input (string) value',
          input: { setCookieDomain: 'rudderstack.com' },
          expected: {
            ...defaultLoadOptions,
            setCookieDomain: 'rudderstack.com',
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('sameSiteCookie', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore sameSiteCookie if it is not a valid value',
          input: { sameSiteCookie: 'Invalid' },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sameSiteCookie if it is a number',
          input: { sameSiteCookie: 123 },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sameSiteCookie if it is a boolean',
          input: { sameSiteCookie: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sameSiteCookie if it is an object',
          input: { sameSiteCookie: { domain: 'rudderstack.com' } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sameSiteCookie if it is an array',
          input: { sameSiteCookie: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sameSiteCookie if it is a function',
          input: { sameSiteCookie: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sameSiteCookie if it is a symbol',
          input: { sameSiteCookie: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sameSiteCookie if it is null',
          input: { sameSiteCookie: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sameSiteCookie if it is undefined',
          input: { sameSiteCookie: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set sameSiteCookie to the input (Strict) value',
          input: { sameSiteCookie: 'Strict' },
          expected: {
            ...defaultLoadOptions,
            sameSiteCookie: 'Strict',
          },
        },
        {
          name: 'should set sameSiteCookie to the input (Lax) value',
          input: { sameSiteCookie: 'Lax' },
          expected: {
            ...defaultLoadOptions,
            sameSiteCookie: 'Lax',
          },
        },
        {
          name: 'should set sameSiteCookie to the input (None) value',
          input: { sameSiteCookie: 'None' },
          expected: {
            ...defaultLoadOptions,
            sameSiteCookie: 'None',
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('secureCookie', () => {
      const testCaseData: any[] = [
        {
          name: 'should consider false secureCookie if it is a string',
          input: { secureCookie: 'Invalid' },
          expected: { ...defaultLoadOptions, secureCookie: false },
        },
        {
          name: 'should consider false secureCookie if it is a number',
          input: { secureCookie: 123 },
          expected: { ...defaultLoadOptions, secureCookie: false },
        },
        {
          name: 'should consider false secureCookie if it is an object',
          input: { secureCookie: { domain: 'rudderstack.com' } },
          expected: { ...defaultLoadOptions, secureCookie: false },
        },
        {
          name: 'should consider false secureCookie if it is an array',
          input: { secureCookie: ['rudderstack.com'] },
          expected: { ...defaultLoadOptions, secureCookie: false },
        },
        {
          name: 'should consider false secureCookie if it is a function',
          input: { secureCookie: () => {} },
          expected: { ...defaultLoadOptions, secureCookie: false },
        },
        {
          name: 'should consider false secureCookie if it is a symbol',
          input: { secureCookie: Symbol('rudderstack.com') },
          expected: { ...defaultLoadOptions, secureCookie: false },
        },
        {
          name: 'should consider false secureCookie if it is null',
          input: { secureCookie: null },
          expected: { ...defaultLoadOptions, secureCookie: false },
        },
        {
          name: 'should ignore secureCookie if it is undefined',
          input: { secureCookie: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set secureCookie to the input (true) value',
          input: { secureCookie: true },
          expected: {
            ...defaultLoadOptions,
            secureCookie: true,
          },
        },
        {
          name: 'should set secureCookie to the input (false) value',
          input: { secureCookie: false },
          expected: {
            ...defaultLoadOptions,
            secureCookie: false,
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('sameDomainCookiesOnly', () => {
      const testCaseData: any[] = [
        {
          name: 'should consider false sameDomainCookiesOnly if it is a number',
          input: { sameDomainCookiesOnly: 123 },
          expected: { ...defaultLoadOptions, sameDomainCookiesOnly: false },
        },
        {
          name: 'should consider false sameDomainCookiesOnly if it is a string',
          input: { sameDomainCookiesOnly: 'Invalid' },
          expected: { ...defaultLoadOptions, sameDomainCookiesOnly: false },
        },
        {
          name: 'should consider false sameDomainCookiesOnly if it is an object',
          input: { sameDomainCookiesOnly: { domain: 'rudderstack.com' } },
          expected: { ...defaultLoadOptions, sameDomainCookiesOnly: false },
        },
        {
          name: 'should consider false sameDomainCookiesOnly if it is an array',
          input: { sameDomainCookiesOnly: ['rudderstack.com'] },
          expected: { ...defaultLoadOptions, sameDomainCookiesOnly: false },
        },
        {
          name: 'should consider false sameDomainCookiesOnly if it is a function',
          input: { sameDomainCookiesOnly: () => {} },
          expected: { ...defaultLoadOptions, sameDomainCookiesOnly: false },
        },
        {
          name: 'should consider false sameDomainCookiesOnly if it is a symbol',
          input: { sameDomainCookiesOnly: Symbol('rudderstack.com') },
          expected: { ...defaultLoadOptions, sameDomainCookiesOnly: false },
        },
        {
          name: 'should consider false sameDomainCookiesOnly if it is null',
          input: { sameDomainCookiesOnly: null },
          expected: { ...defaultLoadOptions, sameDomainCookiesOnly: false },
        },
        {
          name: 'should ignore sameDomainCookiesOnly if it is undefined',
          input: { sameDomainCookiesOnly: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set sameDomainCookiesOnly to the input (true) value',
          input: { sameDomainCookiesOnly: true },
          expected: {
            ...defaultLoadOptions,
            sameDomainCookiesOnly: true,
          },
        },
        {
          name: 'should set sameDomainCookiesOnly to the input (false) value',
          input: { sameDomainCookiesOnly: false },
          expected: {
            ...defaultLoadOptions,
            sameDomainCookiesOnly: false,
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('uaChTrackLevel', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore uaChTrackLevel if it is not a valid value',
          input: { uaChTrackLevel: 'Invalid' },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore uaChTrackLevel if it is a number',
          input: { uaChTrackLevel: 123 },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore uaChTrackLevel if it is a boolean',
          input: { uaChTrackLevel: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore uaChTrackLevel if it is an object',
          input: { uaChTrackLevel: { domain: 'rudderstack.com' } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore uaChTrackLevel if it is an array',
          input: { uaChTrackLevel: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore uaChTrackLevel if it is a function',
          input: { uaChTrackLevel: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore uaChTrackLevel if it is a symbol',
          input: { uaChTrackLevel: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore uaChTrackLevel if it is null',
          input: { uaChTrackLevel: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore uaChTrackLevel if it is undefined',
          input: { uaChTrackLevel: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set uaChTrackLevel to the input (none) value',
          input: { uaChTrackLevel: 'none' },
          expected: {
            ...defaultLoadOptions,
            uaChTrackLevel: 'none',
          },
        },
        {
          name: 'should set uaChTrackLevel to the input (default) value',
          input: { uaChTrackLevel: 'default' },
          expected: {
            ...defaultLoadOptions,
            uaChTrackLevel: 'default',
          },
        },
        {
          name: 'should set uaChTrackLevel to the input (full) value',
          input: { uaChTrackLevel: 'full' },
          expected: {
            ...defaultLoadOptions,
            uaChTrackLevel: 'full',
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('integrations', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore integrations if it is not an object',
          input: { integrations: 'Invalid' },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore integrations if it is a number',
          input: { integrations: 123 },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore integrations if it is a boolean',
          input: { integrations: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore integrations if it is an array',
          input: { integrations: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore integrations if it is a function',
          input: { integrations: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore integrations if it is a symbol',
          input: { integrations: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore integrations if it is null',
          input: { integrations: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore integrations if it is undefined',
          input: { integrations: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set integrations to the input value (merged with default)',
          input: { integrations: { GoogleAnalytics: true } },
          expected: {
            ...defaultLoadOptions,
            integrations: { All: true, GoogleAnalytics: true },
          },
        },
        {
          name: 'should set integrations to the input value (override values)',
          input: {
            integrations: {
              All: false,
              GoogleAnalytics: true,
              Mixpanel: false,
              VWO: undefined,
              GA: null,
            },
          },
          expected: {
            ...defaultLoadOptions,
            integrations: { All: false, GoogleAnalytics: true, Mixpanel: false },
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('plugins', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore plugins if it is a string',
          input: { plugins: 'Invalid' },
          expected: { ...defaultLoadOptions, plugins: defaultOptionalPluginsList },
        },
        {
          name: 'should ignore plugins if it is a number',
          input: { plugins: 123 },
          expected: { ...defaultLoadOptions, plugins: defaultOptionalPluginsList },
        },
        {
          name: 'should ignore plugins if it is a boolean',
          input: { plugins: true },
          expected: { ...defaultLoadOptions, plugins: defaultOptionalPluginsList },
        },
        {
          name: 'should ignore plugins if it is an object',
          input: { plugins: { domain: 'rudderstack.com' } },
          expected: { ...defaultLoadOptions, plugins: defaultOptionalPluginsList },
        },
        {
          name: 'should ignore plugins if it is a string',
          input: { plugins: 'rudderstack.com' },
          expected: { ...defaultLoadOptions, plugins: defaultOptionalPluginsList },
        },
        {
          name: 'should ignore plugins if it is a function',
          input: { plugins: () => {} },
          expected: { ...defaultLoadOptions, plugins: defaultOptionalPluginsList },
        },
        {
          name: 'should ignore plugins if it is a symbol',
          input: { plugins: Symbol('rudderstack.com') },
          expected: { ...defaultLoadOptions, plugins: defaultOptionalPluginsList },
        },
        {
          name: 'should ignore plugins if it is null',
          input: { plugins: null },
          expected: { ...defaultLoadOptions, plugins: defaultOptionalPluginsList },
        },
        {
          name: 'should ignore plugins if it is undefined',
          input: { plugins: undefined },
          expected: { ...defaultLoadOptions, plugins: defaultOptionalPluginsList },
        },
        {
          name: 'should set plugins to the input value',
          input: { plugins: ['StorageMigrator', 'OneTrustConsentManager'] },
          expected: {
            ...defaultLoadOptions,
            plugins: ['StorageMigrator', 'OneTrustConsentManager'],
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual(
          expected,
        );
      });
    });

    describe('useGlobalIntegrationsConfigInEvents', () => {
      const testCaseData: any[] = [
        {
          name: 'should consider false useGlobalIntegrationsConfigInEvents if it is a string',
          input: { useGlobalIntegrationsConfigInEvents: 'Invalid' },
          expected: { ...defaultLoadOptions, useGlobalIntegrationsConfigInEvents: false },
        },
        {
          name: 'should consider false useGlobalIntegrationsConfigInEvents if it is a number',
          input: { useGlobalIntegrationsConfigInEvents: 123 },
          expected: { ...defaultLoadOptions, useGlobalIntegrationsConfigInEvents: false },
        },
        {
          name: 'should consider false useGlobalIntegrationsConfigInEvents if it is an object',
          input: { useGlobalIntegrationsConfigInEvents: { domain: 'rudderstack.com' } },
          expected: { ...defaultLoadOptions, useGlobalIntegrationsConfigInEvents: false },
        },
        {
          name: 'should consider false useGlobalIntegrationsConfigInEvents if it is an array',
          input: { useGlobalIntegrationsConfigInEvents: ['rudderstack.com'] },
          expected: { ...defaultLoadOptions, useGlobalIntegrationsConfigInEvents: false },
        },
        {
          name: 'should consider false useGlobalIntegrationsConfigInEvents if it is a function',
          input: { useGlobalIntegrationsConfigInEvents: () => {} },
          expected: { ...defaultLoadOptions, useGlobalIntegrationsConfigInEvents: false },
        },
        {
          name: 'should consider false useGlobalIntegrationsConfigInEvents if it is a symbol',
          input: { useGlobalIntegrationsConfigInEvents: Symbol('rudderstack.com') },
          expected: { ...defaultLoadOptions, useGlobalIntegrationsConfigInEvents: false },
        },
        {
          name: 'should consider false useGlobalIntegrationsConfigInEvents if it is null',
          input: { useGlobalIntegrationsConfigInEvents: null },
          expected: { ...defaultLoadOptions, useGlobalIntegrationsConfigInEvents: false },
        },
        {
          name: 'should ignore useGlobalIntegrationsConfigInEvents if it is undefined',
          input: { useGlobalIntegrationsConfigInEvents: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set useGlobalIntegrationsConfigInEvents to the input (true) value',
          input: { useGlobalIntegrationsConfigInEvents: true },
          expected: {
            ...defaultLoadOptions,
            useGlobalIntegrationsConfigInEvents: true,
          },
        },
        {
          name: 'should set useGlobalIntegrationsConfigInEvents to the input (false) value',
          input: { useGlobalIntegrationsConfigInEvents: false },
          expected: {
            ...defaultLoadOptions,
            useGlobalIntegrationsConfigInEvents: false,
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('bufferDataPlaneEventsUntilReady', () => {
      const testCaseData: any[] = [
        {
          name: 'should consider false bufferDataPlaneEventsUntilReady if it is a string',
          input: { bufferDataPlaneEventsUntilReady: 'Invalid' },
          expected: { ...defaultLoadOptions, bufferDataPlaneEventsUntilReady: false },
        },
        {
          name: 'should consider false bufferDataPlaneEventsUntilReady if it is a number',
          input: { bufferDataPlaneEventsUntilReady: 123 },
          expected: { ...defaultLoadOptions, bufferDataPlaneEventsUntilReady: false },
        },
        {
          name: 'should consider false bufferDataPlaneEventsUntilReady if it is an object',
          input: { bufferDataPlaneEventsUntilReady: { domain: 'rudderstack.com' } },
          expected: { ...defaultLoadOptions, bufferDataPlaneEventsUntilReady: false },
        },
        {
          name: 'should consider false bufferDataPlaneEventsUntilReady if it is an array',
          input: { bufferDataPlaneEventsUntilReady: ['rudderstack.com'] },
          expected: { ...defaultLoadOptions, bufferDataPlaneEventsUntilReady: false },
        },
        {
          name: 'should consider false bufferDataPlaneEventsUntilReady if it is a function',
          input: { bufferDataPlaneEventsUntilReady: () => {} },
          expected: { ...defaultLoadOptions, bufferDataPlaneEventsUntilReady: false },
        },
        {
          name: 'should consider false bufferDataPlaneEventsUntilReady if it is a symbol',
          input: { bufferDataPlaneEventsUntilReady: Symbol('rudderstack.com') },
          expected: { ...defaultLoadOptions, bufferDataPlaneEventsUntilReady: false },
        },
        {
          name: 'should consider false bufferDataPlaneEventsUntilReady if it is null',
          input: { bufferDataPlaneEventsUntilReady: null },
          expected: { ...defaultLoadOptions, bufferDataPlaneEventsUntilReady: false },
        },
        {
          name: 'should ignore bufferDataPlaneEventsUntilReady if it is undefined',
          input: { bufferDataPlaneEventsUntilReady: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set bufferDataPlaneEventsUntilReady to the input (true) value',
          input: { bufferDataPlaneEventsUntilReady: true },
          expected: {
            ...defaultLoadOptions,
            bufferDataPlaneEventsUntilReady: true,
          },
        },
        {
          name: 'should set bufferDataPlaneEventsUntilReady to the input (false) value',
          input: { bufferDataPlaneEventsUntilReady: false },
          expected: {
            ...defaultLoadOptions,
            bufferDataPlaneEventsUntilReady: false,
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('sendAdblockPage', () => {
      const testCaseData: any[] = [
        {
          name: 'should consider false sendAdblockPage if it is a string',
          input: { sendAdblockPage: 'Invalid' },
          expected: { ...defaultLoadOptions, sendAdblockPage: false },
        },
        {
          name: 'should consider false sendAdblockPage if it is a number',
          input: { sendAdblockPage: 123 },
          expected: { ...defaultLoadOptions, sendAdblockPage: false },
        },
        {
          name: 'should consider false sendAdblockPage if it is an object',
          input: { sendAdblockPage: { domain: 'rudderstack.com' } },
          expected: { ...defaultLoadOptions, sendAdblockPage: false },
        },
        {
          name: 'should consider false sendAdblockPage if it is an array',
          input: { sendAdblockPage: ['rudderstack.com'] },
          expected: { ...defaultLoadOptions, sendAdblockPage: false },
        },
        {
          name: 'should consider false sendAdblockPage if it is a function',
          input: { sendAdblockPage: () => {} },
          expected: { ...defaultLoadOptions, sendAdblockPage: false },
        },
        {
          name: 'should consider false sendAdblockPage if it is a symbol',
          input: { sendAdblockPage: Symbol('rudderstack.com') },
          expected: { ...defaultLoadOptions, sendAdblockPage: false },
        },
        {
          name: 'should consider false sendAdblockPage if it is null',
          input: { sendAdblockPage: null },
          expected: { ...defaultLoadOptions, sendAdblockPage: false },
        },
        {
          name: 'should ignore sendAdblockPage if it is undefined',
          input: { sendAdblockPage: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set sendAdblockPage to the input (true) value',
          input: { sendAdblockPage: true },
          expected: {
            ...defaultLoadOptions,
            sendAdblockPage: true,
          },
        },
        {
          name: 'should set sendAdblockPage to the input (false) value',
          input: { sendAdblockPage: false },
          expected: {
            ...defaultLoadOptions,
            sendAdblockPage: false,
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('sendAdblockPageOptions', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore sendAdblockPageOptions if it is a number',
          input: { sendAdblockPageOptions: 123 },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sendAdblockPageOptions if it is a boolean',
          input: { sendAdblockPageOptions: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sendAdblockPageOptions if it is a string',
          input: { sendAdblockPageOptions: 'Invalid' },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sendAdblockPageOptions if it is an array',
          input: { sendAdblockPageOptions: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sendAdblockPageOptions if it is a function',
          input: { sendAdblockPageOptions: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sendAdblockPageOptions if it is a symbol',
          input: { sendAdblockPageOptions: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sendAdblockPageOptions if it is null',
          input: { sendAdblockPageOptions: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore sendAdblockPageOptions if it is undefined',
          input: { sendAdblockPageOptions: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set sendAdblockPageOptions to the input value',
          input: {
            sendAdblockPageOptions: {
              endpoint: 'https://api.rudderstack.com',
              undefinedProperty: undefined,
              nullProperty: null,
            },
          },
          expected: {
            ...defaultLoadOptions,
            sendAdblockPageOptions: { endpoint: 'https://api.rudderstack.com' },
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('useServerSideCookies', () => {
      const testCaseData: any[] = [
        {
          name: 'should consider false useServerSideCookies if it is a string',
          input: { useServerSideCookies: 'Invalid' },
          expected: { ...defaultLoadOptions, useServerSideCookies: false },
        },
        {
          name: 'should consider false useServerSideCookies if it is a number',
          input: { useServerSideCookies: 123 },
          expected: { ...defaultLoadOptions, useServerSideCookies: false },
        },
        {
          name: 'should consider false useServerSideCookies if it is an object',
          input: { useServerSideCookies: { domain: 'rudderstack.com' } },
          expected: { ...defaultLoadOptions, useServerSideCookies: false },
        },
        {
          name: 'should consider false useServerSideCookies if it is an array',
          input: { useServerSideCookies: ['rudderstack.com'] },
          expected: { ...defaultLoadOptions, useServerSideCookies: false },
        },
        {
          name: 'should consider false useServerSideCookies if it is a function',
          input: { useServerSideCookies: () => {} },
          expected: { ...defaultLoadOptions, useServerSideCookies: false },
        },
        {
          name: 'should consider false useServerSideCookies if it is a symbol',
          input: { useServerSideCookies: Symbol('rudderstack.com') },
          expected: { ...defaultLoadOptions, useServerSideCookies: false },
        },
        {
          name: 'should consider false useServerSideCookies if it is null',
          input: { useServerSideCookies: null },
          expected: { ...defaultLoadOptions, useServerSideCookies: false },
        },
        {
          name: 'should ignore useServerSideCookies if it is undefined',
          input: { useServerSideCookies: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set useServerSideCookies to the input (true) value',
          input: { useServerSideCookies: true },
          expected: {
            ...defaultLoadOptions,
            useServerSideCookies: true,
          },
        },
        {
          name: 'should set useServerSideCookies to the input (false) value',
          input: { useServerSideCookies: false },
          expected: {
            ...defaultLoadOptions,
            useServerSideCookies: false,
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('dataServiceEndpoint', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore dataServiceEndpoint if it is a number',
          input: { dataServiceEndpoint: 123 },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataServiceEndpoint if it is a boolean',
          input: { dataServiceEndpoint: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataServiceEndpoint if it is an object',
          input: { dataServiceEndpoint: { domain: 'rudderstack.com' } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataServiceEndpoint if it is an array',
          input: { dataServiceEndpoint: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataServiceEndpoint if it is a function',
          input: { dataServiceEndpoint: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataServiceEndpoint if it is a symbol',
          input: { dataServiceEndpoint: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataServiceEndpoint if it is null',
          input: { dataServiceEndpoint: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataServiceEndpoint if it is undefined',
          input: { dataServiceEndpoint: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set dataServiceEndpoint to the input (string) value',
          input: { dataServiceEndpoint: 'https://api.rudderstack.com' },
          expected: {
            ...defaultLoadOptions,
            dataServiceEndpoint: 'https://api.rudderstack.com',
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('loadIntegration', () => {
      const testCaseData: any[] = [
        {
          name: 'should consider false loadIntegration if it is a string',
          input: { loadIntegration: 'Invalid' },
          expected: { ...defaultLoadOptions, loadIntegration: false },
        },
        {
          name: 'should consider false loadIntegration if it is a number',
          input: { loadIntegration: 123 },
          expected: { ...defaultLoadOptions, loadIntegration: false },
        },
        {
          name: 'should consider false loadIntegration if it is an object',
          input: { loadIntegration: { domain: 'rudderstack.com' } },
          expected: { ...defaultLoadOptions, loadIntegration: false },
        },
        {
          name: 'should consider false loadIntegration if it is an array',
          input: { loadIntegration: ['rudderstack.com'] },
          expected: { ...defaultLoadOptions, loadIntegration: false },
        },
        {
          name: 'should consider false loadIntegration if it is a function',
          input: { loadIntegration: () => {} },
          expected: { ...defaultLoadOptions, loadIntegration: false },
        },
        {
          name: 'should consider false loadIntegration if it is a symbol',
          input: { loadIntegration: Symbol('rudderstack.com') },
          expected: { ...defaultLoadOptions, loadIntegration: false },
        },
        {
          name: 'should consider false loadIntegration if it is null',
          input: { loadIntegration: null },
          expected: { ...defaultLoadOptions, loadIntegration: false },
        },
        {
          name: 'should ignore loadIntegration if it is undefined',
          input: { loadIntegration: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set loadIntegration to the input (true) value',
          input: { loadIntegration: true },
          expected: {
            ...defaultLoadOptions,
            loadIntegration: true,
          },
        },
        {
          name: 'should set loadIntegration to the input (false) value',
          input: { loadIntegration: false },
          expected: {
            ...defaultLoadOptions,
            loadIntegration: false,
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('destinationsQueueOptions', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore destinationsQueueOptions if it is a number',
          input: { destinationsQueueOptions: 123 },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore destinationsQueueOptions if it is a boolean',
          input: { destinationsQueueOptions: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore destinationsQueueOptions if it is a string',
          input: { destinationsQueueOptions: 'Invalid' },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore destinationsQueueOptions if it is an array',
          input: { destinationsQueueOptions: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore destinationsQueueOptions if it is a function',
          input: { destinationsQueueOptions: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore destinationsQueueOptions if it is a symbol',
          input: { destinationsQueueOptions: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore destinationsQueueOptions if it is null',
          input: { destinationsQueueOptions: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore destinationsQueueOptions if it is undefined',
          input: { destinationsQueueOptions: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set destinationsQueueOptions to the input value',
          input: {
            destinationsQueueOptions: {
              maxItems: 100,
              maxBytes: 1024,
              undefinedProperty: undefined,
              nullProperty: null,
            },
          },
          expected: {
            ...defaultLoadOptions,
            destinationsQueueOptions: { maxItems: 100, maxBytes: 1024 },
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('queueOptions', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore queueOptions if it is a number',
          input: { queueOptions: 123 },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore queueOptions if it is a boolean',
          input: { queueOptions: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore queueOptions if it is a string',
          input: { queueOptions: 'Invalid' },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore queueOptions if it is an array',
          input: { queueOptions: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore queueOptions if it is a function',
          input: { queueOptions: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore queueOptions if it is a symbol',
          input: { queueOptions: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore queueOptions if it is null',
          input: { queueOptions: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore queueOptions if it is undefined',
          input: { queueOptions: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set queueOptions to the input value',
          input: {
            queueOptions: {
              maxItems: 100,
              maxBytes: 1024,
              undefinedProperty: undefined,
              nullProperty: null,
            },
          },
          expected: {
            ...defaultLoadOptions,
            queueOptions: { maxItems: 100, maxBytes: 1024 },
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('beaconQueueOptions', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore beaconQueueOptions if it is a number',
          input: { beaconQueueOptions: 123 },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore beaconQueueOptions if it is a boolean',
          input: { beaconQueueOptions: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore beaconQueueOptions if it is a string',
          input: { beaconQueueOptions: 'Invalid' },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore beaconQueueOptions if it is an array',
          input: { beaconQueueOptions: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore beaconQueueOptions if it is a function',
          input: { beaconQueueOptions: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore beaconQueueOptions if it is a symbol',
          input: { beaconQueueOptions: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore beaconQueueOptions if it is null',
          input: { beaconQueueOptions: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore beaconQueueOptions if it is undefined',
          input: { beaconQueueOptions: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set beaconQueueOptions to the input value',
          input: {
            beaconQueueOptions: {
              maxItems: 100,
              maxBytes: 1024,
              undefinedProperty: undefined,
              nullProperty: null,
            },
          },
          expected: {
            ...defaultLoadOptions,
            beaconQueueOptions: { maxItems: 100, maxBytes: 1024 },
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('lockIntegrationsVersion', () => {
      const testCaseData: any[] = [
        {
          name: 'should consider false lockIntegrationsVersion if it is a number',
          input: { lockIntegrationsVersion: 123 },
          expected: { ...defaultLoadOptions, lockIntegrationsVersion: false },
        },
        {
          name: 'should consider false lockIntegrationsVersion if it is a string',
          input: { lockIntegrationsVersion: 'Invalid' },
          expected: { ...defaultLoadOptions, lockIntegrationsVersion: false },
        },
        {
          name: 'should consider false lockIntegrationsVersion if it is an array',
          input: { lockIntegrationsVersion: ['rudderstack.com'] },
          expected: { ...defaultLoadOptions, lockIntegrationsVersion: false },
        },
        {
          name: 'should consider false lockIntegrationsVersion if it is a function',
          input: { lockIntegrationsVersion: () => {} },
          expected: { ...defaultLoadOptions, lockIntegrationsVersion: false },
        },
        {
          name: 'should consider false lockIntegrationsVersion if it is a symbol',
          input: { lockIntegrationsVersion: Symbol('rudderstack.com') },
          expected: { ...defaultLoadOptions, lockIntegrationsVersion: false },
        },
        {
          name: 'should consider false lockIntegrationsVersion if it is null',
          input: { lockIntegrationsVersion: null },
          expected: { ...defaultLoadOptions, lockIntegrationsVersion: false },
        },
        {
          name: 'should ignore lockIntegrationsVersion if it is undefined',
          input: { lockIntegrationsVersion: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set lockIntegrationsVersion to the input(true) value',
          input: { lockIntegrationsVersion: true },
          expected: {
            ...defaultLoadOptions,
            lockIntegrationsVersion: true,
          },
        },
        {
          name: 'should set lockIntegrationsVersion to the input(false) value',
          input: { lockIntegrationsVersion: false },
          expected: {
            ...defaultLoadOptions,
            lockIntegrationsVersion: false,
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('lockPluginsVersion', () => {
      const testCaseData: any[] = [
        {
          name: 'should consider false lockPluginsVersion if it is a number',
          input: { lockPluginsVersion: 123 },
          expected: { ...defaultLoadOptions, lockPluginsVersion: false },
        },
        {
          name: 'should consider false lockPluginsVersion if it is a string',
          input: { lockPluginsVersion: 'Invalid' },
          expected: { ...defaultLoadOptions, lockPluginsVersion: false },
        },
        {
          name: 'should consider false lockPluginsVersion if it is an array',
          input: { lockPluginsVersion: ['rudderstack.com'] },
          expected: { ...defaultLoadOptions, lockPluginsVersion: false },
        },
        {
          name: 'should consider false lockPluginsVersion if it is a function',
          input: { lockPluginsVersion: () => {} },
          expected: { ...defaultLoadOptions, lockPluginsVersion: false },
        },
        {
          name: 'should consider false lockPluginsVersion if it is a symbol',
          input: { lockPluginsVersion: Symbol('rudderstack.com') },
          expected: { ...defaultLoadOptions, lockPluginsVersion: false },
        },
        {
          name: 'should consider false lockPluginsVersion if it is null',
          input: { lockPluginsVersion: null },
          expected: { ...defaultLoadOptions, lockPluginsVersion: false },
        },
        {
          name: 'should ignore lockPluginsVersion if it is undefined',
          input: { lockPluginsVersion: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set lockPluginsVersion to the input(true) value',
          input: { lockPluginsVersion: true },
          expected: {
            ...defaultLoadOptions,
            lockPluginsVersion: true,
          },
        },
        {
          name: 'should set lockPluginsVersion to the input(false) value',
          input: { lockPluginsVersion: false },
          expected: {
            ...defaultLoadOptions,
            lockPluginsVersion: false,
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('dataPlaneEventsBufferTimeout', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore dataPlaneEventsBufferTimeout if it is a boolean',
          input: { dataPlaneEventsBufferTimeout: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataPlaneEventsBufferTimeout if it is a string',
          input: { dataPlaneEventsBufferTimeout: 'Invalid' },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataPlaneEventsBufferTimeout if it is an array',
          input: { dataPlaneEventsBufferTimeout: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataPlaneEventsBufferTimeout if it is a function',
          input: { dataPlaneEventsBufferTimeout: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataPlaneEventsBufferTimeout if it is a symbol',
          input: { dataPlaneEventsBufferTimeout: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataPlaneEventsBufferTimeout if it is null',
          input: { dataPlaneEventsBufferTimeout: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore dataPlaneEventsBufferTimeout if it is undefined',
          input: { dataPlaneEventsBufferTimeout: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set dataPlaneEventsBufferTimeout to the input value',
          input: { dataPlaneEventsBufferTimeout: 1000 },
          expected: {
            ...defaultLoadOptions,
            dataPlaneEventsBufferTimeout: 1000,
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('preConsent', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore preConsent if it is a number',
          input: { preConsent: 123 },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore preConsent if it is a boolean',
          input: { preConsent: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore preConsent if it is a string',
          input: { preConsent: 'Invalid' },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore preConsent if it is an array',
          input: { preConsent: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore preConsent if it is a function',
          input: { preConsent: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore preConsent if it is a symbol',
          input: { preConsent: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore preConsent if it is null',
          input: { preConsent: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore preConsent if it is undefined',
          input: { preConsent: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set preConsent to the input value',
          input: { preConsent: { enable: true, undefinedProperty: undefined, nullProperty: null } },
          expected: {
            ...defaultLoadOptions,
            preConsent: { enable: true },
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });

    describe('storage', () => {
      const testCaseData: any[] = [
        {
          name: 'should ignore storage if it is a number',
          input: { storage: 123 },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage if it is a boolean',
          input: { storage: true },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage if it is a string',
          input: { storage: 'Invalid' },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage if it is an array',
          input: { storage: ['rudderstack.com'] },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage if it is a function',
          input: { storage: () => {} },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage if it is a symbol',
          input: { storage: Symbol('rudderstack.com') },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage if it is null',
          input: { storage: null },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage if it is undefined',
          input: { storage: undefined },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set storage to the input value',
          input: {
            storage: { type: 'cookieStorage', undefinedProperty: undefined, nullProperty: null },
          },
          expected: {
            ...defaultLoadOptions,
            storage: {
              type: 'cookieStorage',
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: true,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should consider false for storage.migrate if it is a string',
          input: { storage: { migrate: 'Invalid' } },
          expected: {
            ...defaultLoadOptions,
            storage: {
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: false,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should consider false for storage.migrate if it is a number',
          input: { storage: { migrate: 123 } },
          expected: {
            ...defaultLoadOptions,
            storage: {
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: false,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should consider false for storage.migrate if it is a boolean',
          input: { storage: { migrate: true } },
          expected: {
            ...defaultLoadOptions,
            storage: {
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: true,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should consider false for storage.migrate if it is an object',
          input: { storage: { migrate: { domain: 'rudderstack.com' } } },
          expected: {
            ...defaultLoadOptions,
            storage: {
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: false,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should consider false for storage.migrate if it is an array',
          input: { storage: { migrate: ['rudderstack.com'] } },
          expected: {
            ...defaultLoadOptions,
            storage: {
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: false,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should consider false for storage.migrate if it is a function',
          input: { storage: { migrate: () => {} } },
          expected: {
            ...defaultLoadOptions,
            storage: {
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: false,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should consider false for storage.migrate if it is a symbol',
          input: { storage: { migrate: Symbol('rudderstack.com') } },
          expected: {
            ...defaultLoadOptions,
            storage: {
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: false,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should consider false for storage.migrate if it is null',
          input: { storage: { migrate: null } },
          expected: {
            ...defaultLoadOptions,
            storage: {
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: false,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should ignore storage.migrate if it is undefined',
          input: { storage: { migrate: undefined } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set storage.migrate to the input (true) value',
          input: { storage: { migrate: true } },
          expected: {
            ...defaultLoadOptions,
            storage: {
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: true,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should set storage.migrate to the input (false) value',
          input: { storage: { migrate: false } },
          expected: {
            ...defaultLoadOptions,
            storage: {
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: false,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should ignore storage.cookie if it is a number',
          input: { storage: { cookie: 123 } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.cookie if it is a boolean',
          input: { storage: { cookie: true } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.cookie if it is a string',
          input: { storage: { cookie: 'Invalid' } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.cookie if it is an array',
          input: { storage: { cookie: ['rudderstack.com'] } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.cookie if it is a function',
          input: { storage: { cookie: () => {} } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.cookie if it is a symbol',
          input: { storage: { cookie: Symbol('rudderstack.com') } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.cookie if it is null',
          input: { storage: { cookie: null } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.cookie if it is undefined',
          input: { storage: { cookie: undefined } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set storage.cookie to the input value',
          input: {
            storage: {
              cookie: {
                domain: 'rudderstack.com',
                undefinedProperty: undefined,
                nullProperty: null,
              },
            },
          },
          expected: {
            ...defaultLoadOptions,
            storage: {
              cookie: { domain: 'rudderstack.com' },
              migrate: defaultLoadOptions.storage?.migrate,
              encryption: defaultLoadOptions.storage?.encryption,
            },
          },
        },
        {
          name: 'should ignore storage.encryption if it is a number',
          input: { storage: { encryption: 123 } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.encryption if it is a boolean',
          input: { storage: { encryption: true } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.encryption if it is a string',
          input: { storage: { encryption: 'Invalid' } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.encryption if it is an array',
          input: { storage: { encryption: ['rudderstack.com'] } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.encryption if it is a function',
          input: { storage: { encryption: () => {} } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.encryption if it is a symbol',
          input: { storage: { encryption: Symbol('rudderstack.com') } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.encryption if it is null',
          input: { storage: { encryption: null } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should ignore storage.encryption if it is undefined',
          input: { storage: { encryption: undefined } },
          expected: defaultLoadOptions,
        },
        {
          name: 'should set storage.encryption to the input value',
          input: {
            storage: {
              encryption: { version: 'legacy', undefinedProperty: undefined, nullProperty: null },
            },
          },
          expected: {
            ...defaultLoadOptions,
            storage: {
              encryption: { version: 'legacy' },
              cookie: defaultLoadOptions.storage?.cookie,
              migrate: defaultLoadOptions.storage?.migrate,
            },
          },
        },
      ];

      it.each(testCaseData)('$name', ({ input, expected }) => {
        expect(normalizeLoadOptions(defaultLoadOptions, input as Partial<LoadOptions>)).toEqual({
          ...expected,
          plugins: defaultOptionalPluginsList,
        });
      });
    });
  });
});
