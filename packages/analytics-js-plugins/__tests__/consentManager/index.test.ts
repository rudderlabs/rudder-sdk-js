import { ConsentManager } from '@rudderstack/analytics-js-plugins/consentManager';
import { PluginName } from '@rudderstack/analytics-js-plugins/types/common';
import { state, resetState } from '@rudderstack/analytics-js/state';
import { defaultPluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';

describe('Plugin - ConsentManager', () => {
  beforeEach(() => {
    resetState();
  });
  it('should add ConsentManager plugin in the loaded plugin list', () => {
    ConsentManager().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes(PluginName.ConsentManager)).toBe(true);
  });

  it('should initialize the ConsentManager and add values in state when selected consent manager is initialized', () => {
    const mockResponseFromSelectedConsentManager = {
      consentManagerInitialized: true,
      allowedConsentIds: ['C0001', 'C0003'],
      deniedConsentIds: ['C0002', 'C0004', 'C0005'],
    };
    defaultPluginsManager.invokeSingle = jest.fn(() => mockResponseFromSelectedConsentManager);
    ConsentManager().consentManager.init(state, defaultPluginsManager, defaultLogger);
    expect(state.consents.consentManagerInitialized.value).toBeTruthy();
    expect(state.consents.allowedConsentIds.value).toStrictEqual(
      mockResponseFromSelectedConsentManager.allowedConsentIds,
    );
    expect(state.consents.deniedConsentIds.value).toStrictEqual(
      mockResponseFromSelectedConsentManager.deniedConsentIds,
    );
  });
  it('should initialize the ConsentManager and state values will not set when selected consent manager is not initialized', () => {
    const mockResponseFromSelectedConsentManager = {
      consentManagerInitialized: false,
    };
    defaultPluginsManager.invokeSingle = jest.fn(() => mockResponseFromSelectedConsentManager);
    ConsentManager().consentManager.init(state, defaultPluginsManager, defaultLogger);
    expect(state.consents.consentManagerInitialized.value).toBe(false);
    expect(state.consents.allowedConsentIds.value).toStrictEqual([]);
    expect(state.consents.deniedConsentIds.value).toStrictEqual([]);
  });
});
