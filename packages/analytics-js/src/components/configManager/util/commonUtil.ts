import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { batch } from '@preact/signals-core';
import { isDefined, isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { DEFAULT_STORAGE_TYPE } from '@rudderstack/analytics-js-common/types/Storage';
import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { DeliveryType, StorageStrategy } from '@rudderstack/analytics-js-common/types/LoadOptions';
import {
  DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE,
  DEFAULT_PRE_CONSENT_STORAGE_STRATEGY,
} from '@rudderstack/analytics-js-common/constants/consent';
import { isNonEmptyObject } from '@rudderstack/analytics-js-common/utilities/object';
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
import { SourceConfigResponse } from '../types';
import {
  ConsentManagersToPluginNameMap,
  DEFAULT_ERROR_REPORTING_PROVIDER,
  DEFAULT_STORAGE_ENCRYPTION_VERSION,
  ErrorReportingProvidersToPluginNameMap,
  StorageEncryptionVersionsToPluginNameMap,
} from '../constants';
import { isValidStorageType } from './validate';

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
  const storageOptsFromLoad = state.loadOptions.value.storage;
  let storageType = storageOptsFromLoad?.type;
  if (isDefined(storageType) && !isValidStorageType(storageType)) {
    logger?.warn(
      STORAGE_TYPE_VALIDATION_WARNING(CONFIG_MANAGER, storageType, DEFAULT_STORAGE_TYPE),
    );
    storageType = DEFAULT_STORAGE_TYPE;
  }

  let storageEncryptionVersion = storageOptsFromLoad?.encryption?.version;
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

  // Allow migration only if the configured encryption version is the default encryption version
  const configuredMigrationValue = storageOptsFromLoad?.migrate;
  const finalMigrationVal =
    (configuredMigrationValue as boolean) &&
    storageEncryptionVersion === DEFAULT_STORAGE_ENCRYPTION_VERSION;

  if (configuredMigrationValue === true && finalMigrationVal !== configuredMigrationValue) {
    logger?.warn(
      STORAGE_DATA_MIGRATION_OVERRIDE_WARNING(
        CONFIG_MANAGER,
        storageEncryptionVersion,
        DEFAULT_STORAGE_ENCRYPTION_VERSION,
      ),
    );
  }

  batch(() => {
    state.storage.type.value = storageType;
    state.storage.cookie.value = storageOptsFromLoad?.cookie;

    state.storage.encryptionPluginName.value =
      StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion as string];

    state.storage.migrate.value = finalMigrationVal;
  });
};

const getCmpData = (logger?: ILogger) => {
  let consentManagerPluginName: PluginName | undefined;
  let allowedConsents: string[] | undefined;
  let deniedConsents: string[] | undefined;
  let cmpInitialized = false;

  const consentManagementOpts = state.loadOptions.value.consentManagement;
  if (
    consentManagementOpts &&
    isNonEmptyObject(consentManagementOpts) &&
    consentManagementOpts.enabled === true
  ) {
    const consentProvider = consentManagementOpts.provider;
    if (consentProvider === 'custom') {
      cmpInitialized = true;
      if (Array.isArray(consentManagementOpts.allowedConsents)) {
        allowedConsents = consentManagementOpts.allowedConsents;
      }

      if (Array.isArray(consentManagementOpts.deniedConsents)) {
        deniedConsents = consentManagementOpts.deniedConsents;
      }
    } else if (consentProvider) {
      // Get the corresponding plugin name of the selected consent manager from the supported consent managers
      consentManagerPluginName = ConsentManagersToPluginNameMap[consentProvider];
      if (!consentManagerPluginName) {
        logger?.error(
          UNSUPPORTED_CONSENT_MANAGER_ERROR(
            CONFIG_MANAGER,
            consentProvider,
            ConsentManagersToPluginNameMap,
          ),
        );
      }
    }
  }

  const data = {
    initialized: cmpInitialized,
    allowedConsents: allowedConsents ?? [],
    deniedConsents: deniedConsents ?? [],
  };

  return {
    consentManagerPluginName,
    data,
  };
};

const updateConsentsState = (logger?: ILogger): void => {
  const { consentManagerPluginName, data } = getCmpData(logger);

  // Pre-consent
  const preConsentOpts = state.loadOptions.value.preConsent;

  let storageStrategy: StorageStrategy =
    preConsentOpts?.storage?.strategy ?? DEFAULT_PRE_CONSENT_STORAGE_STRATEGY;
  const StorageStrategies = ['none', 'session', 'anonymousId'];
  if (isDefined(storageStrategy) && !StorageStrategies.includes(storageStrategy)) {
    storageStrategy = DEFAULT_PRE_CONSENT_STORAGE_STRATEGY;

    logger?.warn(
      UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY(
        CONFIG_MANAGER,
        preConsentOpts?.storage?.strategy,
        DEFAULT_PRE_CONSENT_STORAGE_STRATEGY,
      ),
    );
  }

  let eventsDeliveryType: DeliveryType =
    preConsentOpts?.events?.delivery ?? DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE;
  const deliveryTypes = ['immediate', 'buffer'];
  if (isDefined(eventsDeliveryType) && !deliveryTypes.includes(eventsDeliveryType)) {
    eventsDeliveryType = DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE;

    logger?.warn(
      UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE(
        CONFIG_MANAGER,
        preConsentOpts?.events?.delivery,
        DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE,
      ),
    );
  }

  batch(() => {
    state.consents.activeConsentManagerPluginName.value = consentManagerPluginName;

    state.consents.data.value = data;

    state.consents.preConsentOptions.value = {
      enabled: state.loadOptions.value.preConsent?.enabled === true,
      storage: {
        strategy: storageStrategy,
      },
      events: {
        delivery: eventsDeliveryType,
      },
      trackConsent: state.loadOptions.value.preConsent?.trackConsent === true,
    };
  });
};

export { getSDKUrl, updateReportingState, updateStorageState, updateConsentsState };
