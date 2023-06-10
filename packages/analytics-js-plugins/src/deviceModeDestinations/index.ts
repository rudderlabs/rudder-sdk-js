/* eslint-disable no-param-reassign */
import {
  INITIALIZED_CHECK_POLL_INTERVAL,
  LOAD_CHECK_TIMEOUT,
} from '@rudderstack/analytics-js-plugins/deviceModeDestinations/constants';
import { destDispNamesToFileNamesMap } from '@rudderstack/analytics-js-plugins/deviceModeDestinations/destDispNamesToFileNames';
import { clone } from 'ramda';
import {
  createDestinationInstance,
  isDestinationSDKEvaluated,
  isDestinationReady,
  normalizeIntegrationOptions,
  filterDestinations,
  getCumulativeIntegrationsConfig,
} from './utils';
import {
  ExtensionPlugin,
  IExternalSrcLoader,
  ApplicationState,
  ILogger,
  IPluginsManager,
} from '../types/common';

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
          if (destDispNamesToFileNamesMap[configDest.displayName]) {
            return true;
          }

          logger?.error(`"${configDest.displayName}" destination is not supported`);
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
      const { destSDKBaseURL } = state.loadOptions.value;
      const activeDestinations = state.nativeDestinations.activeDestinations.value;
      const onLoadCallback =
        externalScriptOnLoad ??
        ((id?: string) => {
          if (!id) {
            return;
          }

          logger?.debug(`Destination script with id: ${id} loaded successfully`);
        });

      activeDestinations.forEach(dest => {
        const sdkName = destDispNamesToFileNamesMap[dest.displayName];
        const destSDKIdentifier = `${sdkName}_RS`; // this is the name of the object loaded on the window
        logger?.debug(`Loading destination: ${dest.userFriendlyId}`);

        if (!isDestinationSDKEvaluated(destSDKIdentifier, sdkName, logger)) {
          const destSdkURL = `${destSDKBaseURL}/${sdkName}.min.js`;
          externalSrcLoader
            .loadJSFile({
              url: destSdkURL,
              id: dest.userFriendlyId,
              callback: onLoadCallback,
            })
            .catch(e => {
              logger?.error(
                `Script load failed for destination: ${dest.userFriendlyId}. Error message: ${e.message}`,
              );
              state.nativeDestinations.failedDestinations.value = [
                ...state.nativeDestinations.failedDestinations.value,
                dest,
              ];
            });
        }

        let timeoutId: number;
        const intervalId = (globalThis as typeof window).setInterval(() => {
          const sdkTypeName = sdkName;
          if (isDestinationSDKEvaluated(destSDKIdentifier, sdkTypeName, logger)) {
            (globalThis as typeof window).clearInterval(intervalId);
            (globalThis as typeof window).clearTimeout(timeoutId);

            logger?.debug(
              `SDK script evaluation successful for destination: ${dest.userFriendlyId}`,
            );

            try {
              const destInstance = createDestinationInstance(
                destSDKIdentifier,
                sdkTypeName,
                dest,
                state,
                logger,
              );
              logger?.debug(`Initializing destination: ${dest.userFriendlyId}`);
              destInstance.init();

              const initializedDestination = clone(dest);
              initializedDestination.instance = destInstance;

              isDestinationReady(initializedDestination, logger)
                .then(() => {
                  logger?.debug(`Destination ${dest.userFriendlyId} is loaded and ready`);

                  // Collect the integrations data for the destination
                  state.nativeDestinations.integrationsConfig.value =
                    getCumulativeIntegrationsConfig(
                      initializedDestination,
                      state.nativeDestinations.integrationsConfig.value,
                      logger,
                    );

                  state.nativeDestinations.initializedDestinations.value = [
                    ...state.nativeDestinations.initializedDestinations.value,
                    initializedDestination,
                  ];
                })
                .catch(e => {
                  throw e;
                });
            } catch (e: any) {
              const message = `Unable to initialize destination: ${dest.userFriendlyId}. Error message: ${e.message}`;
              logger?.error(e, message);

              state.nativeDestinations.failedDestinations.value = [
                ...state.nativeDestinations.failedDestinations.value,
                dest,
              ];
            }
          }
        }, INITIALIZED_CHECK_POLL_INTERVAL);

        timeoutId = (globalThis as typeof window).setTimeout(() => {
          clearInterval(intervalId);

          logger?.debug(`SDK script evaluation timed out for destination: ${dest.userFriendlyId}`);
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
