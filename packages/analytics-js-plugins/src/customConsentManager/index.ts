/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { CUSTOM_CONSENT_MANAGER_PLUGIN } from './constants';
import { isDestinationConsented } from '../utilities/consentManagement';

const pluginName: PluginName = 'CustomConsentManager';

const CustomConsentManager = (): ExtensionPlugin => ({
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
      // Nothing to update. Already provided by the user
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
        CUSTOM_CONSENT_MANAGER_PLUGIN,
        errorHandler,
        logger,
      );
    },
  },
});

export { CustomConsentManager };

export default CustomConsentManager;
