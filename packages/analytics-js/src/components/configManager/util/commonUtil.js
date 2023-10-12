import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { batch } from '@preact/signals-core';
import { isDefined, isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { DEFAULT_STORAGE_TYPE } from '@rudderstack/analytics-js-common/types/Storage';
import {
  DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE,
  DEFAULT_PRE_CONSENT_STORAGE_STRATEGY,
} from '@rudderstack/analytics-js-common/constants/consent';
import { state } from '../../../state';
import {
  STORAGE_DATA_MIGRATION_OVERRIDE_WARNING,
  STORAGE_TYPE_VALIDATION_WARNING,
  UNSUPPORTED_CONSENT_MANAGER_ERROR,
  UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING,
  UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE,
  UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY,
  UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING,
} from '../../../constants/logMessages';
import {
  isErrorReportingEnabled,
  isMetricsReportingEnabled,
  getErrorReportingProviderNameFromConfig,
} from '../../utilities/statsCollection';
import { removeTrailingSlashes } from '../../utilities/url';
import {
  ConsentManagersToPluginNameMap,
  DEFAULT_ERROR_REPORTING_PROVIDER,
  DEFAULT_STORAGE_ENCRYPTION_VERSION,
  ErrorReportingProvidersToPluginNameMap,
  StorageEncryptionVersionsToPluginNameMap,
} from '../constants';
import { isValidStorageType } from './validate';
import { getUserSelectedConsentManager } from '../../utilities/consent';
/**
 * Determines the SDK url
 * @returns sdkURL
 */
const getSDKUrl = () => {
  const scripts = document.getElementsByTagName('script');
  let sdkURL;
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
  return sdkURL;
};
/**
 * Updates the reporting state variables from the source config data
 * @param res Source config
 * @param logger Logger instance
 */
const updateReportingState = (res, logger) => {
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
      logger === null || logger === void 0
        ? void 0
        : logger.warn(
            UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING(
              CONFIG_MANAGER,
              errReportingProvider,
              ErrorReportingProvidersToPluginNameMap,
              DEFAULT_ERROR_REPORTING_PROVIDER,
            ),
          );
    }
    state.reporting.errorReportingProviderPluginName.value =
      errReportingProviderPlugin !== null && errReportingProviderPlugin !== void 0
        ? errReportingProviderPlugin
        : ErrorReportingProvidersToPluginNameMap[DEFAULT_ERROR_REPORTING_PROVIDER];
  }
};
const updateStorageState = logger => {
  var _a;
  const storageOptsFromLoad = state.loadOptions.value.storage;
  let storageType =
    storageOptsFromLoad === null || storageOptsFromLoad === void 0
      ? void 0
      : storageOptsFromLoad.type;
  if (isDefined(storageType) && !isValidStorageType(storageType)) {
    logger === null || logger === void 0
      ? void 0
      : logger.warn(
          STORAGE_TYPE_VALIDATION_WARNING(CONFIG_MANAGER, storageType, DEFAULT_STORAGE_TYPE),
        );
    storageType = DEFAULT_STORAGE_TYPE;
  }
  let storageEncryptionVersion =
    (_a =
      storageOptsFromLoad === null || storageOptsFromLoad === void 0
        ? void 0
        : storageOptsFromLoad.encryption) === null || _a === void 0
      ? void 0
      : _a.version;
  const encryptionPluginName =
    storageEncryptionVersion && StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion];
  if (!isUndefined(storageEncryptionVersion) && isUndefined(encryptionPluginName)) {
    // set the default encryption plugin
    logger === null || logger === void 0
      ? void 0
      : logger.warn(
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
  // Allow migration only if the configured encryption version is the default encryption version
  const configuredMigrationValue =
    storageOptsFromLoad === null || storageOptsFromLoad === void 0
      ? void 0
      : storageOptsFromLoad.migrate;
  const finalMigrationVal =
    configuredMigrationValue && storageEncryptionVersion === DEFAULT_STORAGE_ENCRYPTION_VERSION;
  if (configuredMigrationValue === true && finalMigrationVal !== configuredMigrationValue) {
    logger === null || logger === void 0
      ? void 0
      : logger.warn(
          STORAGE_DATA_MIGRATION_OVERRIDE_WARNING(
            CONFIG_MANAGER,
            storageEncryptionVersion,
            DEFAULT_STORAGE_ENCRYPTION_VERSION,
          ),
        );
  }
  batch(() => {
    state.storage.type.value = storageType;
    state.storage.cookie.value =
      storageOptsFromLoad === null || storageOptsFromLoad === void 0
        ? void 0
        : storageOptsFromLoad.cookie;
    state.storage.encryptionPluginName.value =
      StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion];
    state.storage.migrate.value = finalMigrationVal;
  });
};
const updateConsentsState = logger => {
  var _a, _b, _c, _d, _e, _f;
  // Get the consent manager if provided as load option
  const selectedConsentManager = getUserSelectedConsentManager(
    state.loadOptions.value.cookieConsentManager,
  );
  let consentManagerPluginName;
  if (selectedConsentManager) {
    // Get the corresponding plugin name of the selected consent manager from the supported consent managers
    consentManagerPluginName = ConsentManagersToPluginNameMap[selectedConsentManager];
    if (!consentManagerPluginName) {
      logger === null || logger === void 0
        ? void 0
        : logger.error(
            UNSUPPORTED_CONSENT_MANAGER_ERROR(
              CONFIG_MANAGER,
              selectedConsentManager,
              ConsentManagersToPluginNameMap,
            ),
          );
    }
  }
  // Pre-consent
  const preConsentOpts = state.loadOptions.value.preConsent;
  let storageStrategy =
    (_b =
      (_a =
        preConsentOpts === null || preConsentOpts === void 0 ? void 0 : preConsentOpts.storage) ===
        null || _a === void 0
        ? void 0
        : _a.strategy) !== null && _b !== void 0
      ? _b
      : DEFAULT_PRE_CONSENT_STORAGE_STRATEGY;
  const StorageStrategies = ['none', 'session', 'anonymousId'];
  if (isDefined(storageStrategy) && !StorageStrategies.includes(storageStrategy)) {
    storageStrategy = DEFAULT_PRE_CONSENT_STORAGE_STRATEGY;
    logger === null || logger === void 0
      ? void 0
      : logger.warn(
          UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY(
            CONFIG_MANAGER,
            (_c =
              preConsentOpts === null || preConsentOpts === void 0
                ? void 0
                : preConsentOpts.storage) === null || _c === void 0
              ? void 0
              : _c.strategy,
            DEFAULT_PRE_CONSENT_STORAGE_STRATEGY,
          ),
        );
  }
  let eventsDeliveryType =
    (_e =
      (_d =
        preConsentOpts === null || preConsentOpts === void 0 ? void 0 : preConsentOpts.events) ===
        null || _d === void 0
        ? void 0
        : _d.delivery) !== null && _e !== void 0
      ? _e
      : DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE;
  const deliveryTypes = ['immediate', 'buffer'];
  if (isDefined(eventsDeliveryType) && !deliveryTypes.includes(eventsDeliveryType)) {
    eventsDeliveryType = DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE;
    logger === null || logger === void 0
      ? void 0
      : logger.warn(
          UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE(
            CONFIG_MANAGER,
            (_f =
              preConsentOpts === null || preConsentOpts === void 0
                ? void 0
                : preConsentOpts.events) === null || _f === void 0
              ? void 0
              : _f.delivery,
            DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE,
          ),
        );
  }
  batch(() => {
    var _a, _b;
    state.consents.activeConsentManagerPluginName.value = consentManagerPluginName;
    state.consents.preConsentOptions.value = {
      enabled:
        ((_a = state.loadOptions.value.preConsent) === null || _a === void 0
          ? void 0
          : _a.enabled) === true,
      storage: {
        strategy: storageStrategy,
      },
      events: {
        delivery: eventsDeliveryType,
      },
      trackConsent:
        ((_b = state.loadOptions.value.preConsent) === null || _b === void 0
          ? void 0
          : _b.trackConsent) === true,
    };
  });
};
export { getSDKUrl, updateReportingState, updateStorageState, updateConsentsState };
