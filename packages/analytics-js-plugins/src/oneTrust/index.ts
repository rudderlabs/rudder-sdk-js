/* eslint-disable no-param-reassign */
import { ApplicationState, ILogger, DestinationConfig } from '../types/common';
import { ExtensionPlugin, ConsentInfo } from '../types/plugins';
import { OneTrustCookieCategory, OneTrustGroup } from './types';

const pluginName = 'OneTrust';

const OneTrust = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentProvider: {
    getConsentInfo(logger?: ILogger): ConsentInfo {
      // In case OneTrust SDK is not loaded before RudderStack's JS SDK
      // it will be treated as Consent manager is not initialized
      if (!(globalThis as any).OneTrust || !(globalThis as any).OnetrustActiveGroups) {
        logger?.error(
          "OneTrustPlugin:: Failed to access OneTrust SDK resources. Please ensure that the OneTrust SDK is loaded successfully before RudderStack's JS SDK.",
        );
        return { consentProviderInitialized: false };
      }

      // OneTrust SDK populates a data layer object OnetrustActiveGroups with
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
          deniedConsentIds.push(CustomGroupId); // Populate denied consent Ids
        }
      });

      return { consentProviderInitialized: true, allowedConsents, deniedConsentIds };
    },

    isDestinationConsented(
      state: ApplicationState,
      destConfig: DestinationConfig,
      logger?: ILogger,
    ): boolean {
      const { consentProviderInitialized, allowedConsents } = state.consents;
      if (!consentProviderInitialized.value) {
        return true;
      }
      try {
        /**
     * Structure of OneTrust consent group destination config.
     *
     * "oneTrustCookieCategories":
     * [
        {
            "oneTrustCookieCategory": "Performance Cookies"
        },
        {
            "oneTrustCookieCategory": "Functional Cookies"
        },
        {
            "oneTrustCookieCategory": ""
        }
    ]
     *
     */

        const { oneTrustCookieCategories } = destConfig; // mapping of the destination with the consent group name

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
          `OneTrustPlugin:: Failed to determine the consent status for the destination. Please check the destination configuration and try again.`,
          err,
        );
        return true;
      }
    },
  },
});

export { OneTrust };

export default OneTrust;
