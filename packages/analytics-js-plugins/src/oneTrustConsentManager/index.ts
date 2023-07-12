/* eslint-disable no-param-reassign */
import { ApplicationState, ILogger, DestinationConfig, IStoreManager } from '../types/common';
import { ExtensionPlugin } from '../types/plugins';
import { ONETRUST_CONSENT_MANAGER_PLUGIN } from './constants';
import { OneTrustCookieCategory, OneTrustGroup } from './types';
import { updateConsentState } from './utils';

const pluginName = 'OneTrustConsentManager';

const OneTrustConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(state: ApplicationState, storeManager?: IStoreManager, logger?: ILogger): void {
      // In case OneTrustConsentManager SDK is not loaded before RudderStack's JS SDK
      // it will be treated as Consent manager is not initialized
      if (
        !(globalThis as any).OneTrustConsentManager ||
        !(globalThis as any).OnetrustActiveGroups
      ) {
        logger?.error(
          `${ONETRUST_CONSENT_MANAGER_PLUGIN}:: Failed to access OneTrustConsentManager SDK resources. Please ensure that the OneTrustConsentManager SDK is loaded successfully before RudderStack's JS SDK.`,
        );
        updateConsentState(state, { initialized: false });
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
      const oneTrustAllGroupsInfo: OneTrustGroup[] = (
        globalThis as any
      ).OneTrustConsentManager.GetDomainData().Groups;

      oneTrustAllGroupsInfo.forEach((group: OneTrustGroup) => {
        const { CustomGroupId, GroupName } = group;
        if (allowedConsentIds.includes(CustomGroupId)) {
          allowedConsents[CustomGroupId] = GroupName;
        } else {
          deniedConsentIds.push(CustomGroupId); // Populate denied consent Ids
        }
      });

      updateConsentState(state, { initialized: true, allowedConsents, deniedConsentIds });
    },

    isDestinationConsented(
      state: ApplicationState,
      destConfig: DestinationConfig,
      logger?: ILogger,
    ): boolean {
      const { consentManagerInitialized, allowedConsents } = state.consents;
      if (!consentManagerInitialized.value) {
        return true;
      }

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
            Object.keys(allowedConsents.value).includes(element.trim()) ||
            Object.values(allowedConsents.value).includes(element.trim()),
        );

        return containsAllConsent;
      } catch (err) {
        logger?.error(
          `${ONETRUST_CONSENT_MANAGER_PLUGIN}:: Failed to determine the consent status for the destination. Please check the destination configuration and try again.`,
          err,
        );
        return true;
      }
    },
  },
});

export { OneTrustConsentManager };

export default OneTrustConsentManager;
