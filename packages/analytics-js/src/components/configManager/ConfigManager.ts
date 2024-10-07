/* eslint-disable class-methods-use-this */
import type {
  IHttpClient,
  IResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import { batch, effect } from '@preact/signals-core';
import { isFunction } from '@rudderstack/analytics-js-common/utilities/checks';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import type { SourceConfigResponse } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { removeTrailingSlashes } from '@rudderstack/analytics-js-common/utilities/url';
import { isValidSourceConfig, validateLoadArgs } from './util/validate';
import {
  SOURCE_CONFIG_FETCH_ERROR,
  SOURCE_CONFIG_OPTION_ERROR,
  SOURCE_CONFIG_RESOLUTION_ERROR,
  SOURCE_DISABLED_ERROR,
} from '../../constants/logMessages';
import { filterEnabledDestination } from '../utilities/destinations';
import { APP_VERSION } from '../../constants/app';
import { state } from '../../state';
import { getIntegrationsCDNPath, getPluginsCDNPath } from './util/cdnPaths';
import type { IConfigManager } from './types';
import {
  getSourceConfigURL,
  updateConsentsState,
  updateConsentsStateFromLoadOptions,
  updateReportingState,
  updateStorageStateFromLoadOptions,
} from './util/commonUtil';
import { METRICS_SERVICE_ENDPOINT } from './constants';

class ConfigManager implements IConfigManager {
  private_httpClient: IHttpClient;
  private_errorHandler?: IErrorHandler;
  private_logger?: ILogger;

  constructor(httpClient: IHttpClient, errorHandler?: IErrorHandler, logger?: ILogger) {
    this.private_errorHandler = errorHandler;
    this.private_logger = logger;
    this.private_httpClient = httpClient;

    this.private_onError = this.private_onError.bind(this);
    this.private_processConfig = this.private_processConfig.bind(this);
  }

  private_attachEffects() {
    effect(() => {
      this.private_logger?.setMinLogLevel(state.lifecycle.logLevel.value);
    });
  }

  /**
   * A function to validate, construct and store loadOption, lifecycle, source and destination
   * config related information in global state
   */
  init() {
    this.private_attachEffects();

    validateLoadArgs(state.lifecycle.writeKey.value, state.lifecycle.dataPlaneUrl.value);

    const {
      logLevel,
      configUrl,
      lockIntegrationsVersion,
      lockPluginsVersion,
      destSDKBaseURL,
      pluginsSDKBaseURL,
    } = state.loadOptions.value;

    state.lifecycle.activeDataplaneUrl.value = removeTrailingSlashes(
      state.lifecycle.dataPlaneUrl.value,
    ) as string;

    // determine the path to fetch integration SDK from
    const intgCdnUrl = getIntegrationsCDNPath(
      APP_VERSION,
      lockIntegrationsVersion as boolean,
      destSDKBaseURL,
    );
    // determine the path to fetch remote plugins from
    const pluginsCDNPath = getPluginsCDNPath(
      APP_VERSION,
      lockPluginsVersion as boolean,
      pluginsSDKBaseURL,
    );

    updateStorageStateFromLoadOptions(this.private_logger);
    updateConsentsStateFromLoadOptions(this.private_logger);

    // set application lifecycle state in global state
    batch(() => {
      state.lifecycle.integrationsCDNPath.value = intgCdnUrl;
      state.lifecycle.pluginsCDNPath.value = pluginsCDNPath;

      if (logLevel) {
        state.lifecycle.logLevel.value = logLevel;
      }

      state.lifecycle.sourceConfigUrl.value = getSourceConfigURL(
        configUrl,
        state.lifecycle.writeKey.value as string,
        lockIntegrationsVersion as boolean,
        lockPluginsVersion as boolean,
        this.private_logger,
      );
      state.metrics.metricsServiceUrl.value = `${state.lifecycle.activeDataplaneUrl.value}/${METRICS_SERVICE_ENDPOINT}`;
    });

    this.private_getConfig();
  }

  /**
   * Handle errors
   */
  private_onError(error: any, customMessage?: string, shouldAlwaysThrow?: boolean) {
    if (this.private_errorHandler) {
      this.private_errorHandler.onError(error, CONFIG_MANAGER, customMessage, shouldAlwaysThrow);
    } else {
      throw error;
    }
  }

  /**
   * A callback function that is executed once we fetch the source config response.
   * Use to construct and store information that are dependent on the sourceConfig.
   */
  private_processConfig(
    response: SourceConfigResponse | undefined | null,
    details?: IResponseDetails,
  ) {
    // TODO: add retry logic with backoff based on details
    // We can use isErrRetryable utility method
    if (!response) {
      this.private_logger?.error(SOURCE_CONFIG_FETCH_ERROR(details?.error?.message));
      return;
    }

    if (!isValidSourceConfig(response)) {
      this.private_onError(SOURCE_CONFIG_RESOLUTION_ERROR);
      return;
    }

    // Log error and abort if source is disabled
    if (response.source.enabled === false) {
      this.private_logger?.error(SOURCE_DISABLED_ERROR);
      return;
    }

    // set the values in state for reporting slice
    updateReportingState(response);

    const nativeDestinations: Destination[] =
      response.source.destinations.length > 0
        ? filterEnabledDestination(response.source.destinations)
        : [];

    // set in the state --> source, destination, lifecycle, reporting
    batch(() => {
      // set source related information in state
      state.source.value = {
        config: response.source.config,
        id: response.source.id,
        workspaceId: response.source.workspaceId,
      };

      // set device mode destination related information in state
      state.nativeDestinations.configuredDestinations.value = nativeDestinations;

      // set the desired optional plugins
      state.plugins.pluginsToLoadFromConfig.value = state.loadOptions.value.plugins ?? [];

      updateConsentsState(response);

      // set application lifecycle state
      state.lifecycle.status.value = 'configured';
    });
  }

  /**
   * A function to fetch source config either from /sourceConfig endpoint
   * or from getSourceConfig load option
   * @returns
   */
  private_getConfig() {
    const sourceConfigFunc = state.loadOptions.value.getSourceConfig;
    if (sourceConfigFunc) {
      if (!isFunction(sourceConfigFunc)) {
        throw new Error(SOURCE_CONFIG_OPTION_ERROR);
      }
      // Fetch source config from the function
      const res = sourceConfigFunc();
      if (res instanceof Promise) {
        res
          .then(pRes => this.private_processConfig(pRes))
          .catch(err => {
            this.private_onError(err, 'SourceConfig', true);
          });
      } else {
        this.private_processConfig(res);
      }
    } else {
      // Fetch source configuration from the configured URL
      this.private_httpClient.request<SourceConfigResponse>({
        url: state.lifecycle.sourceConfigUrl.value as string,
        options: {
          method: 'GET',
          useAuth: true,
        },
        callback: this.private_processConfig,
      });
    }
  }
}

export { ConfigManager };
