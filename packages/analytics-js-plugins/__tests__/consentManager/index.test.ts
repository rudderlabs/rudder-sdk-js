import { ConsentManager } from '@rudderstack/analytics-js-plugins/consentManager';
import { PluginName } from '@rudderstack/analytics-js-plugins/types/common';
import { state, resetState } from '@rudderstack/analytics-js/state';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';

describe('Plugin - ConsentManager', () => {
  const pluginManager = new PluginsManager(defaultPluginEngine, defaultErrorHandler, defaultLogger);
  beforeEach(() => {
    resetState();
  });
  it('should add ConsentManager plugin in the loaded plugin list', () => {
    ConsentManager().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes(PluginName.ConsentManager)).toBe(true);
  });

  it('should initialize the ConsentManager and add values in state when selected consent manager is initialized', () => {
    const mockResponseFromSelectedConsentManager = {
      consentProviderInitialized: true,
      allowedConsents: { C0001: 'Performance Cookies', C0003: 'Functional Cookies' },
      deniedConsentIds: ['C0002', 'C0004', 'C0005'],
    };

    pluginManager.invokeSingle = jest.fn(() => mockResponseFromSelectedConsentManager);
    ConsentManager().consentManager.init(state, pluginManager, defaultLogger);
    expect(state.consents.consentProviderInitialized.value).toBeTruthy();
    expect(state.consents.allowedConsents.value).toStrictEqual(
      mockResponseFromSelectedConsentManager.allowedConsents,
    );
    expect(state.consents.deniedConsentIds.value).toStrictEqual(
      mockResponseFromSelectedConsentManager.deniedConsentIds,
    );
  });
  it('should initialize the ConsentManager and state values will not set when selected consent manager is not initialized', () => {
    const mockResponseFromSelectedConsentManager = {
      consentProviderInitialized: false,
    };
    pluginManager.invokeSingle = jest.fn(() => mockResponseFromSelectedConsentManager);
    ConsentManager().consentManager.init(state, pluginManager, defaultLogger);
    expect(state.consents.consentProviderInitialized.value).toBe(false);
    expect(state.consents.allowedConsents.value).toStrictEqual({});
    expect(state.consents.deniedConsentIds.value).toStrictEqual([]);
  });

  it('should return true if destination category is consented', () => {
    const mockResponseFromSelectedConsentManager = true;
    pluginManager.invokeSingle = jest.fn(() => mockResponseFromSelectedConsentManager);
    const output = ConsentManager().consentManager.isDestinationConsented(
      state,
      pluginManager,
      {},
      defaultLogger,
    );
    expect(output).toBeTruthy();
  });
  it('should return false if destination category is not consented', () => {
    const mockResponseFromSelectedConsentManager = false;
    pluginManager.invokeSingle = jest.fn(() => mockResponseFromSelectedConsentManager);
    const output = ConsentManager().consentManager.isDestinationConsented(
      state,
      pluginManager,
      {},
      defaultLogger,
    );
    expect(output).toBeFalsy();
  });
});
