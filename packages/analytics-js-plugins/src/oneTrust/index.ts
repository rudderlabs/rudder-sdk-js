/* eslint-disable no-param-reassign */
import { ExtensionPlugin, PluginName, ApplicationState, ILogger } from '../types/common';
import { OneTrustGroup } from './types';

const pluginName = PluginName.OneTrust;
let allowedConsentIds: string[] = [];
const deniedConsentIds: string[] = [];

const OneTrust = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    console.log('inside OneTrust initialize');
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  oneTrust: {
    init(logger?: ILogger): void {
      console.log('inside OneTrust initialize');

      if (!(window as any).OneTrust || !(window as any).OnetrustActiveGroups) {
        logger?.error('OneTrust resources are not accessible.');
      } else {
        allowedConsentIds = (window as any).OnetrustActiveGroups.split(',').filter(
          (n: string) => n,
        ); // Category Ids user has consented

        const oneTrustAllGroupsInfo: OneTrustGroup[] = (window as any).OneTrust.GetDomainData()
          .Groups;
        oneTrustAllGroupsInfo.forEach((group: OneTrustGroup) => {
          const { CustomGroupId } = group;
          if (!allowedConsentIds.includes(CustomGroupId)) {
            deniedConsentIds.push(CustomGroupId);
          }
        });
      }
    },

    getConsent(): string[] {
      console.log('inside OneTrust getConsent');
      return allowedConsentIds;
    },

    getDeniedConsent(): string[] {
      console.log('inside OneTrust getDeniedConsent');
      return deniedConsentIds;
    },
  },
});

export { OneTrust };

export default OneTrust;
