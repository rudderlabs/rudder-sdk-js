/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { KETCH_CONSENT_MANAGER_PLUGIN } from './constants';
import type { KetchConsentData } from './types';
import { getKetchConsentData, updateConsentStateFromData } from './utils';
import { isUndefined } from '../shared-chunks/common';
import { isDestinationConsented } from '../utilities/consentManagement';

const pluginName: PluginName = 'KetchConsentManager';

const KetchConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(state: ApplicationState, logger?: ILogger): void {
      // getKetchUserConsentedPurposes returns current ketch opted-in purposes
      // This will be helpful for debugging
      (globalThis as any).getKetchUserConsentedPurposes = () =>
        (state.consents.data.value.allowedConsentIds as string[])?.slice();

      // getKetchUserDeniedPurposes returns current ketch opted-out purposes
      // This will be helpful for debugging
      (globalThis as any).getKetchUserDeniedPurposes = () =>
        (state.consents.data.value.deniedConsentIds as string[])?.slice();

      // updateKetchConsent callback function to update current consent purpose state
      // this will be called from ketch rudderstack plugin
      (globalThis as any).updateKetchConsent = (ketchConsentData: KetchConsentData) => {
        updateConsentStateFromData(state, ketchConsentData);
      };
    },

    updateConsentsInfo(
      state: ApplicationState,
      storeManager?: IStoreManager,
      logger?: ILogger,
    ): void {
      // retrieve consent data and update the state
      let ketchConsentData;
      if (!isUndefined((globalThis as any).ketchConsent)) {
        ketchConsentData = (globalThis as any).ketchConsent;
      } else {
        ketchConsentData = getKetchConsentData(storeManager, logger);
      }

      updateConsentStateFromData(state, ketchConsentData);
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
        KETCH_CONSENT_MANAGER_PLUGIN,
        errorHandler,
        logger,
      );
    },
  },
});

export { KetchConsentManager };

export default KetchConsentManager;
