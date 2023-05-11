/* eslint-disable class-methods-use-this */
import { IHttpClient } from '@rudderstack/analytics-js/services/HttpClient/types';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultHttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { batch, effect } from '@preact/signals-core';
import {
  isValidSourceConfig,
  validateLoadArgs,
} from '@rudderstack/analytics-js/components/configManager/util/validate';
import { state } from '@rudderstack/analytics-js/state';
import { Destination, LifecycleStatus } from '@rudderstack/analytics-js/state/types';
import { APP_VERSION, MODULE_TYPE } from '@rudderstack/analytics-js/constants/app';
import { PluginName } from '@rudderstack/analytics-js/components/pluginsManager/types';
import { resolveDataPlaneUrl } from './util/dataPlaneResolver';
import { getIntegrationsCDNPath } from './util/cdnPaths';
import { getSDKUrlInfo } from './util/commonUtil';
import { IConfigManager, SourceConfigResponse } from './types';
import { filterEnabledDestination, getNonCloudDestinations } from './util/filterDestinations';

class ConfigManager implements IConfigManager {
  httpClient: IHttpClient;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  hasErrorHandler = false;
  hasLogger = false;

  constructor(httpClient: IHttpClient, errorHandler?: IErrorHandler, logger?: ILogger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.httpClient = httpClient;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.hasLogger = Boolean(this.logger);

    this.onError = this.onError.bind(this);
    this.processConfig = this.processConfig.bind(this);
    this.getListOfPluginsToLoad = this.getListOfPluginsToLoad.bind(this);
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
    const lockIntegrationsVersion = state.loadOptions.value.lockIntegrationsVersion === true;
    // determine the path to fetch integration SDK url from
    const intgCdnUrl = getIntegrationsCDNPath(
      APP_VERSION,
      lockIntegrationsVersion,
      state.loadOptions.value.destSDKBaseURL,
    );

    // determine if the staging SDK is being used
    // TODO: deprecate this in new version and stop adding '-staging' in filenames
    const { isStaging } = getSDKUrlInfo();

    // set application lifecycle state in global state
    batch(() => {
      if (state.loadOptions.value.logLevel) {
        state.lifecycle.logLevel.value = state.loadOptions.value.logLevel;
      }
      state.lifecycle.integrationsCDNPath.value = intgCdnUrl;
      if (state.loadOptions.value.configUrl) {
        state.lifecycle.sourceConfigUrl.value = `${state.loadOptions.value.configUrl}/sourceConfig/?p=${MODULE_TYPE}&v=${APP_VERSION}&writeKey=${state.lifecycle.writeKey.value}&lockIntegrationsVersion=${lockIntegrationsVersion}`;
      }
      state.lifecycle.isStaging.value = isStaging;
    });

    this.getConfig();
  }

  /**
   * Handle errors
   */
  onError(error: Error | unknown, customMessage?: string, shouldAlwaysThrow?: boolean) {
    if (this.hasErrorHandler) {
      this.errorHandler?.onError(error, 'ConfigManager', customMessage, shouldAlwaysThrow);
    } else {
      throw error;
    }
  }

  /**
   * A callback function that is executed once we fetch the source config response.
   * Use to construct and store information that are dependent on the sourceConfig.
   */
  processConfig(response?: SourceConfigResponse | string) {
    if (!response) {
      this.onError('Unable to fetch source config', undefined, true);
      return;
    }

    let res: SourceConfigResponse;
    const errMessage = 'Unable to process/parse source config';

    try {
      if (typeof response === 'string') {
        res = JSON.parse(response);
      } else {
        res = response;
      }
    } catch (e) {
      this.onError(e, errMessage, true);
      return;
    }

    if (isValidSourceConfig(res)) {
      this.onError(errMessage, undefined, true);
      return;
    }

    // determine the dataPlane url
    const dataPlaneUrl = resolveDataPlaneUrl(
      res.source.dataplanes,
      state.lifecycle.dataPlaneUrl.value,
      state.loadOptions.value.residencyServer,
    );
    const nativeDestinations: Destination[] =
      res.source.destinations.length > 0 ? filterEnabledDestination(res.source.destinations) : [];
    const pluginsToLoad = this.getListOfPluginsToLoad(res);

    // set in the state --> source, destination, lifecycle, reporting
    batch(() => {
      // set source related information in state
      state.source.value = {
        id: res.source.id,
      };

      // set device mode destination related information in state
      // TODO: should this not only contain the non cloud destinations?
      state.destinations.value = nativeDestinations;

      // set the values in state for reporting slice
      state.reporting.isErrorReportingEnabled.value =
        res.source.config.statsCollection.errors.enabled || false;
      state.reporting.isMetricsReportingEnabled.value =
        res.source.config.statsCollection.metrics.enabled || false;

      // set the desired optional plugins
      state.plugins.pluginsToLoadFromConfig.value = pluginsToLoad;

      // set application lifecycle state
      state.lifecycle.activeDataplaneUrl.value = dataPlaneUrl;
      state.lifecycle.status.value = LifecycleStatus.Configured;
    });
  }

  // TODO: add logic for all plugins as we develop them
  // Determine the list of plugins that should be loaded based on sourceConfig & load options
  getListOfPluginsToLoad(res: SourceConfigResponse): PluginName[] {
    // This contains the default plugins if load option has been omitted by user
    let pluginsToLoadFromConfig = state.loadOptions.value.plugins;

    if (!pluginsToLoadFromConfig) {
      return [];
    }

    // Error reporting related plugins
    if (!res.source.config.statsCollection.errors.enabled) {
      pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(
        pluginName => pluginName !== PluginName.ErrorReporting,
      );
    }

    // Device mode destinations related plugins
    if (getNonCloudDestinations(res.source.destinations).length === 0) {
      pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(
        pluginName =>
          ![
            PluginName.DeviceModeDestinations,
            PluginName.DeviceModeTransformation,
            PluginName.NativeDestinationQueue,
          ].includes(pluginName),
      );
    }

    // Consent Management related plugins

    return pluginsToLoadFromConfig ?? [];
  }

  /**
   * A function to fetch source config either from /sourceConfig endpoint
   * or from getSourceConfig load option
   * @returns
   */
  getConfig() {
    const sourceConfigFunc = state.loadOptions.value.getSourceConfig;
    if (sourceConfigFunc) {
      if (typeof sourceConfigFunc !== 'function') {
        throw Error(`"getSourceConfig" must be a function`);
      }
      // fetch source config from the function
      const res = sourceConfigFunc();

      if (res instanceof Promise) {
        res
          .then(pRes => this.processConfig(pRes as SourceConfigResponse))
          .catch(e => {
            this.errorHandler?.onError(e, 'sourceConfig');
          });
      } else {
        this.processConfig(res as SourceConfigResponse);
      }
      return;
    }

    // TODO: add retry logic with backoff
    // fetch source config from config url API
    this.httpClient.getAsyncData({
      url: state.lifecycle.sourceConfigUrl.value,
      options: {
        headers: {
          'Content-Type': undefined,
        },
      },
      callback: this.processConfig,
    });
  }
}

const defaultConfigManager = new ConfigManager(
  defaultHttpClient,
  defaultErrorHandler,
  defaultLogger,
);

export { ConfigManager, defaultConfigManager };
