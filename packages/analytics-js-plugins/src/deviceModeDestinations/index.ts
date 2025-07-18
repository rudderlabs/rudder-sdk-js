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
import type { RSACustomIntegration } from '@rudderstack/analytics-js-common/types/IRudderAnalytics';
import {
  isDestinationSDKMounted,
  initializeDestination,
  applySourceConfigurationOverrides,
  filterDisabledDestinations,
  addIntegrationToDestination,
  validateCustomIntegration,
} from './utils';
import { DEVICE_MODE_DESTINATIONS_PLUGIN, SCRIPT_LOAD_TIMEOUT_MS } from './constants';
import {
  INTEGRATION_NOT_ADDED_TO_CUSTOM_DESTINATION_WARNING,
  INTEGRATION_NOT_SUPPORTED_ERROR,
  INTEGRATION_SDK_LOAD_ERROR,
} from './logMessages';
import {
  destDisplayNamesToFileNamesMap,
  filterDestinations,
} from '../shared-chunks/deviceModeDestinations';
import { INTEGRATIONS_ERROR_CATEGORY } from '../utilities/constants';
import { isUndefined } from '../shared-chunks/common';

const pluginName: PluginName = 'DeviceModeDestinations';

const DeviceModeDestinations = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  nativeDestinations: {
    addCustomIntegration(
      destinationId: string,
      integration: RSACustomIntegration,
      state: ApplicationState,
      logger: ILogger,
    ): void {
      const destination = validateCustomIntegration(destinationId, integration, state, logger);
      if (!destination) {
        return;
      }

      addIntegrationToDestination(destination, integration, state, logger);

      // Refresh the state value to trigger any effects that depend on it
      state.nativeDestinations.configuredDestinations.value = [
        ...state.nativeDestinations.configuredDestinations.value,
      ];
    },

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
          // Filter enabled custom destinations that don't have an integration added to them
          if (
            configDest.enabled &&
            configDest.isCustomIntegration &&
            isUndefined(configDest.integration)
          ) {
            logger?.warn(
              INTEGRATION_NOT_ADDED_TO_CUSTOM_DESTINATION_WARNING(
                DEVICE_MODE_DESTINATIONS_PLUGIN,
                configDest.id,
              ),
            );
            return false;
          }

          // Ensure the destination is supported by the SDK
          // or it is a custom integration
          if (
            configDest.isCustomIntegration ||
            destDisplayNamesToFileNamesMap[configDest.displayName]
          ) {
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
      const configuredDestinations = state.loadOptions.value.sourceConfigurationOverride
        ? applySourceConfigurationOverrides(
            configSupportedDestinations,
            state.loadOptions.value.sourceConfigurationOverride,
            logger,
          )
        : filterDisabledDestinations(configSupportedDestinations);

      // Filter destinations that are disabled through load or consent API options
      const destinationsToLoad = filterDestinations(
        state.consents.postConsent.value?.integrations ??
          state.nativeDestinations.loadOnlyIntegrations.value,
        configuredDestinations,
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

      // Add the distilled destinations to the active destinations list
      state.nativeDestinations.activeDestinations.value = [
        ...state.nativeDestinations.activeDestinations.value,
        ...consentedDestinations,
      ];
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
