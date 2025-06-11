/* eslint-disable sonarjs/deprecation */
import { clone } from 'ramda';
import {
  getNormalizedBooleanValue,
  getNormalizedObjectValue,
  isNonEmptyObject,
  mergeDeepRight,
  removeUndefinedAndNullValues,
} from '@rudderstack/analytics-js-common/utilities/object';
import type {
  LoadOptions,
  UaChTrackLevel,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { CookieSameSite } from '@rudderstack/analytics-js-common/types/Storage';
import { isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { defaultOptionalPluginsList } from '../pluginsManager/defaultPluginsList';
import { isNumber } from './number';

const normalizeLoadOptions = (
  loadOptionsFromState: LoadOptions,
  loadOptions: Partial<LoadOptions>,
): LoadOptions => {
  // TODO: Maybe add warnings for invalid values
  const normalizedLoadOpts = clone(loadOptions);

  if (!isString(normalizedLoadOpts.setCookieDomain)) {
    normalizedLoadOpts.setCookieDomain = undefined;
  }

  const cookieSameSiteValues = ['Strict', 'Lax', 'None'];
  if (!cookieSameSiteValues.includes(normalizedLoadOpts.sameSiteCookie as CookieSameSite)) {
    normalizedLoadOpts.sameSiteCookie = undefined;
  }

  normalizedLoadOpts.secureCookie = getNormalizedBooleanValue(
    normalizedLoadOpts.secureCookie,
    loadOptionsFromState.secureCookie!,
  );

  normalizedLoadOpts.sameDomainCookiesOnly = getNormalizedBooleanValue(
    normalizedLoadOpts.sameDomainCookiesOnly,
    loadOptionsFromState.sameDomainCookiesOnly!,
  );

  const uaChTrackLevels = ['none', 'default', 'full'];
  if (!uaChTrackLevels.includes(normalizedLoadOpts.uaChTrackLevel as UaChTrackLevel)) {
    normalizedLoadOpts.uaChTrackLevel = undefined;
  }

  normalizedLoadOpts.integrations = getNormalizedObjectValue(normalizedLoadOpts.integrations);

  if (!Array.isArray(normalizedLoadOpts.plugins)) {
    normalizedLoadOpts.plugins = defaultOptionalPluginsList;
  }

  normalizedLoadOpts.useGlobalIntegrationsConfigInEvents = getNormalizedBooleanValue(
    normalizedLoadOpts.useGlobalIntegrationsConfigInEvents,
    loadOptionsFromState.useGlobalIntegrationsConfigInEvents!,
  );

  normalizedLoadOpts.bufferDataPlaneEventsUntilReady = getNormalizedBooleanValue(
    normalizedLoadOpts.bufferDataPlaneEventsUntilReady,
    loadOptionsFromState.bufferDataPlaneEventsUntilReady!,
  );

  normalizedLoadOpts.sendAdblockPage = getNormalizedBooleanValue(
    normalizedLoadOpts.sendAdblockPage,
    loadOptionsFromState.sendAdblockPage!,
  );

  normalizedLoadOpts.useServerSideCookies = getNormalizedBooleanValue(
    normalizedLoadOpts.useServerSideCookies,
    loadOptionsFromState.useServerSideCookies!,
  );

  if (!isString(normalizedLoadOpts.dataServiceEndpoint)) {
    normalizedLoadOpts.dataServiceEndpoint = undefined;
  }

  normalizedLoadOpts.sendAdblockPageOptions = getNormalizedObjectValue(
    normalizedLoadOpts.sendAdblockPageOptions,
  );

  normalizedLoadOpts.loadIntegration = getNormalizedBooleanValue(
    normalizedLoadOpts.loadIntegration,
    loadOptionsFromState.loadIntegration!,
  );

  if (!isNonEmptyObject(normalizedLoadOpts.storage)) {
    normalizedLoadOpts.storage = undefined;
  } else {
    normalizedLoadOpts.storage.migrate = getNormalizedBooleanValue(
      normalizedLoadOpts.storage.migrate,
      loadOptionsFromState.storage?.migrate!,
    );

    normalizedLoadOpts.storage.cookie = getNormalizedObjectValue(normalizedLoadOpts.storage.cookie);
    normalizedLoadOpts.storage.encryption = getNormalizedObjectValue(
      normalizedLoadOpts.storage.encryption,
    );
    normalizedLoadOpts.storage = removeUndefinedAndNullValues(normalizedLoadOpts.storage);
  }

  normalizedLoadOpts.destinationsQueueOptions = getNormalizedObjectValue(
    normalizedLoadOpts.destinationsQueueOptions,
  );

  normalizedLoadOpts.queueOptions = getNormalizedObjectValue(normalizedLoadOpts.queueOptions);

  normalizedLoadOpts.lockIntegrationsVersion = getNormalizedBooleanValue(
    normalizedLoadOpts.lockIntegrationsVersion,
    loadOptionsFromState.lockIntegrationsVersion!,
  );

  normalizedLoadOpts.lockPluginsVersion = getNormalizedBooleanValue(
    normalizedLoadOpts.lockPluginsVersion,
    loadOptionsFromState.lockPluginsVersion!,
  );

  if (!isNumber(normalizedLoadOpts.dataPlaneEventsBufferTimeout)) {
    normalizedLoadOpts.dataPlaneEventsBufferTimeout = undefined;
  }

  normalizedLoadOpts.beaconQueueOptions = getNormalizedObjectValue(
    normalizedLoadOpts.beaconQueueOptions,
  );

  normalizedLoadOpts.preConsent = getNormalizedObjectValue(normalizedLoadOpts.preConsent);

  normalizedLoadOpts.sourceConfigurationOverride = getNormalizedObjectValue(
    normalizedLoadOpts.sourceConfigurationOverride,
  );

  const mergedLoadOptions: LoadOptions = mergeDeepRight(
    loadOptionsFromState,
    removeUndefinedAndNullValues(normalizedLoadOpts),
  );

  return mergedLoadOptions;
};

export { normalizeLoadOptions };
