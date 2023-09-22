/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { destDisplayNamesToFileNamesMap } from '@rudderstack/analytics-js-common/constants/destDisplayNamesToFileNamesMap';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { clone } from 'ramda';
import { DEFAULT_INTEGRATIONS_CONFIG } from '@rudderstack/analytics-js-common/constants/integrationsConfig';
import { isDestinationSDKMounted, initializeDestination } from './utils';
import { DEVICE_MODE_DESTINATIONS_PLUGIN, SCRIPT_LOAD_TIMEOUT_MS } from './constants';
import { DESTINATION_NOT_SUPPORTED_ERROR, DESTINATION_SDK_LOAD_ERROR } from './logMessages';
import { filterDestinations } from '../utilities/destination';

const pluginName = 'DeviceModeDestinations';

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
      // Normalize the integration options from the load API call
      state.nativeDestinations.loadOnlyIntegrations.value =
        clone(state.loadOptions.value.integrations) ?? DEFAULT_INTEGRATIONS_CONFIG;

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

      // Filter destinations that are disabled through load options
      const destinationsToLoad = filterDestinations(
        state.nativeDestinations.loadOnlyIntegrations.value,
        configSupportedDestinations,
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
        if (!isDestinationSDKMounted(destSDKIdentifier, sdkTypeName, logger)) {
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
        } else {
          initializeDestination(dest, state, destSDKIdentifier, sdkTypeName, errorHandler, logger);
        }
      });
    },
  },
});

export { DeviceModeDestinations };

export default DeviceModeDestinations;
