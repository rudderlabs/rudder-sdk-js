/* eslint-disable no-param-reassign */
import {
  ApplicationState,
  ILogger,
  DestinationConfig,
  OneTrustCookieCategory,
  IStoreManager,
} from '../types/common';
import { ExtensionPlugin } from '../types/plugins';
import { ONETRUST_CONSENT_MANAGER_PLUGIN } from './constants';
import { DESTINATION_CONSENT_STATUS_ERROR, ONETRUST_ACCESS_ERROR } from '../utilities/logMessages';
import { OneTrustGroup } from './types';

const pluginName = 'OneTrustConsentManager';

const OneTrustConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(state: ApplicationState, storeManager?: IStoreManager, logger?: ILogger): void {
      if (!(globalThis as any).OneTrust || !(globalThis as any).OnetrustActiveGroups) {
        logger?.error(ONETRUST_ACCESS_ERROR(ONETRUST_CONSENT_MANAGER_PLUGIN));
        state.consents.data.value = { initialized: false };
        return;
      }

      // OneTrustConsentManager SDK populates a data layer object OnetrustActiveGroups with
      // the cookie categories Ids that the user has consented to.
      // Eg: ',C0001,C0003,'
      // We split it and save it as an array.
      const allowedConsentIds = (globalThis as any).OnetrustActiveGroups.split(',').filter(
        (n: string) => n,
      );
      const allowedConsents: Record<string, string> = {};
      const deniedConsentIds: string[] = [];

      // Get the groups(cookie categorization), user has created in one trust account.
      const oneTrustAllGroupsInfo: OneTrustGroup[] = (globalThis as any).OneTrust.GetDomainData()
        .Groups;

      oneTrustAllGroupsInfo.forEach((group: OneTrustGroup) => {
        const { CustomGroupId, GroupName } = group;
        if (allowedConsentIds.includes(CustomGroupId)) {
          allowedConsents[CustomGroupId] = GroupName;
        } else {
          deniedConsentIds.push(CustomGroupId);
        }
      });

      state.consents.data.value = { initialized: true, allowedConsents, deniedConsentIds };
    },

    isDestinationConsented(
      state: ApplicationState,
      destConfig: DestinationConfig,
      logger?: ILogger,
    ): boolean {
      const consentData = state.consents.data.value;
      if (!consentData.initialized) {
        return true;
      }
      const allowedConsents = consentData.allowedConsents as Record<string, string>;

      try {
        // mapping of the destination with the consent group name
        const { oneTrustCookieCategories } = destConfig;

        // If the destination do not have this mapping events will be sent.
        if (!oneTrustCookieCategories) {
          return true;
        }

        // Change the structure of oneTrustConsentGroup as an array and filter values if empty string
        // Eg:
        // ["Performance Cookies", "Functional Cookies"]
        const validOneTrustCookieCategories = oneTrustCookieCategories
          .map((c: OneTrustCookieCategory) => c.oneTrustCookieCategory)
          .filter((n: string | undefined) => n);

        let containsAllConsent = true;
        // Check if all the destination's mapped cookie categories are consented by the user in the browser.
        containsAllConsent = validOneTrustCookieCategories.every(
          (element: string) =>
            Object.keys(allowedConsents).includes(element.trim()) ||
            Object.values(allowedConsents).includes(element.trim()),
        );

        return containsAllConsent;
      } catch (err) {
        logger?.error(DESTINATION_CONSENT_STATUS_ERROR(ONETRUST_CONSENT_MANAGER_PLUGIN), err);
        return true;
      }
    },
  },
});

export { OneTrustConsentManager };

export default OneTrustConsentManager;
