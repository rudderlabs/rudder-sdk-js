/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type {
  ApplicationState,
  BreadCrumbMetaData,
} from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { ErrorState, SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { Event } from '@bugsnag/core';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import {
  createNewBreadCrumb,
  getConfigForPayloadCreation,
  isRudderSDKError,
  enhanceErrorEvent,
  getErrorDeliveryPayload,
} from './utils';
import { REQUEST_TIMEOUT_MS } from './constants';

const pluginName: PluginName = 'ErrorReporting';

const ErrorReporting = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
    state.reporting.isErrorReportingPluginLoaded.value = true;
    state.reporting.breadCrumbs.value = [createNewBreadCrumb('Error Reporting Plugin Loaded')];
  },
  errorReporting: {
    notify: (
      error: SDKError,
      errorState: ErrorState,
      state: ApplicationState,
      httpClient: IHttpClient,
      logger?: ILogger,
    ): void => {
      const { component, tolerateNonErrors, errorFramesToSkip, normalizedError } =
        getConfigForPayloadCreation(error, errorState.severityReason.type);

      // Generate the error payload
      const errorPayload = Event.create(
        normalizedError,
        tolerateNonErrors,
        errorState,
        component,
        errorFramesToSkip,
      );

      // filter errors
      if (!isRudderSDKError(errorPayload.errors[0])) {
        return;
      }

      // attach breadcrumbs
      if (state.reporting.breadCrumbs.value.length > 0) {
        errorPayload.breadcrumbs = state.reporting.breadCrumbs.value;
      }

      // enrich error payload
      const enhancedError = enhanceErrorEvent(errorPayload, errorState, state);

      // send it to metrics service
      httpClient.getAsyncData({
        url: `https://sdk-metrics.dev-rudder.rudderlabs.com/sdkmetrics`, // metrics endpoint: dev
        // url: `${state.lifecycle.dataPlaneUrl.value}/sdk-metrics`,
        options: {
          method: 'POST',
          data: getErrorDeliveryPayload(enhancedError, state),
          sendRawData: true,
        },
        isRawResponse: true,
        timeout: REQUEST_TIMEOUT_MS,
        callback: (result: any, details: any) => {
          // do nothing
        },
      });
    },
    breadcrumb: (message: string, state: ApplicationState, metaData?: BreadCrumbMetaData): void => {
      if (!message) {
        return;
      }
      state.reporting.breadCrumbs.value = [
        ...state.reporting.breadCrumbs.value,
        createNewBreadCrumb(message, metaData),
      ];
    },
  },
});

export { ErrorReporting };

export default ErrorReporting;
