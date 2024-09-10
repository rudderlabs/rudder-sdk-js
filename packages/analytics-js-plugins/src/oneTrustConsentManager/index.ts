/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { DESTINATION_CONSENT_STATUS_ERROR, ONETRUST_ACCESS_ERROR } from './logMessages';
import { ONETRUST_CONSENT_MANAGER_PLUGIN } from './constants';
import type { OneTrustGroup } from './types';

const pluginName: PluginName = 'OneTrustConsentManager';

const OneTrustConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(state: ApplicationState, logger?: ILogger): void {
      // Nothing to initialize
    },

    updateConsentsInfo(
      state: ApplicationState,
      storeManager?: IStoreManager,
      logger?: ILogger,
    ): void {
      if (!(globalThis as any).OneTrust || !(globalThis as any).OnetrustActiveGroups) {
        logger?.error(ONETRUST_ACCESS_ERROR(ONETRUST_CONSENT_MANAGER_PLUGIN));
        state.consents.initialized.value = false;
        return;
      }

      // Get the groups (cookie categorization), user has created in OneTrust account.
      const oneTrustAllGroupsInfo: OneTrustGroup[] = (globalThis as any).OneTrust.GetDomainData()
        .Groups;

      // OneTrustConsentManager SDK populates a data layer object OnetrustActiveGroups with
      // the cookie categories Ids that the user has consented to.
      // Eg: ',C0001,C0003,'
      // We split it and save it as an array.
      const allowedConsentIds = (globalThis as any).OnetrustActiveGroups.split(',').filter(
        (n: string) => n,
      );

      const deniedConsentIds: string[] = [];
      oneTrustAllGroupsInfo.forEach(({ CustomGroupId }: OneTrustGroup) => {
        if (!allowedConsentIds.includes(CustomGroupId)) {
          deniedConsentIds.push(CustomGroupId);
        }
      });

      state.consents.initialized.value = true;
      state.consents.data.value = { allowedConsentIds, deniedConsentIds };
    },

    isDestinationConsented(
      state: ApplicationState,
      destConfig: DestinationConfig,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): boolean {
      if (!state.consents.initialized.value) {
        return true;
      }
      const allowedConsentIds = state.consents.data.value.allowedConsentIds as string[];

      try {
        // mapping of the destination with the consent group name
        const { oneTrustCookieCategories, consentManagement } = destConfig;

        const matchPredicate = (consent: string) => allowedConsentIds.includes(consent);

        // Generic consent management
        if (consentManagement) {
          // Get the corresponding consents for the destination
          const cmpConsents = consentManagement.find(
            c => c.provider === state.consents.provider.value,
          )?.consents;

          // If there are no consents configured for the destination for the current provider, events should be sent.
          if (!cmpConsents) {
            return true;
          }

          const configuredConsents = cmpConsents.map(c => c.consent.trim()).filter(n => n);

          // match the configured consents with user provided consents as per
          // the configured resolution strategy
          switch (state.consents.resolutionStrategy.value) {
            case 'or':
              return configuredConsents.some(matchPredicate) || configuredConsents.length === 0;
            case 'and':
            default:
              return configuredConsents.every(matchPredicate);
          }
          // Legacy cookie consent management
          // TODO: To be removed once the source config API is updated to support generic consent management
        } else if (oneTrustCookieCategories) {
          // Change the structure of oneTrustConsentGroup as an array and filter values if empty string
          // Eg:
          // ["Performance Cookies", "Functional Cookies"]
          const configuredConsents = oneTrustCookieCategories
            .map(c => c.oneTrustCookieCategory.trim())
            .filter(n => n);

          // Check if all the destination's mapped cookie categories are consented by the user in the browser.
          return configuredConsents.every(matchPredicate);
        }

        // If there are no consents configured for the destination for the current provider, events should be sent.
        return true;
      } catch (err: any) {
        errorHandler?.onError(
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
