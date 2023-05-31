/* eslint-disable no-param-reassign */
import {
  INITIALIZED_CHECK_POLL_INTERVAL,
  LOAD_CHECK_TIMEOUT,
} from '@rudderstack/analytics-js-plugins/deviceModeDestinations/constants';
import { destDispNamesToFileNamesMap } from '@rudderstack/analytics-js-plugins/deviceModeDestinations/destDispNamesToFileNames';
import {
  createDestinationInstance,
  isDestinationSDKEvaluated,
  isDestinationReady,
  normalizeIntegrationOptions,
  filterDestinationsToLoad,
} from './utils';
import {
  ExtensionPlugin,
  IExternalSrcLoader,
  PluginName,
  ApplicationState,
  ILogger,
  DeviceModeDestination,
} from '../types/common';

// TODO: if this is not an enum but a hardcoded string we save one request for the rudder-analytics-plugins-common.min.js file
const pluginName = PluginName.DeviceModeDestinations;

// TODO: dummy implementation for testing until we implement device mode
//  create proper implementation once relevant task is picked up
const DeviceModeDestinations = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  nativeDestinations: {
    setActiveIntegrations(state: ApplicationState, logger?: ILogger): number {
      // Normalize the integration options from the load API call
      state.nativeDestinations.loadOnlyIntegrations.value = normalizeIntegrationOptions(
        state.loadOptions.value.integrations,
      );

      // Filter destination that doesn't have mapping config-->Integration names
      const configSupportedDestinations =
        state.nativeDestinations.configuredDestinations.value.filter(configDest => {
          if (destDispNamesToFileNamesMap[configDest.displayName]) {
            return true;
          }

          logger?.error(`"${configDest.displayName}" destination is not supported`);
          return false;
        });

      // Filter destinations that are disabled through load options
      const destinationsToLoad = filterDestinationsToLoad(
        state.nativeDestinations.loadOnlyIntegrations.value,
        configSupportedDestinations,
      );

      // TODO: check consent for each destination and filter out the ones that are not allowed

      state.nativeDestinations.activeDestinations.value = destinationsToLoad;

      return state.nativeDestinations.activeDestinations.value.length;
    },

    loadIntegrations(
      state: ApplicationState,
      externalSrcLoader: IExternalSrcLoader,
      logger?: ILogger,
      externalScriptOnLoad?: (id?: string) => unknown,
    ) {
      const { destSDKBaseURL } = state.loadOptions.value;
      const activeDestinations = state.nativeDestinations.activeDestinations.value;
      const onLoadCallback =
        externalScriptOnLoad ??
        ((id?: string) => {
          if (!id) {
            return;
          }

          // Format of id: <sdkName>___<destId>
          const splitParts = id.split('___');
          const destId = splitParts[1];

          state.nativeDestinations.loadedDestinationScripts.value = [
            ...state.nativeDestinations.loadedDestinationScripts.value,
            destId,
          ];

          logger?.debug(`Destination script loaded for id: ${id}`);
        });

      activeDestinations.forEach(dest => {
        logger?.debug(dest);
        const sdkName = destDispNamesToFileNamesMap[dest.displayName];
        const destSDKIdentifier = `${sdkName}_RS`; // this is the name of the object loaded on the window

        if (!isDestinationSDKEvaluated(destSDKIdentifier, sdkName, logger)) {
          const destSdkURL = `${destSDKBaseURL}/${sdkName}.min.js`;
          externalSrcLoader
            .loadJSFile({
              url: destSdkURL,
              id: `${sdkName}___${dest.id}`,
              callback: onLoadCallback,
            })
            .catch(e => {
              logger?.error(
                `Destination script load failed for "${dest.displayName}". ID (${dest.id}). Error message: ${e.message}`,
              );
              state.nativeDestinations.failedDestinationScripts.value = [
                ...state.nativeDestinations.failedDestinationScripts.value,
                dest.id,
              ];
            });
        }

        const interval = setInterval(() => {
          const sdkTypeName = sdkName;
          if (isDestinationSDKEvaluated(destSDKIdentifier, sdkTypeName, logger)) {
            clearInterval(interval);

            try {
              const destInstance = createDestinationInstance(
                destSDKIdentifier,
                sdkTypeName,
                dest,
                state,
                logger,
              );
              logger?.debug(`Attempting to initialize destination: ${destSDKIdentifier}`);
              destInstance.init();

              isDestinationReady(destInstance)
                .then(() => {
                  const initializedDestination: Record<string, DeviceModeDestination> = {};
                  initializedDestination[dest.id] = destInstance;

                  logger?.debug(`Initialized destination: ${destSDKIdentifier}`);
                  state.nativeDestinations.initializedDestinations.value = {
                    ...state.nativeDestinations.initializedDestinations.value,
                    ...initializedDestination,
                  };
                })
                .catch(e => {
                  throw e;
                });
            } catch (e: any) {
              const message = `Unable to initialize destination "${dest.displayName}". ID (${dest.id}). Error message: ${e.message}`;
              logger?.error(e, message);

              state.nativeDestinations.failedDestinationScripts.value = [
                ...state.nativeDestinations.failedDestinationScripts.value,
                dest.id,
              ];
            }
          }
        }, INITIALIZED_CHECK_POLL_INTERVAL);

        window.setTimeout(() => {
          clearInterval(interval);

          state.nativeDestinations.failedDestinationScripts.value = [
            ...state.nativeDestinations.failedDestinationScripts.value,
            dest.id,
          ];
        }, LOAD_CHECK_TIMEOUT);
      });
    },
  },
});

export { DeviceModeDestinations };

export default DeviceModeDestinations;
