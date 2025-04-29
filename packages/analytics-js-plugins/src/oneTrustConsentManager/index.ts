/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { ONETRUST_ACCESS_ERROR } from './logMessages';
import { ONETRUST_CONSENT_MANAGER_PLUGIN } from './constants';
import type { OneTrustGroup } from './types';
import { isDestinationConsented } from '../utilities/consentManagement';

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
      return isDestinationConsented(
        state,
        destConfig,
        ONETRUST_CONSENT_MANAGER_PLUGIN,
        errorHandler,
        logger,
      );
    },
  },
});

export { OneTrustConsentManager };

export default OneTrustConsentManager;
