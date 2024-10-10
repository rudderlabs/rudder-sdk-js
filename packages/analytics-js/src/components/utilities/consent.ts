import { CONFIG_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import type {
  ConsentManagementOptions,
  ConsentManagementProvider,
  Consents,
  CookieConsentOptions,
} from '@rudderstack/analytics-js-common/types/Consent';
import type { ConsentOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import {
  isNonEmptyObject,
  isObjectLiteralAndNotNull,
  mergeDeepRight,
} from '@rudderstack/analytics-js-common/utilities/object';
import { clone } from 'ramda';
import { state } from '../../state';
import { UNSUPPORTED_CONSENT_MANAGER_ERROR } from '../../constants/logMessages';
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
    e =>
      e && validCookieConsentOptions[e] && (validCookieConsentOptions[e] as any).enabled === true,
  );
};

/**
 * Validates and normalizes the consent options provided by the user
 * @param options Consent options provided by the user
 * @returns Validated and normalized consent options
 */
const getValidPostConsentOptions = (options?: ConsentOptions) => {
  const validOptions: ConsentOptions = {
    sendPageEvent: false,
    trackConsent: false,
    discardPreConsentEvents: false,
  };
  if (isObjectLiteralAndNotNull(options)) {
    const clonedOptions = clone(options);

    validOptions.storage = clonedOptions.storage;
    if (isNonEmptyObject(clonedOptions.integrations)) {
      validOptions.integrations = clonedOptions.integrations;
    }
    validOptions.discardPreConsentEvents = clonedOptions.discardPreConsentEvents === true;
    validOptions.sendPageEvent = clonedOptions.sendPageEvent === true;
    validOptions.trackConsent = clonedOptions.trackConsent === true;
    if (isNonEmptyObject(clonedOptions.consentManagement)) {
      // Override enabled value with the current state value
      validOptions.consentManagement = mergeDeepRight(clonedOptions.consentManagement, {
        enabled: state.consents.enabled.value,
      });
    }
  }
  return validOptions;
};

/**
 * Validates if the input is a valid consents data
 * @param value Input consents data
 * @returns true if the input is a valid consents data else false
 */
const isValidConsentsData = (value: Consents | undefined): value is Consents =>
  isNonEmptyObject(value) || Array.isArray(value);

/**
 * Retrieves the corresponding provider and plugin name of the selected consent manager from the supported consent managers
 * @param consentManagementOpts consent management options
 * @param logger logger instance
 * @returns Corresponding provider and plugin name of the selected consent manager from the supported consent managers
 */
const getConsentManagerInfo = (
  consentManagementOpts: ConsentManagementOptions,
  logger?: ILogger,
) => {
  let { provider }: { provider?: ConsentManagementProvider } = consentManagementOpts;
  const consentManagerPluginName = provider ? ConsentManagersToPluginNameMap[provider] : undefined;
  if (provider && !consentManagerPluginName) {
    logger?.error(
      UNSUPPORTED_CONSENT_MANAGER_ERROR(CONFIG_MANAGER, provider, ConsentManagersToPluginNameMap),
    );

    // Reset the provider value
    provider = undefined;
  }
  return { provider, consentManagerPluginName };
};

/**
 * Validates and converts the consent management options into a normalized format
 * @param consentManagementOpts Consent management options provided by the user
 * @param logger logger instance
 * @returns An object containing the consent manager plugin name, initialized, enabled and consents data
 */
const getConsentManagementData = (
  consentManagementOpts: ConsentManagementOptions | undefined,
  logger?: ILogger,
) => {
  let consentManagerPluginName: PluginName | undefined;
  let allowedConsentIds: Consents = [];
  let deniedConsentIds: Consents = [];
  let initialized = false;
  let provider: ConsentManagementProvider | undefined;

  let enabled = consentManagementOpts?.enabled === true;
  if (isNonEmptyObject<ConsentManagementOptions>(consentManagementOpts) && enabled) {
    // Get the corresponding plugin name of the selected consent manager from the supported consent managers
    ({ provider, consentManagerPluginName } = getConsentManagerInfo(consentManagementOpts, logger));

    if (isValidConsentsData(consentManagementOpts.allowedConsentIds)) {
      allowedConsentIds = consentManagementOpts.allowedConsentIds;
      initialized = true;
    }

    if (isValidConsentsData(consentManagementOpts.deniedConsentIds)) {
      deniedConsentIds = consentManagementOpts.deniedConsentIds;
      initialized = true;
    }
  }

  const consentsData = {
    allowedConsentIds,
    deniedConsentIds,
  };

  // Enable consent management only if consent manager is supported
  enabled = enabled && Boolean(consentManagerPluginName);

  return {
    provider,
    consentManagerPluginName,
    initialized,
    enabled,
    consentsData,
  };
};

export { getUserSelectedConsentManager, getValidPostConsentOptions, getConsentManagementData };
