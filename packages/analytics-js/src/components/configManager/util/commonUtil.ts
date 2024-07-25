import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { batch } from '@preact/signals-core';
import { isDefined, isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { isSDKRunningInChromeExtension } from '@rudderstack/analytics-js-common/utilities/detect';
import { DEFAULT_STORAGE_TYPE } from '@rudderstack/analytics-js-common/types/Storage';
import type {
  DeliveryType,
  StorageStrategy,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import {
  DEFAULT_PRE_CONSENT_EVENTS_DELIVERY_TYPE,
  DEFAULT_PRE_CONSENT_STORAGE_STRATEGY,
} from '@rudderstack/analytics-js-common/constants/consent';
import { isObjectLiteralAndNotNull } from '@rudderstack/analytics-js-common/utilities/object';
import type {
  ConsentManagementMetadata,
  ConsentResolutionStrategy,
} from '@rudderstack/analytics-js-common/types/Consent';
import { clone } from 'ramda';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { isValidURL, removeDuplicateSlashes } from '@rudderstack/analytics-js-common/utilities/url';
import { removeLeadingPeriod } from '@rudderstack/analytics-js-common/utilities/string';
import { MODULE_TYPE, APP_VERSION } from '../../../constants/app';
import { BUILD_TYPE, DEFAULT_CONFIG_BE_URL } from '../../../constants/urls';
import { state } from '../../../state';
import {
  INVALID_CONFIG_URL_WARNING,
  STORAGE_DATA_MIGRATION_OVERRIDE_WARNING,
  STORAGE_TYPE_VALIDATION_WARNING,
  UNSUPPORTED_BEACON_API_WARNING,
  UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE,
  UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY,
  UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING,
  SERVER_SIDE_COOKIE_FEATURE_OVERRIDE_WARNING,
} from '../../../constants/logMessages';
import {
  isErrorReportingEnabled,
  isMetricsReportingEnabled,
} from '../../utilities/statsCollection';
import { getDomain, removeTrailingSlashes } from '../../utilities/url';
import type { SourceConfigResponse } from '../types';
import {
  DEFAULT_DATA_SERVICE_ENDPOINT,
  DEFAULT_STORAGE_ENCRYPTION_VERSION,
  StorageEncryptionVersionsToPluginNameMap,
} from '../constants';
import { getDataServiceUrl, isValidStorageType, isWebpageTopLevelDomain } from './validate';
import { getConsentManagementData } from '../../utilities/consent';

/**
 * Determines the SDK URL
 * @returns sdkURL
 */
const getSDKUrl = (): string | undefined => {
  const scripts = document.getElementsByTagName('script');
  const sdkFileNameRegex = /(?:^|\/)rsa(\.min)?\.js$/;

  // eslint-disable-next-line no-restricted-syntax
  for (const script of scripts) {
    const src = script.getAttribute('src');
    if (src && sdkFileNameRegex.test(src)) {
      return src;
    }
  }

  return undefined;
};

/**
 * Updates the reporting state variables from the source config data
 * @param res Source config
 * @param logger Logger instance
 */
const updateReportingState = (res: SourceConfigResponse): void => {
  state.reporting.isErrorReportingEnabled.value = false;
  // TODO: Enable this once the error reporting is tested properly
  // state.reporting.isErrorReportingEnabled.value =
  //   isErrorReportingEnabled(res.source.config) && !isSDKRunningInChromeExtension();
  state.reporting.isMetricsReportingEnabled.value = isMetricsReportingEnabled(res.source.config);
};

const updateStorageStateFromLoadOptions = (logger?: ILogger): void => {
  const {
    useServerSideCookies,
    dataServiceEndpoint,
    storage: storageOptsFromLoad,
    setCookieDomain,
    sameDomainCookiesOnly,
  } = state.loadOptions.value;
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
    let cookieOptions = storageOptsFromLoad?.cookie ?? {};

    if (useServerSideCookies) {
      state.serverCookies.isEnabledServerSideCookies.value = useServerSideCookies;
      const providedCookieDomain = cookieOptions.domain ?? setCookieDomain;
      /**
       * Based on the following conditions, we decide whether to use the exact domain or not to determine the data service URL:
       * 1. If the cookie domain is provided and it is not a top-level domain, then use the exact domain
       * 2. If the sameDomainCookiesOnly flag is set to true, then use the exact domain
       */
      const useExactDomain =
        (isDefined(providedCookieDomain) &&
          !isWebpageTopLevelDomain(removeLeadingPeriod(providedCookieDomain as string))) ||
        sameDomainCookiesOnly;

      const dataServiceUrl = getDataServiceUrl(
        dataServiceEndpoint ?? DEFAULT_DATA_SERVICE_ENDPOINT,
        useExactDomain ?? false,
      );

      if (isValidURL(dataServiceUrl)) {
        state.serverCookies.dataServiceUrl.value = removeTrailingSlashes(dataServiceUrl) as string;

        const curHost = getDomain(window.location.href);
        const dataServiceHost = getDomain(dataServiceUrl);

        // If the current host is different from the data service host, then it is a cross-site request
        // For server-side cookies to work, we need to set the SameSite=None and Secure attributes
        // One round of cookie options manipulation is taking place here
        // Based on these(setCookieDomain/storage.cookie or sameDomainCookiesOnly) two load-options, final cookie options are set in the storage module
        // TODO: Refactor the cookie options manipulation logic in one place
        if (curHost !== dataServiceHost) {
          cookieOptions = {
            ...cookieOptions,
            samesite: 'None',
            secure: true,
          };
        }
        /**
         * If the sameDomainCookiesOnly flag is not set and the cookie domain is provided(not top level domain),
         * and the data service host is different from the provided cookie domain, then we disable server-side cookies
         * ex: provided cookie domain: 'random.com', data service host: 'sub.example.com'
         */
        if (
          !sameDomainCookiesOnly &&
          useExactDomain &&
          dataServiceHost !== removeLeadingPeriod(providedCookieDomain as string)
        ) {
          state.serverCookies.isEnabledServerSideCookies.value = false;
          logger?.warn(
            SERVER_SIDE_COOKIE_FEATURE_OVERRIDE_WARNING(
              CONFIG_MANAGER,
              providedCookieDomain,
              dataServiceHost as string,
            ),
          );
        }
      } else {
        state.serverCookies.isEnabledServerSideCookies.value = false;
      }
    }

    state.storage.cookie.value = cookieOptions;

    state.storage.encryptionPluginName.value =
      StorageEncryptionVersionsToPluginNameMap[storageEncryptionVersion as string];

    state.storage.migrate.value = finalMigrationVal;
  });
};

