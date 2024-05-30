/* eslint-disable class-methods-use-this */
import type {
  IHttpClient,
  ResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import { batch, effect } from '@preact/signals-core';
import { isFunction, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { isValidURL } from '@rudderstack/analytics-js-common/utilities/url';
import { getDataServiceUrl, isValidSourceConfig, validateLoadArgs } from './util/validate';
import {
  DATA_PLANE_URL_ERROR,
  SOURCE_CONFIG_FETCH_ERROR,
  SOURCE_CONFIG_OPTION_ERROR,
  SOURCE_CONFIG_RESOLUTION_ERROR,
  SOURCE_DISABLED_ERROR,
} from '../../constants/logMessages';
import { filterEnabledDestination } from '../utilities/destinations';
import { removeTrailingSlashes } from '../utilities/url';
import { APP_VERSION } from '../../constants/app';
import { state } from '../../state';
import { resolveDataPlaneUrl } from './util/dataPlaneResolver';
import { getIntegrationsCDNPath, getPluginsCDNPath } from './util/cdnPaths';
import type { IConfigManager, SourceConfigResponse } from './types';
import {
  getSourceConfigURL,
  updateConsentsState,
  updateConsentsStateFromLoadOptions,
  updateDataPlaneEventsStateFromLoadOptions,
  updateReportingState,
  updateStorageStateFromLoadOptions,
} from './util/commonUtil';
import { DEFAULT_DATA_SERVICE_ENDPOINT } from './constants';

class ConfigManager implements IConfigManager {
  httpClient: IHttpClient;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  hasErrorHandler = false;

  constructor(httpClient: IHttpClient, errorHandler?: IErrorHandler, logger?: ILogger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.httpClient = httpClient;
    this.hasErrorHandler = Boolean(this.errorHandler);

    this.onError = this.onError.bind(this);
    this.processConfig = this.processConfig.bind(this);
  }

  attachEffects() {
    effect(() => {
      this.logger?.setMinLogLevel(state.lifecycle.logLevel.value);
    });
  }

  /**
   * A function to validate, construct and store loadOption, lifecycle, source and destination
   * config related information in global state
   */
  init() {
    this.attachEffects();

    validateLoadArgs(state.lifecycle.writeKey.value, state.lifecycle.dataPlaneUrl.value);

    const lockIntegrationsVersion = state.loadOptions.value.lockIntegrationsVersion as boolean;

    // determine the path to fetch integration SDK from
    const intgCdnUrl = getIntegrationsCDNPath(
      APP_VERSION,
      lockIntegrationsVersion,
      state.loadOptions.value.destSDKBaseURL,
    );
    // determine the path to fetch remote plugins from
    const pluginsCDNPath = getPluginsCDNPath(state.loadOptions.value.pluginsSDKBaseURL);

    updateStorageStateFromLoadOptions(this.logger);
    updateConsentsStateFromLoadOptions(this.logger);
    updateDataPlaneEventsStateFromLoadOptions(this.logger);

    const { useServerSideCookies, dataServiceEndpoint, logLevel, configUrl } =
      state.loadOptions.value;

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
        lockIntegrationsVersion,
        this.logger,
      );

      if (useServerSideCookies) {
        state.serverCookies.isEnabledServerSideCookies.value = useServerSideCookies;
        const dataServiceUrl = getDataServiceUrl(
          dataServiceEndpoint ?? DEFAULT_DATA_SERVICE_ENDPOINT,
        );
        if (isValidURL(dataServiceUrl)) {
          state.serverCookies.dataServiceUrl.value = removeTrailingSlashes(
            dataServiceUrl,
          ) as string;
        } else {
          state.serverCookies.isEnabledServerSideCookies.value = false;
        }
      }
    });

    this.getConfig();
  }

  /**
   * Handle errors
   */
  onError(error: unknown, customMessage?: string, shouldAlwaysThrow?: boolean) {
    if (this.hasErrorHandler) {
      this.errorHandler?.onError(error, CONFIG_MANAGER, customMessage, shouldAlwaysThrow);
    } else {
      throw error;
    }
  }

  /**
   * A callback function that is executed once we fetch the source config response.
   * Use to construct and store information that are dependent on the sourceConfig.
   */
  processConfig(response?: SourceConfigResponse | string, details?: ResponseDetails) {
    // TODO: add retry logic with backoff based on rejectionDetails.xhr.status
    // We can use isErrRetryable utility method
    if (!response) {
      this.onError(SOURCE_CONFIG_FETCH_ERROR(details?.error));
      return;
    }

    let res: SourceConfigResponse;
    try {
      if (isString(response)) {
        res = JSON.parse(response);
      } else {
        res = response;
      }
    } catch (err) {
      this.onError(err, SOURCE_CONFIG_RESOLUTION_ERROR, true);
      return;
    }

    if (!isValidSourceConfig(res)) {
      this.onError(new Error(SOURCE_CONFIG_RESOLUTION_ERROR), undefined, true);
      return;
    }

    // Log error and abort if source is disabled
    if (res.source.enabled === false) {
      this.logger?.error(SOURCE_DISABLED_ERROR);
      return;
    }

    // set the values in state for reporting slice
    updateReportingState(res, this.logger);

    // determine the dataPlane url
    const dataPlaneUrl = resolveDataPlaneUrl(
      res.source.dataplanes,
      state.lifecycle.dataPlaneUrl.value,
      state.loadOptions.value.residencyServer,
      this.logger,
    );

    if (!dataPlaneUrl) {
      this.onError(new Error(DATA_PLANE_URL_ERROR), undefined, true);
      return;
    }
    const nativeDestinations: Destination[] =
      res.source.destinations.length > 0 ? filterEnabledDestination(res.source.destinations) : [];

    // set in the state --> source, destination, lifecycle, reporting
    batch(() => {
      // set source related information in state
      state.source.value = {
        config: res.source.config,
        id: res.source.id,
        workspaceId: res.source.workspaceId,
      };

      // set device mode destination related information in state
      state.nativeDestinations.configuredDestinations.value = nativeDestinations;

      // set the desired optional plugins
      state.plugins.pluginsToLoadFromConfig.value = state.loadOptions.value.plugins ?? [];

      updateConsentsState(res);

      // set application lifecycle state
      // Cast to string as we are sure that the value is not undefined
      state.lifecycle.activeDataplaneUrl.value = removeTrailingSlashes(dataPlaneUrl) as string;
      state.lifecycle.status.value = 'configured';
    });
  }

  /**
   * A function to fetch source config either from /sourceConfig endpoint
   * or from getSourceConfig load option
   * @returns
   */
  getConfig() {
    const sourceConfigFunc = state.loadOptions.value.getSourceConfig;
    if (sourceConfigFunc) {
      if (!isFunction(sourceConfigFunc)) {
        throw new Error(SOURCE_CONFIG_OPTION_ERROR);
      }
      // Fetch source config from the function
      const res = sourceConfigFunc();

      if (res instanceof Promise) {
        res
          .then(pRes => this.processConfig(pRes as SourceConfigResponse))
          .catch(err => {
            this.onError(err, 'SourceConfig');
          });
      } else {
        this.processConfig(res as SourceConfigResponse);
      }
    } else {
      // Fetch source configuration from the configured URL
      this.httpClient.getAsyncData({
        url: state.lifecycle.sourceConfigUrl.value as string,
        options: {
          headers: {
            'Content-Type': undefined,
          },
        },
        callback: this.processConfig,
      });
    }
  }
}

export { ConfigManager };
