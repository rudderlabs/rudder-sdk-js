/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type {
  ApplicationState,
  BreadcrumbMetaData,
} from '@rudderstack/analytics-js-common/types/ApplicationState';
import type {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { ErrorState, SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import {
  createNewBreadcrumb,
  getConfigForPayloadCreation,
  isRudderSDKError,
  getBugsnagErrorEvent,
  getErrorDeliveryPayload,
  isAllowedToBeNotified,
} from './utils';
import { REQUEST_TIMEOUT_MS } from './constants';
import { ErrorFormat } from './event/event';
import { INVALID_SOURCE_CONFIG_ERROR } from './logMessages';

const pluginName: PluginName = 'ErrorReporting';

const ErrorReporting = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
    state.reporting.isErrorReportingPluginLoaded.value = true;
    if (state.reporting.breadcrumbs?.value) {
      state.reporting.breadcrumbs.value = [createNewBreadcrumb('Error Reporting Plugin Loaded')];
    }
  },
  errorReporting: {
    // This extension point is deprecated
    // TODO: Remove this in the next major release
    init: (
      state: ApplicationState,
      pluginEngine: IPluginEngine,
      externalSrcLoader: IExternalSrcLoader,
      logger?: ILogger,
      isInvokedFromLatestCore?: boolean,
    ) => {
      if (isInvokedFromLatestCore) {
        return undefined;
      }
      if (!state.source.value?.config || !state.source.value?.id) {
        return Promise.reject(new Error(INVALID_SOURCE_CONFIG_ERROR));
      }

      return pluginEngine.invokeSingle(
        'errorReportingProvider.init',
        state,
        externalSrcLoader,
        logger,
      );
    },
    notify: (
      pluginEngine: IPluginEngine, // Only kept for backward compatibility
      client: any, // Only kept for backward compatibility
      error: SDKError,
      state: ApplicationState,
      logger?: ILogger,
      httpClient?: IHttpClient,
      errorState?: ErrorState,
    ): void => {
      if (httpClient) {
        const { component, normalizedError } = getConfigForPayloadCreation(
          error,
          errorState?.severityReason.type as string,
        );

        // Generate the error payload
        const errorPayload = ErrorFormat.create(normalizedError, component, logger);

        if (!errorPayload || !isAllowedToBeNotified(errorPayload.errors[0])) {
          return;
        }

        // filter errors
        if (!isRudderSDKError(errorPayload.errors[0])) {
          return;
        }

        // enrich error payload
        const bugsnagPayload = getBugsnagErrorEvent(errorPayload, errorState as ErrorState, state);

        // send it to metrics service
        httpClient?.request({
          url: state.metrics.metricsServiceUrl.value as string,
          options: {
            method: 'POST',
            body: getErrorDeliveryPayload(bugsnagPayload, state),
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
            },
          },
          timeout: REQUEST_TIMEOUT_MS,
        });
      } else {
        pluginEngine.invokeSingle('errorReportingProvider.notify', client, error, state, logger);
      }
    },
    breadcrumb: (
      pluginEngine: IPluginEngine, // Only kept for backward compatibility
      client: any, // Only kept for backward compatibility
      message: string,
      logger?: ILogger, // Only kept for backward compatibility
      state?: ApplicationState,
      metaData?: BreadcrumbMetaData,
    ): void => {
      if (state) {
        state.reporting.breadcrumbs.value = [
          ...state.reporting.breadcrumbs.value,
          createNewBreadcrumb(message, metaData),
        ];
      } else {
        pluginEngine.invokeSingle('errorReportingProvider.breadcrumb', client, message, logger);
      }
    },
  },
});

export { ErrorReporting };

export default ErrorReporting;
