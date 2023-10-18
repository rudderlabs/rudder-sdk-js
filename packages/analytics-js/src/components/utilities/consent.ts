import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import {
  ConsentManagementOptions,
  Consents,
  CookieConsentOptions,
} from '@rudderstack/analytics-js-common/types/Consent';
import {
  ConsentOptions,
  PostConsentOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import {
  isNonEmptyObject,
  isObjectLiteralAndNotNull,
} from '@rudderstack/analytics-js-common/utilities/object';
import { UNSUPPORTED_CONSENT_MANAGER_ERROR } from '@rudderstack/analytics-js/constants/logMessages';
import { clone } from 'ramda';
import { ConsentManagersToPluginNameMap } from '../configManager/constants';

/**
 * A function to get the name of the consent manager with enabled true set in the load options
 * @param cookieConsentOptions Input provided as load option
 * @returns string|undefined
 *
 * Example input: {
 *   oneTrust:{
 *     enabled: true
 *   }
 * }
 *
 * Output: 'oneTrust'
 */
const getUserSelectedConsentManager = (
  cookieConsentOptions?: CookieConsentOptions,
): string | undefined => {
  if (!isNonEmptyObject(cookieConsentOptions)) {
    return undefined;
  }

  const validCookieConsentOptions = cookieConsentOptions as CookieConsentOptions;
  return Object.keys(validCookieConsentOptions).find(
    e => e && validCookieConsentOptions[e].enabled === true,
  );
};

const getValidPostConsentOptions = (options?: ConsentOptions) => {
  const validOptions: PostConsentOptions = {
    sendPageEvent: false,
    trackConsent: false,
    discardPreConsentEvents: false,
  };
  if (isObjectLiteralAndNotNull(options)) {
    const clonedOptions = clone(options);

    validOptions.storage = clonedOptions.storage;
    validOptions.integrations = clonedOptions.integrations;
    validOptions.discardPreConsentEvents = clonedOptions.discardPreConsentEvents === true;
    validOptions.sendPageEvent = clonedOptions.sendPageEvent === true;
    validOptions.trackConsent = clonedOptions.trackConsent === true;
    validOptions.consentManagement = clonedOptions.consentManagement;
  }
  return validOptions;
};

const isValidConsentsData = (value: Consents | undefined): value is Consents =>
  isNonEmptyObject(value) || Array.isArray(value);

const getConsentManagerPluginName = (consentProvider: string, logger?: ILogger) => {
  const consentManagerPluginName = ConsentManagersToPluginNameMap[consentProvider];
  if (!consentManagerPluginName) {
    logger?.error(
      UNSUPPORTED_CONSENT_MANAGER_ERROR(
        CONFIG_MANAGER,
        consentProvider,
        ConsentManagersToPluginNameMap,
      ),
    );
  }
  return consentManagerPluginName;
};

const getConsentManagementData = (
  consentManagementOpts: ConsentManagementOptions | undefined,
  logger?: ILogger,
) => {
  let consentManagerPluginName: PluginName | undefined;
  let allowedConsentIds: Consents | undefined;
  let deniedConsentIds: Consents | undefined;
  let initialized = false;

  let enabled = consentManagementOpts?.enabled === true;
  if (isNonEmptyObject<ConsentManagementOptions>(consentManagementOpts) && enabled) {
    const consentProvider = consentManagementOpts.provider;
    if (consentProvider === 'custom') {
      initialized = true;

      allowedConsentIds = isValidConsentsData(consentManagementOpts.allowedConsentIds)
        ? consentManagementOpts.allowedConsentIds
        : [];
      deniedConsentIds = isValidConsentsData(consentManagementOpts.deniedConsentIds)
        ? consentManagementOpts.deniedConsentIds
        : [];
    } else if (consentProvider) {
      // Get the corresponding plugin name of the selected consent manager from the supported consent managers
      consentManagerPluginName = getConsentManagerPluginName(consentProvider, logger);
    }
  }

  const consentsData = {
    allowedConsentIds: allowedConsentIds ?? [],
    deniedConsentIds: deniedConsentIds ?? [],
  };

  // Enabled consent management only if consent manager plugin name is available
  enabled = enabled && Boolean(consentManagerPluginName);

  return {
    consentManagerPluginName,
    initialized,
    enabled,
    consentsData,
  };
};

export { getUserSelectedConsentManager, getValidPostConsentOptions, getConsentManagementData };
