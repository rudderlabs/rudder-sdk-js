/* eslint-disable class-methods-use-this */
import { IHttpClient } from '@rudderstack/analytics-js/services/HttpClient/types';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultHttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { batch } from '@preact/signals-core';
import { validateLoadArgs } from '@rudderstack/analytics-js/components/configManager/util/validate';
import { state } from '@rudderstack/analytics-js/state';
import { Destination } from '@rudderstack/analytics-js/state/types';
import { resolveDataPlaneUrl } from './util/dataPlaneResolver';
import { getIntegrationsCDNPath } from './util/cdnPaths';
import { getSDKUrlInfo } from './util/commonUtil';
import { IConfigManager, SourceConfigResponse } from './types';
import { filterEnabledDestination } from './util/filterDestinations';

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
  }

  /**
   * A function to validate, construct and store loadOption, lifecycle, source and destination
   * config related information in global state
   */
  init() {
    validateLoadArgs(state.lifecycle.writeKey.value, state.lifecycle.dataPlaneUrl.value);
    // determine the sourceConfig url
    const intgCdnUrl = getIntegrationsCDNPath(
      'process.package_version',
      state.loadOptions.value.lockIntegrationsVersion as boolean,
      state.loadOptions.value.destSDKBaseURL,
    );

    // determine if the staging SDK is being used
    // TODO: deprecate this in new version and stop adding '-staging' in filenames
    const { isStaging } = getSDKUrlInfo();

    // set the final load option in state
    batch(() => {
      // set application lifecycle state in state
      if (state.loadOptions.value.logLevel) {
        state.lifecycle.logLevel.value = state.loadOptions.value.logLevel;
      }
      state.lifecycle.integrationsCDNPath.value = intgCdnUrl;
      if (state.loadOptions.value.configUrl) {
        state.lifecycle.sourceConfigUrl.value = `${state.loadOptions.value.configUrl}/sourceConfig/?p=process.module_type&v=process.package_version&writeKey=${state.lifecycle.writeKey.value}&lockIntegrationsVersion=${state.loadOptions.value.lockIntegrationsVersion}`;
      }
      state.lifecycle.isStaging.value = isStaging;
    });
    this.getConfig();
  }

  /**
   * A callback function that is executed once we fetch the source config response.
   * Use to construct and store information that are dependent on the sourceConfig.
   * @param res source config response
   */
  processConfig(res?: SourceConfigResponse | string) {
    if (!res || typeof res !== 'object') {
      throw Error('Unable to fetch source config');
    }
    // determine the dataPlane url
    const dataPlaneUrl = resolveDataPlaneUrl(
      res.source.dataplanes,
      state.lifecycle.dataPlaneUrl.value,
      state.loadOptions.value.residencyServer,
    );
    const nativeDestinations: Destination[] =
      res.source.destinations.length > 0 ? filterEnabledDestination(res.source.destinations) : [];

    // set in the state --> source, destination, lifecycle, reporting
    batch(() => {
      // set source related information in state
      state.source.value = {
        id: res.source.id,
      };
      // set device mode destination related information in state
      state.destinations.value = nativeDestinations;

      // set application lifecycle state
      state.lifecycle.activeDataplaneUrl.value = dataPlaneUrl;
      state.lifecycle.status.value = 'configured';

      // set the values in state for reporting slice
      state.reporting.isErrorReportingEnabled.value =
        res.source.config.statsCollection.errorReports.enabled || false;
      state.reporting.isMetricsReportingEnabled.value =
        res.source.config.statsCollection.metrics.enabled || false;
    });
  }

  /**
   * A function to fetch source config either from /sourceConfig endpoint
   * or from getSourceConfig load option
   * @returns
   */
  getConfig() {
    const sourceConfigOption = state.loadOptions.value.getSourceConfig;
    if (sourceConfigOption) {
      // fetch source config from the function
      const res = sourceConfigOption();

      if (res instanceof Promise) {
        res
          .then(pRes => this.processConfig(pRes as SourceConfigResponse))
          .catch(e => {
            if (this.hasErrorHandler) {
              this.errorHandler?.onError(e, 'sourceConfig');
            }
          });
      } else {
        this.processConfig(res as SourceConfigResponse);
      }
      return;
    }

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
