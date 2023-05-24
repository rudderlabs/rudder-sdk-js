/* eslint-disable no-param-reassign */
import { ExtensionPlugin, PluginName, ApplicationState, ILogger } from '../types/common';
import { ConsentInfo, OneTrustGroup } from './types';

const pluginName = PluginName.OneTrust;

const OneTrust = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  coreConsentManager: {
    getConsentInfo(logger?: ILogger): ConsentInfo {
      logger?.debug('OneTrust initialization');

      // In case OneTrust SDK is not loaded before RudderStack's JS SDK
      // it will be treated as Consent manager is not initialized
      if (!(window as any).OneTrust || !(window as any).OnetrustActiveGroups) {
        logger?.error('OneTrust resources are not accessible.');
        return { consentManagerInitialized: false };
      }

      // OneTrust SDK populates a data layer object OnetrustActiveGroups with
      // the cookie categories Ids that the user has consented to.
      // Eg: ',C0001,C0003,'
      // We split it and save it as an array.
      const allowedConsentIds = (window as any).OnetrustActiveGroups.split(',').filter(
        (n: string) => n,
      );
      const deniedConsentIds: string[] = [];

      // Get the groups(cookie categorization), user has created in one trust account.
      const oneTrustAllGroupsInfo: OneTrustGroup[] = (window as any).OneTrust.GetDomainData()
        .Groups;

      oneTrustAllGroupsInfo.forEach((group: OneTrustGroup) => {
        const { CustomGroupId } = group;
        if (!allowedConsentIds.includes(CustomGroupId)) {
          deniedConsentIds.push(CustomGroupId); // Populate denied consent Ids
        }
      });

      return { consentManagerInitialized: true, allowedConsentIds, deniedConsentIds };
    },
  },
});

export { OneTrust };

export default OneTrust;
