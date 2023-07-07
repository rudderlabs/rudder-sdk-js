/* eslint-disable no-param-reassign */
import { clone } from 'ramda';
import {
  createDestinationInstance,
  isDestinationSDKEvaluated,
  isDestinationReady,
  normalizeIntegrationOptions,
  filterDestinations,
  getCumulativeIntegrationsConfig,
} from './utils';
import { IExternalSrcLoader, ApplicationState, ILogger, IPluginsManager } from '../types/common';
import { ExtensionPlugin } from '../types/plugins';
import { isHybridModeDestination } from '../utilities/common';
import { INITIALIZED_CHECK_POLL_INTERVAL, LOAD_CHECK_TIMEOUT } from './constants';
import { destDisplayNamesToFileNamesMap } from './destDisplayNamesToFileNames';

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
            `DeviceModeDestinationsPlugin:: Destination ${configDest.userFriendlyId} is not supported.`,
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
            pluginsManager,
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

        if (!isDestinationSDKEvaluated(destSDKIdentifier, sdkName, logger)) {
          const destSdkURL = `${integrationsCDNPath}/${sdkName}.min.js`;
          externalSrcLoader.loadJSFile({
            url: destSdkURL,
            id: dest.userFriendlyId,
            callback:
              externalScriptOnLoad ??
              ((id?: string) => {
                if (!id) {
                  logger?.error(
                    `DeviceModeDestinationsPlugin:: Failed to load script for destination "${dest.userFriendlyId}".`,
                  );
                  state.nativeDestinations.failedDestinations.value = [
                    ...state.nativeDestinations.failedDestinations.value,
                    dest,
                  ];
                }
              }),
          });
        }

        let timeoutId: number;
        const intervalId = (globalThis as typeof window).setInterval(() => {
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
                .catch(e => {
                  throw e;
                });
            } catch (err) {
              logger?.error(
                `DeviceModeDestinationsPlugin:: Failed to initialize destination "${dest.userFriendlyId}".`,
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
            `DeviceModeDestinationsPlugin:: SDK script evaluation timed out for destination ${dest.userFriendlyId}.`,
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
