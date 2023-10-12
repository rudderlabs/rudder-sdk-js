import { destDisplayNamesToFileNamesMap } from '@rudderstack/analytics-js-common/constants/destDisplayNamesToFileNamesMap';
import { clone } from 'ramda';
import { DEFAULT_INTEGRATIONS_CONFIG } from '@rudderstack/analytics-js-common/constants/integrationsConfig';
import { isDestinationSDKMounted, initializeDestination } from './utils';
import { DEVICE_MODE_DESTINATIONS_PLUGIN, SCRIPT_LOAD_TIMEOUT_MS } from './constants';
import { DESTINATION_NOT_SUPPORTED_ERROR, DESTINATION_SDK_LOAD_ERROR } from './logMessages';
import { destinationUtils } from '../shared-chunks/deviceModeDestinations';
const pluginName = 'DeviceModeDestinations';
const DeviceModeDestinations = () => ({
  name: pluginName,
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  nativeDestinations: {
    setActiveDestinations(state, pluginsManager, errorHandler, logger) {
      var _a;
      // Normalize the integration options from the load API call
      state.nativeDestinations.loadOnlyIntegrations.value =
        (_a = clone(state.loadOptions.value.integrations)) !== null && _a !== void 0
          ? _a
          : DEFAULT_INTEGRATIONS_CONFIG;
      state.nativeDestinations.loadIntegration.value = state.loadOptions.value.loadIntegration;
      // Filter destination that doesn't have mapping config-->Integration names
      const configSupportedDestinations =
        state.nativeDestinations.configuredDestinations.value.filter(configDest => {
          if (destDisplayNamesToFileNamesMap[configDest.displayName]) {
            return true;
          }
          errorHandler === null || errorHandler === void 0
            ? void 0
            : errorHandler.onError(
                new Error(DESTINATION_NOT_SUPPORTED_ERROR(configDest.userFriendlyId)),
                DEVICE_MODE_DESTINATIONS_PLUGIN,
              );
          return false;
        });
      // Filter destinations that are disabled through load options
      const destinationsToLoad = destinationUtils.filterDestinations(
        state.nativeDestinations.loadOnlyIntegrations.value,
        configSupportedDestinations,
      );
      const consentedDestinations = destinationsToLoad.filter(dest => {
        var _a;
        // if consent manager is not configured, then default to load the destination
        return (_a = pluginsManager.invokeSingle(
          `consentManager.isDestinationConsented`,
          state,
          dest.config,
          errorHandler,
          logger,
        )) !== null && _a !== void 0
          ? _a
          : true;
      });
      state.nativeDestinations.activeDestinations.value = consentedDestinations;
    },
    load(state, externalSrcLoader, errorHandler, logger, externalScriptOnLoad) {
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
              externalScriptOnLoad !== null && externalScriptOnLoad !== void 0
                ? externalScriptOnLoad
                : id => {
                    if (!id) {
                      logger === null || logger === void 0
                        ? void 0
                        : logger.error(
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
                  },
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
