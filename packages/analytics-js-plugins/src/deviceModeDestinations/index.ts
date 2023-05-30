/* eslint-disable no-param-reassign */
import {
  createIntegrationInstance,
  isIntegrationSDKEvaluated,
  isInitialized,
} from '@rudderstack/analytics-js-plugins/deviceModeDestinations/utils';
import {
  INITIALIZED_CHECK_POLL_INTERVAL,
  LOAD_CHECK_TIMEOUT,
} from '@rudderstack/analytics-js-plugins/deviceModeDestinations/constants';
import { configToIntNames } from '@rudderstack/analytics-js-plugins/deviceModeDestinations/configToIntegrationsNames';
import {
  ExtensionPlugin,
  IExternalSrcLoader,
  PluginName,
  ApplicationState,
  ILogger,
  ClientIntegration,
  InitializedIntegration,
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
      let clientIntegrations = state.nativeDestinations.destinations.value.map(
        (destination): ClientIntegration => ({
          name: destination.definitionName,
          config: destination.config,
          destinationInfo: {
            areTransformationsConnected: destination.areTransformationsConnected || false,
            destinationId: destination.id,
          },
        }),
      );

      // Filter destination that doesn't have mapping config-->Integration names
      clientIntegrations = clientIntegrations.filter(clientIntegration => {
        if (configToIntNames[clientIntegration.name]) {
          return true;
        }

        logger?.error(`${clientIntegration.name} not available for initialization`);
        return false;
      });

      state.nativeDestinations.activeIntegrations.value = clientIntegrations;
      return clientIntegrations.length;
    },
    loadIntegrations(
      state: ApplicationState,
      externalSrcLoader: IExternalSrcLoader,
      logger?: ILogger,
      externalScriptOnLoad?: (id?: string) => unknown,
    ) {
      const { destSDKBaseURL } = state.loadOptions.value;
      const activeIntegrations = state.nativeDestinations.activeIntegrations.value;
      const onLoadCallback =
        externalScriptOnLoad ??
        ((id?: string) => {
          if (!id) {
            return;
          }

          state.nativeDestinations.loadedIntegrationScripts.value = [
            ...state.nativeDestinations.loadedIntegrationScripts.value,
            id,
          ];

          logger?.debug(`Integration script loaded for id: ${id}`);
        });

      activeIntegrations.forEach(intg => {
        console.log(intg);
        const pluginName = `${configToIntNames[intg.name]}_RS`; // this is the name of the object loaded on the window
        const modName = configToIntNames[intg.name];
        const modURL = `${destSDKBaseURL}/${modName}.min.js`;

        if (!(window as any)[pluginName]) {
          externalSrcLoader
            .loadJSFile({
              url: modURL,
              id: modName,
              callback: onLoadCallback,
            })
            .catch(e => {
              logger?.error(
                `Integration script load failed for ${intg.name} ${intg.destinationInfo.destinationId} ${e.message}`,
              );
              state.nativeDestinations.failedIntegrationScripts.value = [
                ...state.nativeDestinations.failedIntegrationScripts.value,
                intg.destinationInfo.destinationId,
              ];
            });
        }

        const interval = setInterval(() => {
          if (isIntegrationSDKEvaluated(pluginName, modName, logger)) {
            const intMod = (window as any)[pluginName];
            clearInterval(interval);

            try {
              const integrationInstance = createIntegrationInstance(
                modName,
                pluginName,
                intg,
                intMod,
              );
              logger?.debug(`Attempting to initialize integration name:: ${pluginName}`);
              integrationInstance.init();

              isInitialized(integrationInstance)
                .then(() => {
                  const initializedDestination: Record<string, InitializedIntegration> = {};
                  initializedDestination[pluginName] = intMod[modName];

                  logger?.debug(`Initialized integration name:: ${pluginName}`);
                  state.nativeDestinations.initializedIntegrations.value = {
                    ...state.nativeDestinations.initializedIntegrations.value,
                    ...initializedDestination,
                  };
                })
                .catch(e => {
                  throw e;
                });
            } catch (e: any) {
              const message = `[Analytics] 'integration.init()' failed :: ${pluginName} ${intg.destinationInfo.destinationId} :: ${e.message}`;
              logger?.error(e, message);
              state.nativeDestinations.failedIntegrationScripts.value = [
                ...state.nativeDestinations.failedIntegrationScripts.value,
                intg.destinationInfo.destinationId,
              ];
            }
          }
        }, INITIALIZED_CHECK_POLL_INTERVAL);

        window.setTimeout(() => {
          clearInterval(interval);
        }, LOAD_CHECK_TIMEOUT);
      });
    },
  },
});

export { DeviceModeDestinations };

export default DeviceModeDestinations;
