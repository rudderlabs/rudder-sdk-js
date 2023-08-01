/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { destDisplayNamesToFileNamesMap } from '@rudderstack/analytics-js-common/constants/destDisplayNamesToFileNamesMap';
import {
  isDestinationSDKMounted,
  normalizeIntegrationOptions,
  filterDestinations,
  initializeDestination,
} from './utils';
import { DEVICE_MODE_DESTINATIONS_PLUGIN, SCRIPT_LOAD_TIMEOUT_MS } from './constants';
import {
  DESTINATION_NOT_SUPPORTED_ERROR,
  DESTINATION_SDK_LOAD_ERROR,
} from '../utilities/logMessages';

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
      logger?: ILogger,
    ): void {
      // Normalize the integration options from the load API call
      state.nativeDestinations.loadOnlyIntegrations.value = normalizeIntegrationOptions(
        state.loadOptions.value.integrations,
      );

      // Filter destination that doesn't have mapping config-->Integration names
      const configSupportedDestinations =
        state.nativeDestinations.configuredDestinations.value.filter(configDest => {
          if (destDisplayNamesToFileNamesMap[configDest.displayName]) {
            return true;
          }

          logger?.error(
            DESTINATION_NOT_SUPPORTED_ERROR(
              DEVICE_MODE_DESTINATIONS_PLUGIN,
              configDest.userFriendlyId,
            ),
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
            logger,
          ) ?? true,
      );

      state.nativeDestinations.activeDestinations.value = consentedDestinations;
    },

    load(
      state: ApplicationState,
      externalSrcLoader: IExternalSrcLoader,
      logger?: ILogger,
      externalScriptOnLoad?: (id?: string) => unknown,
    ) {
      const integrationsCDNPath = state.lifecycle.integrationsCDNPath.value;
      const activeDestinations = state.nativeDestinations.activeDestinations.value;

      activeDestinations.forEach(dest => {
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
                  initializeDestination(dest, state, destSDKIdentifier, sdkTypeName, logger);
                }
              }),
            timeout: SCRIPT_LOAD_TIMEOUT_MS,
          });
        } else {
          initializeDestination(dest, state, destSDKIdentifier, sdkTypeName, logger);
        }
      });
    },
  },
});

export { DeviceModeDestinations };

export default DeviceModeDestinations;