const updateConsentsStateFromLoadOptions = (logger?: ILogger): void => {
  const { provider, consentManagerPluginName, initialized, enabled, consentsData } =
    getConsentManagementData(state.loadOptions.value.consentManagement, logger);

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
    state.consents.initialized.value = initialized;
    state.consents.enabled.value = enabled;
    state.consents.data.value = consentsData;
    state.consents.provider.value = provider;

    state.consents.preConsent.value = {
      // Only enable pre-consent if it is explicitly enabled and
      // if it is not already initialized and
      // if consent management is enabled
      enabled:
        state.loadOptions.value.preConsent?.enabled === true &&
        initialized === false &&
        enabled === true,
      storage: {
        strategy: storageStrategy,
      },
      events: {
        delivery: eventsDeliveryType,
      },
    };
  });
};

/**
 * Determines the consent management state variables from the source config data
 * @param resp Source config response
 * @param logger Logger instance
 */
const updateConsentsState = (resp: SourceConfigResponse): void => {
  let resolutionStrategy: ConsentResolutionStrategy | undefined =
    state.consents.resolutionStrategy.value;

  let cmpMetadata: ConsentManagementMetadata | undefined;
  if (isObjectLiteralAndNotNull(resp.consentManagementMetadata)) {
    if (state.consents.provider.value) {
      resolutionStrategy =
        resp.consentManagementMetadata.providers.find(
          p => p.provider === state.consents.provider.value,
        )?.resolutionStrategy ?? state.consents.resolutionStrategy.value;
    }

    cmpMetadata = resp.consentManagementMetadata;
  }

  // If the provider is custom, then the resolution strategy is not applicable
  if (state.consents.provider.value === 'custom') {
    resolutionStrategy = undefined;
  }

  batch(() => {
    state.consents.metadata.value = clone(cmpMetadata);
    state.consents.resolutionStrategy.value = resolutionStrategy;
  });
};

const updateDataPlaneEventsStateFromLoadOptions = (logger?: ILogger) => {
  if (state.dataPlaneEvents.deliveryEnabled.value) {
    const defaultEventsQueuePluginName: PluginName = 'XhrQueue';
    let eventsQueuePluginName: PluginName = defaultEventsQueuePluginName;

    if (state.loadOptions.value.useBeacon) {
      if (state.capabilities.isBeaconAvailable.value) {
        eventsQueuePluginName = 'BeaconQueue';
      } else {
        eventsQueuePluginName = defaultEventsQueuePluginName;

        logger?.warn(UNSUPPORTED_BEACON_API_WARNING(CONFIG_MANAGER));
      }
    }

    batch(() => {
      state.dataPlaneEvents.eventsQueuePluginName.value = eventsQueuePluginName;
    });
  }
};

const getSourceConfigURL = (
  configUrl: string | undefined,
  writeKey: string,
  lockIntegrationsVersion: boolean,
  lockPluginsVersion: boolean,
  logger?: ILogger,
): string => {
  const defSearchParams = new URLSearchParams({
    p: MODULE_TYPE,
    v: APP_VERSION,
    build: BUILD_TYPE,
    writeKey,
    lockIntegrationsVersion: lockIntegrationsVersion.toString(),
    lockPluginsVersion: lockPluginsVersion.toString(),
  });

  let origin = DEFAULT_CONFIG_BE_URL;
  let searchParams = defSearchParams;
  let pathname = '/sourceConfig/';
  let hash = '';
  if (isValidURL(configUrl)) {
    const configUrlInstance = new URL(configUrl);
    if (!(removeTrailingSlashes(configUrlInstance.pathname) as string).endsWith('/sourceConfig')) {
      configUrlInstance.pathname = `${
        removeTrailingSlashes(configUrlInstance.pathname) as string
      }/sourceConfig/`;
    }
    configUrlInstance.pathname = removeDuplicateSlashes(configUrlInstance.pathname);

    defSearchParams.forEach((value, key) => {
      if (configUrlInstance.searchParams.get(key) === null) {
        configUrlInstance.searchParams.set(key, value);
      }
    });

    origin = configUrlInstance.origin;
    pathname = configUrlInstance.pathname;
    searchParams = configUrlInstance.searchParams;
    hash = configUrlInstance.hash;
  } else {
    logger?.warn(INVALID_CONFIG_URL_WARNING(CONFIG_MANAGER, configUrl));
  }

  return `${origin}${pathname}?${searchParams}${hash}`;
};

export {
  getSDKUrl,
  updateReportingState,
  updateStorageStateFromLoadOptions,
  updateConsentsStateFromLoadOptions,
  updateConsentsState,
  updateDataPlaneEventsStateFromLoadOptions,
  getSourceConfigURL,
};
