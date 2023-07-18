import { state } from '@rudderstack/analytics-js/state';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { CONFIG_MANAGER } from '@rudderstack/analytics-js/constants/loggerContexts';
import { batch } from '@preact/signals-core';
import {
  STORAGE_DATA_MIGRATION_OVERRIDE_WARNING,
  UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING,
  UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING,
} from '@rudderstack/analytics-js/constants/logMessages';
import {
  isErrorReportingEnabled,
  isMetricsReportingEnabled,
  getErrorReportingProviderNameFromConfig,
} from '../../utilities/statsCollection';
import { removeTrailingSlashes } from '../../utilities/url';
import { SourceConfigResponse } from '../types';
import { isUndefined } from '../../utilities/checks';
import {
  DEFAULT_ERROR_REPORTING_PROVIDER,
  DEFAULT_STORAGE_ENCRYPTION_VERSION,
  ErrorReportingProvidersToPluginNameMap,
  StorageEncryptionVersionsToPluginNameMap,
} from '../constants';

/**
 * Determines the SDK url
 * @returns sdkURL
 */
const getSDKUrl = (): string | undefined => {
  const scripts = document.getElementsByTagName('script');
  let sdkURL: string | undefined;
  const scriptList = Array.prototype.slice.call(scripts);

  scriptList.some(script => {
    const curScriptSrc = removeTrailingSlashes(script.getAttribute('src'));
    if (curScriptSrc) {
      const urlMatches = curScriptSrc.match(/^.*rsa?(\.min)?\.js$/);
      if (urlMatches) {
        sdkURL = curScriptSrc;
        return true;
      }
    }
    return false;
  });

  // TODO: Return the URL object instead of the plain URL string
  return sdkURL;
};

/**
 * Updates the reporting state variables from the source config data
 * @param res Source config
 * @param logger Logger instance
 */
const updateReportingState = (res: SourceConfigResponse, logger?: ILogger): void => {
  state.reporting.isErrorReportingEnabled.value = isErrorReportingEnabled(res.source.config);
  state.reporting.isMetricsReportingEnabled.value = isMetricsReportingEnabled(res.source.config);

  if (state.reporting.isErrorReportingEnabled.value) {
    const errReportingProvider = getErrorReportingProviderNameFromConfig(res.source.config);

    // Get the corresponding plugin name of the selected error reporting provider from the supported error reporting providers
    const errReportingProviderPlugin = errReportingProvider
      ? ErrorReportingProvidersToPluginNameMap[errReportingProvider]
      : undefined;

    if (!isUndefined(errReportingProvider) && !errReportingProviderPlugin) {
      // set the default error reporting provider
      logger?.warn(
        UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING(
          CONFIG_MANAGER,
          errReportingProvider,
          ErrorReportingProvidersToPluginNameMap,
          DEFAULT_ERROR_REPORTING_PROVIDER,
        ),
      );
    }

    state.reporting.errorReportingProviderPluginName.value =
      errReportingProviderPlugin ??
      ErrorReportingProvidersToPluginNameMap[DEFAULT_ERROR_REPORTING_PROVIDER];
  }
};

const updateStorageState = (logger?: ILogger): void => {
  let storageEncryptionVersion = state.loadOptions.value.storage?.encryption?.version;
  const encryptionPluginName =
    storageEncryptionVersion && StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion];

  if (!isUndefined(storageEncryptionVersion) && isUndefined(encryptionPluginName)) {
    // set the default encryption plugin
    logger?.warn(
      UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING(
        CONFIG_MANAGER,
        storageEncryptionVersion,
        StorageEncryptionVersionsToPluginNameMap,
        DEFAULT_STORAGE_ENCRYPTION_VERSION,
      ),
    );
    storageEncryptionVersion = DEFAULT_STORAGE_ENCRYPTION_VERSION;
  } else if (isUndefined(storageEncryptionVersion)) {
    storageEncryptionVersion = DEFAULT_STORAGE_ENCRYPTION_VERSION;
  }

  batch(() => {
    state.storage.encryptionPluginName.value =
      StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion as string];

    // Allow migration only if the configured encryption version is the default encryption version
    const configuredMigrationValue = state.loadOptions.value.storage?.migrate;
    state.storage.migrate.value =
      (configuredMigrationValue as boolean) &&
      storageEncryptionVersion === DEFAULT_STORAGE_ENCRYPTION_VERSION;
    if (
      configuredMigrationValue === true &&
      state.storage.migrate.value !== configuredMigrationValue
    ) {
      logger?.warn(
        STORAGE_DATA_MIGRATION_OVERRIDE_WARNING(
          CONFIG_MANAGER,
          storageEncryptionVersion,
          DEFAULT_STORAGE_ENCRYPTION_VERSION,
        ),
      );
    }
  });
};

export { getSDKUrl, updateReportingState, updateStorageState };
