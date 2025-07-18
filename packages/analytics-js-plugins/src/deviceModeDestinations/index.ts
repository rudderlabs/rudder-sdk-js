/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type {
  IPluginsManager,
  PluginName,
} from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IErrorHandler, SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import {
  isDestinationSDKMounted,
  initializeDestination,
  applySourceConfigurationOverrides,
  filterDisabledDestination,
} from './utils';
import { DEVICE_MODE_DESTINATIONS_PLUGIN, SCRIPT_LOAD_TIMEOUT_MS } from './constants';
import { INTEGRATION_NOT_SUPPORTED_ERROR, INTEGRATION_SDK_LOAD_ERROR } from './logMessages';
import {
  destDisplayNamesToFileNamesMap,
  filterDestinations,
} from '../shared-chunks/deviceModeDestinations';
import { INTEGRATIONS_ERROR_CATEGORY } from '../utilities/constants';

const pluginName: PluginName = 'DeviceModeDestinations';

const DeviceModeDestinations = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  nativeDestinations: {
    setActiveDestinations(
      state: ApplicationState,
      pluginsManager: IPluginsManager,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): void {
      state.nativeDestinations.loadIntegration.value = state.loadOptions.value
        .loadIntegration as boolean;

      // Filter destination that doesn't have mapping config-->Integration names
      const configSupportedDestinations =
        state.nativeDestinations.configuredDestinations.value.filter((configDest: Destination) => {
          if (destDisplayNamesToFileNamesMap[configDest.displayName]) {
            return true;
          }

          const errMessage = INTEGRATION_NOT_SUPPORTED_ERROR(configDest.displayName);
          errorHandler?.onError({
            error: new Error(errMessage),
            context: DEVICE_MODE_DESTINATIONS_PLUGIN,
            category: INTEGRATIONS_ERROR_CATEGORY,
          });
          return false;
        });

      // Apply source configuration overrides if provided
      const destinationsWithOverrides = state.loadOptions.value.sourceConfigurationOverride
        ? applySourceConfigurationOverrides(
            configSupportedDestinations,
            state.loadOptions.value.sourceConfigurationOverride,
            logger,
          )
        : filterDisabledDestination(configSupportedDestinations);

      // Filter destinations that are disabled through load or consent API options
      const destinationsToLoad = filterDestinations(
        state.consents.postConsent.value?.integrations ??
          state.nativeDestinations.loadOnlyIntegrations.value,
        destinationsWithOverrides,
      );

      const consentedDestinations = destinationsToLoad.filter(
        dest =>
          // if consent manager is not configured, then default to load the destination
          pluginsManager.invokeSingle(
            `consentManager.isDestinationConsented`,
            state,
            dest.config,
            errorHandler,
            logger,
          ) ?? true,
      );

      state.nativeDestinations.activeDestinations.value = consentedDestinations;
    },

    load(
      state: ApplicationState,
      externalSrcLoader: IExternalSrcLoader,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
      externalScriptOnLoad?: (id?: string) => unknown,
    ) {
      const integrationsCDNPath = state.lifecycle.integrationsCDNPath.value;
      const activeDestinations = state.nativeDestinations.activeDestinations.value;

      activeDestinations.forEach((dest: Destination) => {
        const sdkName = destDisplayNamesToFileNamesMap[dest.displayName] as string;
        const destSDKIdentifier = `${sdkName}_RS`; // this is the name of the object loaded on the window

        const sdkTypeName = sdkName;
        if (sdkTypeName && !isDestinationSDKMounted(destSDKIdentifier, sdkTypeName, logger)) {
          const destSdkURL = `${integrationsCDNPath}/${sdkName}.min.js`;
          externalSrcLoader.loadJSFile({
            url: destSdkURL,
            id: dest.userFriendlyId,
            callback:
              externalScriptOnLoad ??
              ((id: string, err?: SDKError) => {
                if (err) {
                  const customMessage = INTEGRATION_SDK_LOAD_ERROR(dest.displayName);
                  errorHandler?.onError({
                    error: err,
                    context: DEVICE_MODE_DESTINATIONS_PLUGIN,
                    customMessage,
                    groupingHash: customMessage,
                    category: INTEGRATIONS_ERROR_CATEGORY,
                  });

                  state.nativeDestinations.failedDestinations.value = [
                    ...state.nativeDestinations.failedDestinations.value,
                    dest,
                  ];
                } else {
                  initializeDestination(
                    dest,
                    state,
                    destSDKIdentifier,
                    sdkTypeName,
                    errorHandler,
                    logger,
                  );
                }
              }),
            timeout: SCRIPT_LOAD_TIMEOUT_MS,
          });
        } else {
          initializeDestination(dest, state, destSDKIdentifier, sdkTypeName, errorHandler, logger);
        }
      });
    },
  },
});

export { DeviceModeDestinations };

export default DeviceModeDestinations;
