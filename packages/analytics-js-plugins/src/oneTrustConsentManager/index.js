import { DESTINATION_CONSENT_STATUS_ERROR, ONETRUST_ACCESS_ERROR } from './logMessages';
import { ONETRUST_CONSENT_MANAGER_PLUGIN } from './constants';
const pluginName = 'OneTrustConsentManager';
const OneTrustConsentManager = () => ({
  name: pluginName,
  deps: [],
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(state, storeManager, logger) {
      if (!globalThis.OneTrust || !globalThis.OnetrustActiveGroups) {
        logger === null || logger === void 0
          ? void 0
          : logger.error(ONETRUST_ACCESS_ERROR(ONETRUST_CONSENT_MANAGER_PLUGIN));
        state.consents.data.value = { initialized: false };
        return;
      }
      // OneTrustConsentManager SDK populates a data layer object OnetrustActiveGroups with
      // the cookie categories Ids that the user has consented to.
      // Eg: ',C0001,C0003,'
      // We split it and save it as an array.
      const allowedConsentIds = globalThis.OnetrustActiveGroups.split(',').filter(n => n);
      const allowedConsents = {};
      const deniedConsentIds = [];
      // Get the groups(cookie categorization), user has created in one trust account.
      const oneTrustAllGroupsInfo = globalThis.OneTrust.GetDomainData().Groups;
      oneTrustAllGroupsInfo.forEach(group => {
        const { CustomGroupId, GroupName } = group;
        if (allowedConsentIds.includes(CustomGroupId)) {
          allowedConsents[CustomGroupId] = GroupName;
        } else {
          deniedConsentIds.push(CustomGroupId);
        }
      });
      state.consents.data.value = { initialized: true, allowedConsents, deniedConsentIds };
    },
    isDestinationConsented(state, destConfig, errorHandler, logger) {
      const consentData = state.consents.data.value;
      if (!consentData.initialized) {
        return true;
      }
      const allowedConsents = consentData.allowedConsents;
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
          .map(c => c.oneTrustCookieCategory)
          .filter(n => n);
        let containsAllConsent = true;
        // Check if all the destination's mapped cookie categories are consented by the user in the browser.
        containsAllConsent = validOneTrustCookieCategories.every(
          element =>
            Object.keys(allowedConsents).includes(element.trim()) ||
            Object.values(allowedConsents).includes(element.trim()),
        );
        return containsAllConsent;
      } catch (err) {
        errorHandler === null || errorHandler === void 0
          ? void 0
          : errorHandler.onError(
              err,
              ONETRUST_CONSENT_MANAGER_PLUGIN,
              DESTINATION_CONSENT_STATUS_ERROR,
            );
        return true;
      }
    },
  },
});
export { OneTrustConsentManager };
export default OneTrustConsentManager;
