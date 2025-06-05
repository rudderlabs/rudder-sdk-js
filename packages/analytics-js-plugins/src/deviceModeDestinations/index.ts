/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type {
  IPluginsManager,
  PluginName,
} from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import {
  isDestinationSDKMounted,
  initializeDestination,
  applySourceConfigurationOverrides,
} from './utils';
import { DEVICE_MODE_DESTINATIONS_PLUGIN, SCRIPT_LOAD_TIMEOUT_MS } from './constants';
import { DESTINATION_NOT_SUPPORTED_ERROR, DESTINATION_SDK_LOAD_ERROR } from './logMessages';
import {
  destDisplayNamesToFileNamesMap,
  filterDestinations,
} from '../shared-chunks/deviceModeDestinations';

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

          errorHandler?.onError(
            new Error(DESTINATION_NOT_SUPPORTED_ERROR(configDest.userFriendlyId)),
            DEVICE_MODE_DESTINATIONS_PLUGIN,
          );
          return false;
        });

      // Apply source configuration overrides if provided
      const destinationsWithOverrides = state.loadOptions.value.sourceConfigurationOverride
        ? applySourceConfigurationOverrides(
            configSupportedDestinations,
            state.loadOptions.value.sourceConfigurationOverride,
            logger,
          )
        : configSupportedDestinations;

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
        const sdkName = destDisplayNamesToFileNamesMap[dest.displayName];
        const destSDKIdentifier = `${sdkName}_RS`; // this is the name of the object loaded on the window

        const sdkTypeName = sdkName;
        if (sdkTypeName && !isDestinationSDKMounted(destSDKIdentifier, sdkTypeName, logger)) {
          const destSdkURL = `${integrationsCDNPath}/${sdkName}.min.js`;
          externalSrcLoader.loadJSFile({
            url: destSdkURL,
            id: dest.userFriendlyId,
            callback:
              externalScriptOnLoad ??
              ((id?: string) => {
                if (!id) {
                  logger?.error(
                    DESTINATION_SDK_LOAD_ERROR(
                      DEVICE_MODE_DESTINATIONS_PLUGIN,
                      dest.userFriendlyId,
                    ),
                  );
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
        } else if (sdkTypeName) {
          initializeDestination(dest, state, destSDKIdentifier, sdkTypeName, errorHandler, logger);
        } else {
          logger?.error(
            DESTINATION_SDK_LOAD_ERROR(DEVICE_MODE_DESTINATIONS_PLUGIN, dest.displayName),
          );
        }
      });
    },
  },
});

export { DeviceModeDestinations };

export default DeviceModeDestinations;
