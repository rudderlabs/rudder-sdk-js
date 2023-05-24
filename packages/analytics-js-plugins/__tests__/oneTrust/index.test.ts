import { OneTrust } from '@rudderstack/analytics-js-plugins/oneTrust';
import { PluginName } from '@rudderstack/analytics-js-plugins/types/common';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { state } from '@rudderstack/analytics-js/state';

describe('Plugin - OneTrust', () => {
  it('should add OneTrust plugin in the loaded plugin list', () => {
    OneTrust().initialize(state);
    expect(state.plugins.loadedPlugins.value.includes(PluginName.OneTrust)).toBe(true);
  });

  it('should initialize the OneTrust and compute consentInfo if OneTrust native SDK is loaded', () => {
    (window as any).OneTrust = {
      GetDomainData: jest.fn(() => ({
        Groups: [
          { CustomGroupId: 'C0001', GroupName: 'Functional Cookies' },
          { CustomGroupId: 'C0002', GroupName: 'Performance Cookies' },
          { CustomGroupId: 'C0003', GroupName: 'Analytical Cookies' },
          { CustomGroupId: 'C0004', GroupName: 'Targeting Cookies' },
          { CustomGroupId: 'C0005', GroupName: 'Social Media Cookies' },
          { CustomGroupId: 'C0006', GroupName: 'Advertisement Cookies' },
        ],
      })),
    };
    (window as any).OnetrustActiveGroups = ',C0001,C0003,';
    const mockResponseFromOneTrust = {
      consentManagerInitialized: true,
      allowedConsentIds: ['C0001', 'C0003'],
      deniedConsentIds: ['C0002', 'C0004', 'C0005', 'C0006'],
    };
    const consentInfo = OneTrust().oneTrust.init(defaultLogger);
    expect(consentInfo).toStrictEqual(mockResponseFromOneTrust);
  });
  it('should not initialize the OneTrust plugin and return consentManagerInitialized as false if OneTrust native SDK is not loaded', () => {
    (window as any).OneTrust = undefined;
    (window as any).OnetrustActiveGroups = undefined;
    defaultLogger.error = jest.fn();
    const mockResponseFromOneTrust = {
      consentManagerInitialized: false,
    };
    const consentInfo = OneTrust().oneTrust.init(defaultLogger);
    expect(defaultLogger.error).toHaveBeenCalledWith('OneTrust resources are not accessible.');
    expect(consentInfo).toStrictEqual(mockResponseFromOneTrust);
  });
});
