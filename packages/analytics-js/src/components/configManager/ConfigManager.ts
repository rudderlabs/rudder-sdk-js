/* eslint-disable class-methods-use-this */
import { IHttpClient, ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { batch, effect } from '@preact/signals-core';
import {
  isValidSourceConfig,
  isValidStorageType,
  validateLoadArgs,
} from '@rudderstack/analytics-js/components/configManager/util/validate';
import { isFunction, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { LifecycleStatus } from '@rudderstack/analytics-js-common/types/ApplicationLifecycle';
import { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { DEFAULT_STORAGE_TYPE } from '@rudderstack/analytics-js-common/types/Storage';
import {
  DATA_PLANE_URL_ERROR,
  SOURCE_CONFIG_FETCH_ERROR,
  SOURCE_CONFIG_OPTION_ERROR,
  STORAGE_TYPE_VALIDATION_WARNING,
  UNSUPPORTED_CONSENT_MANAGER_ERROR,
} from '../../constants/logMessages';
import { getSourceConfigURL } from '../utilities/loadOptions';
import { filterEnabledDestination } from '../utilities/destinations';
import { removeTrailingSlashes } from '../utilities/url';
import { APP_VERSION } from '../../constants/app';
import { state } from '../../state';
import { resolveDataPlaneUrl } from './util/dataPlaneResolver';
import { getIntegrationsCDNPath, getPluginsCDNPath } from './util/cdnPaths';
import { IConfigManager, SourceConfigResponse } from './types';
import { getUserSelectedConsentManager } from '../utilities/consent';
import { updateReportingState, updateStorageState } from './util/commonUtil';
import { ConsentManagersToPluginNameMap } from './constants';

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
    let consentManagerPluginName: PluginName | undefined;
    this.attachEffects();
    const lockIntegrationsVersion = state.loadOptions.value.lockIntegrationsVersion as boolean;

    validateLoadArgs(state.lifecycle.writeKey.value, state.lifecycle.dataPlaneUrl.value);

    // determine the path to fetch integration SDK from
    const intgCdnUrl = getIntegrationsCDNPath(
      APP_VERSION,
      lockIntegrationsVersion,
      state.loadOptions.value.destSDKBaseURL,
    );
    // determine the path to fetch remote plugins from
    const pluginsCDNPath = getPluginsCDNPath(state.loadOptions.value.pluginsSDKBaseURL);

    // Get the consent manager if provided as load option
    const selectedConsentManager = getUserSelectedConsentManager(
      state.loadOptions.value.cookieConsentManager,
    );

    if (selectedConsentManager) {
      // Get the corresponding plugin name of the selected consent manager from the supported consent managers
      consentManagerPluginName = ConsentManagersToPluginNameMap[selectedConsentManager];
      if (!consentManagerPluginName) {
        this.logger?.error(
          UNSUPPORTED_CONSENT_MANAGER_ERROR(
            CONFIG_MANAGER,
            selectedConsentManager,
            ConsentManagersToPluginNameMap,
          ),
        );
      }
    }

    updateStorageState(this.logger);

    let storageType = state.loadOptions.value.storage?.type;
    if (!isValidStorageType(storageType)) {
      this.logger?.warn(
        STORAGE_TYPE_VALIDATION_WARNING(CONFIG_MANAGER, storageType, DEFAULT_STORAGE_TYPE),
      );
      storageType = DEFAULT_STORAGE_TYPE;
    }

    // set application lifecycle state in global state
    batch(() => {
      state.lifecycle.integrationsCDNPath.value = intgCdnUrl;
      state.lifecycle.pluginsCDNPath.value = pluginsCDNPath;

      if (state.loadOptions.value.logLevel) {
        state.lifecycle.logLevel.value = state.loadOptions.value.logLevel;
      }

      if (state.loadOptions.value.configUrl) {
        state.lifecycle.sourceConfigUrl.value = getSourceConfigURL(
          state.loadOptions.value.configUrl,
          state.lifecycle.writeKey.value as string,
          lockIntegrationsVersion,
          this.logger,
        );
      }

      // Set consent manager plugin name in state
      state.consents.activeConsentManagerPluginName.value = consentManagerPluginName;

      // set storage type in state
      state.storage.type.value = storageType;
      // set storage type in state
      state.storage.cookie.value = state.loadOptions.value.storage?.cookie;
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
    const errMessage = 'Unable to process/parse source config';

    try {
      if (isString(response)) {
        res = JSON.parse(response as string);
      } else {
        res = response as SourceConfigResponse;
      }
    } catch (e) {
      this.onError(e, errMessage, true);
      return;
    }

    if (!isValidSourceConfig(res)) {
      this.onError(new Error(errMessage), undefined, true);
      return;
    }

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
      };

      // set device mode destination related information in state
      state.nativeDestinations.configuredDestinations.value = nativeDestinations;

      // set the values in state for reporting slice
      updateReportingState(res, this.logger);

      // set the desired optional plugins
      state.plugins.pluginsToLoadFromConfig.value = state.loadOptions.value.plugins ?? [];

      // set application lifecycle state
      // Cast to string as we are sure that the value is not undefined
      state.lifecycle.activeDataplaneUrl.value = removeTrailingSlashes(dataPlaneUrl) as string;
      state.lifecycle.status.value = LifecycleStatus.Configured;
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
      // fetch source config from the function
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
      // fetch source config from config url API
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
