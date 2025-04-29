/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IUBENDA_CONSENT_MANAGER_PLUGIN } from './constants';
import type { IubendaConsentData } from './types';
import { updateConsentStateFromData, getIubendaConsentData } from './utils';
import { isUndefined } from '../shared-chunks/common';
import { isDestinationConsented } from '../utilities/consentManagement';

const pluginName: PluginName = 'IubendaConsentManager';

const IubendaConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(state: ApplicationState, logger?: ILogger): void {
      // getIubendaUserConsentedPurposes returns current iubenda opted-in purposes
      // This will be helpful for debugging
      (globalThis as any).getIubendaUserConsentedPurposes = () =>
        (state.consents.data.value.allowedConsentIds as string[])?.slice();

      // getIubendaUserDeniedPurposes returns current Iubenda opted-out purposes
      // This will be helpful for debugging
      (globalThis as any).getIubendaUserDeniedPurposes = () =>
        (state.consents.data.value.deniedConsentIds as string[])?.slice();

      // updateIubendaConsent callback function to update current consent purpose state
      (globalThis as any).updateIubendaConsent = (iubendaConsentData: IubendaConsentData) => {
        updateConsentStateFromData(state, iubendaConsentData);
      };
    },

    updateConsentsInfo(
      state: ApplicationState,
      storeManager?: IStoreManager,
      logger?: ILogger,
    ): void {
      // retrieve consent data and update the state
      let iubendaConsentData;
      // From window
      if (!isUndefined((globalThis as any)._iub.cs.consent.purposes)) {
        iubendaConsentData = (globalThis as any)._iub.cs.consent.purposes;
        // From cookie
      } else {
        iubendaConsentData = getIubendaConsentData(storeManager, logger);
      }
      updateConsentStateFromData(state, iubendaConsentData);
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
        IUBENDA_CONSENT_MANAGER_PLUGIN,
        errorHandler,
        logger,
      );
    },
  },
});

export { IubendaConsentManager };

export default IubendaConsentManager;
