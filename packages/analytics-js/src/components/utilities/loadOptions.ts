/* eslint-disable sonarjs/deprecation */
import { clone } from 'ramda';
import {
  isNonEmptyObject,
  isObjectLiteralAndNotNull,
  mergeDeepRight,
  removeUndefinedAndNullValues,
} from '@rudderstack/analytics-js-common/utilities/object';
import type {
  LoadOptions,
  UaChTrackLevel,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { StorageOpts, CookieSameSite } from '@rudderstack/analytics-js-common/types/Storage';
import { isDefined, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { defaultOptionalPluginsList } from '../pluginsManager/defaultPluginsList';
import { isNumber } from './number';

const normalizeLoadOptions = (
  loadOptionsFromState: LoadOptions,
  loadOptions: Partial<LoadOptions>,
): LoadOptions => {
  // TODO: Maybe add warnings for invalid values
  const normalizedLoadOpts = clone(loadOptions);

  if (!isString(normalizedLoadOpts.setCookieDomain)) {
    delete normalizedLoadOpts.setCookieDomain;
  }

  const cookieSameSiteValues = ['Strict', 'Lax', 'None'];
  if (!cookieSameSiteValues.includes(normalizedLoadOpts.sameSiteCookie as CookieSameSite)) {
    delete normalizedLoadOpts.sameSiteCookie;
  }

  normalizedLoadOpts.secureCookie = normalizedLoadOpts.secureCookie === true;

  normalizedLoadOpts.sameDomainCookiesOnly = normalizedLoadOpts.sameDomainCookiesOnly === true;

  const uaChTrackLevels = ['none', 'default', 'full'];
  if (!uaChTrackLevels.includes(normalizedLoadOpts.uaChTrackLevel as UaChTrackLevel)) {
    delete normalizedLoadOpts.uaChTrackLevel;
  }

  if (!isNonEmptyObject(normalizedLoadOpts.integrations)) {
    delete normalizedLoadOpts.integrations;
  }

  normalizedLoadOpts.plugins = normalizedLoadOpts.plugins ?? defaultOptionalPluginsList;

  normalizedLoadOpts.useGlobalIntegrationsConfigInEvents =
    normalizedLoadOpts.useGlobalIntegrationsConfigInEvents === true;

  normalizedLoadOpts.bufferDataPlaneEventsUntilReady =
    normalizedLoadOpts.bufferDataPlaneEventsUntilReady === true;

  normalizedLoadOpts.sendAdblockPage = normalizedLoadOpts.sendAdblockPage === true;

  normalizedLoadOpts.useServerSideCookies = normalizedLoadOpts.useServerSideCookies === true;

  if (
    normalizedLoadOpts.dataServiceEndpoint &&
    typeof normalizedLoadOpts.dataServiceEndpoint !== 'string'
  ) {
    delete normalizedLoadOpts.dataServiceEndpoint;
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.sendAdblockPageOptions)) {
    delete normalizedLoadOpts.sendAdblockPageOptions;
  }

  if (!isDefined(normalizedLoadOpts.loadIntegration)) {
    delete normalizedLoadOpts.loadIntegration;
  } else {
    normalizedLoadOpts.loadIntegration = normalizedLoadOpts.loadIntegration === true;
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.storage)) {
    delete normalizedLoadOpts.storage;
  } else {
    normalizedLoadOpts.storage = removeUndefinedAndNullValues(normalizedLoadOpts.storage);
    (normalizedLoadOpts.storage as StorageOpts).migrate =
      normalizedLoadOpts.storage?.migrate === true;
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.beaconQueueOptions)) {
    delete normalizedLoadOpts.beaconQueueOptions;
  } else {
    normalizedLoadOpts.beaconQueueOptions = removeUndefinedAndNullValues(
      normalizedLoadOpts.beaconQueueOptions,
    );
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.destinationsQueueOptions)) {
    delete normalizedLoadOpts.destinationsQueueOptions;
  } else {
    normalizedLoadOpts.destinationsQueueOptions = removeUndefinedAndNullValues(
      normalizedLoadOpts.destinationsQueueOptions,
    );
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.queueOptions)) {
    delete normalizedLoadOpts.queueOptions;
  } else {
    normalizedLoadOpts.queueOptions = removeUndefinedAndNullValues(normalizedLoadOpts.queueOptions);
  }

  normalizedLoadOpts.lockIntegrationsVersion = normalizedLoadOpts.lockIntegrationsVersion !== false;

  normalizedLoadOpts.lockPluginsVersion = normalizedLoadOpts.lockPluginsVersion !== false;

  if (!isNumber(normalizedLoadOpts.dataPlaneEventsBufferTimeout)) {
    delete normalizedLoadOpts.dataPlaneEventsBufferTimeout;
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.storage?.cookie)) {
    delete normalizedLoadOpts.storage?.cookie;
  } else {
    (normalizedLoadOpts.storage as StorageOpts).cookie = removeUndefinedAndNullValues(
      normalizedLoadOpts.storage?.cookie,
    );
  }

  if (!isObjectLiteralAndNotNull(normalizedLoadOpts.preConsent)) {
    delete normalizedLoadOpts.preConsent;
  } else {
    normalizedLoadOpts.preConsent = removeUndefinedAndNullValues(normalizedLoadOpts.preConsent);
  }

  const mergedLoadOptions: LoadOptions = mergeDeepRight(loadOptionsFromState, normalizedLoadOpts);

  return mergedLoadOptions;
};

export { normalizeLoadOptions };
