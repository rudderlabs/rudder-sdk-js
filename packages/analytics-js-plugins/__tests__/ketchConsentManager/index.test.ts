import { state, resetState } from '@rudderstack/analytics-js/state';
import { KetchConsentManager } from '@rudderstack/analytics-js-plugins/ketchConsentManager';

describe('Plugin - KetchConsentManager', () => {
  beforeEach(() => {
    resetState();
  });

  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  };

  it('should add KetchConsentManager plugin in the loaded plugin list', () => {
    KetchConsentManager().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('KetchConsentManager')).toBe(true);
  });
});
