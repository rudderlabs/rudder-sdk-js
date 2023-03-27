/* eslint-disable class-methods-use-this */
import { defaultLogger, Logger } from '@rudderstack/analytics-js/services/Logger';
import { defaultErrorHandler, ErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { HttpClient, defaultHttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { LoadOptions } from '@rudderstack/analytics-js/components/core/IAnalytics';
import { batch } from '@preact/signals-core';
import { validateLoadArgs } from '@rudderstack/analytics-js/components/configManager/util/validate';
import { loadOptionsState } from '@rudderstack/analytics-js/state/slices/loadOptions';
import { sourceConfigState } from '@rudderstack/analytics-js/state/slices/source';
import {
  Destination,
  destinationConfigState,
} from '@rudderstack/analytics-js/state/slices/destinations';
import { lifecycleState } from '@rudderstack/analytics-js/state/slices/lifecycle';
import { resolveDataPlaneUrl } from './util/dataPlaneResolver';
import { getIntegrationsCDNPath } from './util/cdnPaths';
import { getSDKUrlInfo } from './util/commonUtil';

class ConfigManager {
  httpClient: HttpClient;
  errorHandler?: ErrorHandler;
  logger?: Logger;
  hasErrorHandler = false;
  hasLogger = false;

  constructor(httpClient: HttpClient, errorHandler?: ErrorHandler, logger?: Logger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.httpClient = httpClient;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.hasLogger = Boolean(this.logger);
  }

  setLoadOptions(
    writeKey: string,
    dataPlaneUrl: string | undefined,
    loadOptions: LoadOptions | undefined,
  ) {
    // TODO: create a deepcopy of loadOption if not done in previous step
    validateLoadArgs(writeKey, dataPlaneUrl, loadOptions);
    const finalLoadOption: LoadOptions = mergeDeepRight(
      loadOptionsState.loadOptions.value, // default load options from state
      loadOptions || {},
    );
    // determine the sourceConfig url
    const intgCdnUrl = getIntegrationsCDNPath(
      '2.28.0', // TODO: use package.version
      loadOptionsState.loadOptions.value.lockIntegrationsVersion as boolean,
      loadOptionsState.loadOptions.value.destSDKBaseURL,
    );

    // determine if the staging SDK is being used
    const { isStaging } = getSDKUrlInfo();

    // set the final load option in state
    batch(() => {
      loadOptionsState.writeKey.value = writeKey;
      loadOptionsState.dataPlaneUrl.value = dataPlaneUrl;
      loadOptionsState.loadOptions.value = finalLoadOption;

      // set application lifecycle state in state
      if (loadOptionsState.loadOptions.value.logLevel) {
        lifecycleState.logLevel.value = loadOptionsState.loadOptions.value.logLevel;
      }
      lifecycleState.integrationsCDNPath.value = intgCdnUrl;
      if (loadOptionsState.loadOptions.value.configUrl) {
        lifecycleState.sourceConfigUrl.value = `${loadOptionsState.loadOptions.value.configUrl}/sourceConfig/?p=process.module_type&v=process.package_version&writeKey=${loadOptionsState.writeKey.value}`;
      }
      lifecycleState.isStaging.value = isStaging;
    });
    this.fetchSourceConfig();
  }

  fetchSourceConfig() {
    this.httpClient.getAsyncData({
      url: lifecycleState.sourceConfigUrl.value,
      callback: res => {
        // determine the dataPlane url
        const dataPlaneUrl = resolveDataPlaneUrl(
          res.source.dataplanes,
          loadOptionsState.dataPlaneUrl.value,
          loadOptionsState.loadOptions.value.residencyServer,
        );
        const nativeDestinations: any = [];
        res.source.destinations.forEach((destination: Destination) => {
          if (destination.enabled && destination.deleted !== true) {
            nativeDestinations.push({
              id: destination.id,
              name: destination.destinationDefinition.name,
              config: destination.config,
              areTransformationsConnected: destination.areTransformationsConnected || false,
            });
          }
        });
        // set in the state --> source, destination, lifecycle
        batch(() => {
          // set source related information in state
          sourceConfigState.value = {
            id: res.source.id,
            config: res.source.config,
            // dataplanes: res.source.dataplanes,
          };
          // set device mode destination related information in state
          destinationConfigState.value = nativeDestinations;
          // set application lifecycle state
          lifecycleState.activeDataplaneUrl.value = dataPlaneUrl;
          lifecycleState.status.value = 'configured';
        });
      },
    });
  }
}

const defaultConfigManager = new ConfigManager(
  defaultHttpClient,
  defaultErrorHandler,
  defaultLogger,
);

export { ConfigManager, defaultConfigManager };
