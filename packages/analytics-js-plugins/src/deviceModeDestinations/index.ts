/* eslint-disable no-param-reassign */
import { clone } from 'ramda';
import { isHybridModeDestination } from '@rudderstack/analytics-js-common/index';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { destDisplayNamesToFileNamesMap } from '@rudderstack/analytics-js-common/constants/destDisplayNamesToFileNamesMap';
import {
  createDestinationInstance,
  isDestinationSDKEvaluated,
  isDestinationReady,
  normalizeIntegrationOptions,
  filterDestinations,
  getCumulativeIntegrationsConfig,
} from './utils';
import {
  DEVICE_MODE_DESTINATIONS_PLUGIN,
  INITIALIZED_CHECK_POLL_INTERVAL,
  LOAD_CHECK_TIMEOUT,
} from './constants';
import {
  DESTINATION_INIT_ERROR,
  DESTINATION_NOT_SUPPORTED_ERROR,
  DESTINATION_SDK_EVALUATION_TIMEOUT_ERROR,
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

        let timeoutId: number;
        let intervalId: number;
        if (!isDestinationSDKEvaluated(destSDKIdentifier, sdkName, logger)) {
          const destSdkURL = `${integrationsCDNPath}/${sdkName}.min.js`;
          externalSrcLoader.loadJSFile({
            url: destSdkURL,
            id: dest.userFriendlyId,
            callback:
              externalScriptOnLoad ??
              ((id?: string) => {
                if (!id) {
                  // Stop wasting time to check whether SDK is loaded
                  (globalThis as typeof window).clearInterval(intervalId);
                  (globalThis as typeof window).clearTimeout(timeoutId);

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
                }
              }),
          });
        }

        intervalId = (globalThis as typeof window).setInterval(() => {
          const sdkTypeName = sdkName;
          if (isDestinationSDKEvaluated(destSDKIdentifier, sdkTypeName, logger)) {
            (globalThis as typeof window).clearInterval(intervalId);
            (globalThis as typeof window).clearTimeout(timeoutId);

            try {
              const destInstance = createDestinationInstance(
                destSDKIdentifier,
                sdkTypeName,
                dest,
                state,
                logger,
              );
              destInstance.init();

              const initializedDestination = clone(dest);
              initializedDestination.instance = destInstance;

              isDestinationReady(initializedDestination, logger)
                .then(() => {
                  // Collect the integrations data for the hybrid mode destinations
                  if (isHybridModeDestination(initializedDestination)) {
                    state.nativeDestinations.integrationsConfig.value =
                      getCumulativeIntegrationsConfig(
                        initializedDestination,
                        state.nativeDestinations.integrationsConfig.value,
                        logger,
                      );
                  }

                  state.nativeDestinations.initializedDestinations.value = [
                    ...state.nativeDestinations.initializedDestinations.value,
                    initializedDestination,
                  ];
                })
                .catch(err => {
                  throw err;
                });
            } catch (err) {
              logger?.error(
                DESTINATION_INIT_ERROR(DEVICE_MODE_DESTINATIONS_PLUGIN, dest.userFriendlyId),
                err,
              );

              state.nativeDestinations.failedDestinations.value = [
                ...state.nativeDestinations.failedDestinations.value,
                dest,
              ];
            }
          }
        }, INITIALIZED_CHECK_POLL_INTERVAL);

        timeoutId = (globalThis as typeof window).setTimeout(() => {
          clearInterval(intervalId);

          logger?.error(
            DESTINATION_SDK_EVALUATION_TIMEOUT_ERROR(
              DEVICE_MODE_DESTINATIONS_PLUGIN,
              dest.userFriendlyId,
            ),
          );
          state.nativeDestinations.failedDestinations.value = [
            ...state.nativeDestinations.failedDestinations.value,
            dest,
          ];
        }, LOAD_CHECK_TIMEOUT);
      });
    },
  },
});

export { DeviceModeDestinations };

export default DeviceModeDestinations;
