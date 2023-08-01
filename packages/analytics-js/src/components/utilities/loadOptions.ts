import { clone } from 'ramda';
import { defaultOptionalPluginsList } from '@rudderstack/analytics-js/components/pluginsManager/defaultPluginsList';
import {
  isObjectLiteralAndNotNull,
  mergeDeepRight,
  removeUndefinedAndNullValues,
} from '@rudderstack/analytics-js-common/utilities/object';
import { APP_VERSION, MODULE_TYPE } from '@rudderstack/analytics-js/constants/app';
import { BUILD_TYPE, DEFAULT_CONFIG_BE_URL } from '@rudderstack/analytics-js/constants/urls';
import { CookieSameSite, LoadOptions } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { StorageOpts } from '@rudderstack/analytics-js-common/types/Storage';
import { isDefined, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS } from '@rudderstack/analytics-js/constants/timeouts';
import { isNumber } from './number';

const normalizeLoadOptions = (
  loadOptionsFromState: LoadOptions,
  loadOptions: Partial<LoadOptions>,
): LoadOptions => {
  // TODO: add all the validations as per
  //  https://github.com/rudderlabs/rudder-sdk-js/blob/a620e11f98e1438be34114ad40b325201b1d7a6e/src/core/analytics.js#L1156
  // TODO: Maybe add warnings for invalid values
  const normalizedLoadOpts = clone(loadOptions);

  normalizedLoadOpts.setCookieDomain =
    isDefined(normalizedLoadOpts.setCookieDomain) && isString(normalizedLoadOpts.setCookieDomain)
      ? normalizedLoadOpts.setCookieDomain
      : undefined;

  normalizedLoadOpts.secureCookie = normalizedLoadOpts.secureCookie === true;

  normalizedLoadOpts.sameSiteCookie =
    isDefined(normalizedLoadOpts.sameSiteCookie) &&
    Object.values(CookieSameSite).includes(normalizedLoadOpts.sameSiteCookie as CookieSameSite)
      ? normalizedLoadOpts.sameSiteCookie
      : undefined;

  normalizedLoadOpts.plugins = normalizedLoadOpts.plugins ?? defaultOptionalPluginsList;

  normalizedLoadOpts.useGlobalIntegrationsConfigInEvents =
    normalizedLoadOpts.useGlobalIntegrationsConfigInEvents === true;

  normalizedLoadOpts.bufferDataPlaneEventsUntilReady =
    normalizedLoadOpts.bufferDataPlaneEventsUntilReady === true;

  normalizedLoadOpts.sendAdblockPage = normalizedLoadOpts.sendAdblockPage === true;

  normalizedLoadOpts.sendAdblockPageOptions = isObjectLiteralAndNotNull(
    normalizedLoadOpts.sendAdblockPageOptions,
  )
    ? normalizedLoadOpts.sendAdblockPageOptions
    : {};

  normalizedLoadOpts.storage = isObjectLiteralAndNotNull(normalizedLoadOpts.storage)
    ? removeUndefinedAndNullValues(normalizedLoadOpts.storage)
    : {};
  (normalizedLoadOpts.storage as StorageOpts).migrate =
    normalizedLoadOpts.storage?.migrate === true;

  normalizedLoadOpts.beaconQueueOptions = isObjectLiteralAndNotNull(
    normalizedLoadOpts.beaconQueueOptions,
  )
    ? removeUndefinedAndNullValues(normalizedLoadOpts.beaconQueueOptions)
    : {};

  normalizedLoadOpts.destinationsQueueOptions = isObjectLiteralAndNotNull(
    normalizedLoadOpts.destinationsQueueOptions,
  )
    ? removeUndefinedAndNullValues(normalizedLoadOpts.destinationsQueueOptions)
    : {};

  normalizedLoadOpts.queueOptions = isObjectLiteralAndNotNull(normalizedLoadOpts.queueOptions)
    ? removeUndefinedAndNullValues(normalizedLoadOpts.queueOptions)
    : {};

  normalizedLoadOpts.lockIntegrationsVersion = normalizedLoadOpts.lockIntegrationsVersion === true;

  normalizedLoadOpts.dataPlaneEventsBufferTimeout = isNumber(
    normalizedLoadOpts.dataPlaneEventsBufferTimeout,
  )
    ? normalizedLoadOpts.dataPlaneEventsBufferTimeout
    : DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS;

  const mergedLoadOptions: LoadOptions = mergeDeepRight(loadOptionsFromState, normalizedLoadOpts);

  return mergedLoadOptions;
};

const getSourceConfigURL = (configUrlHost = DEFAULT_CONFIG_BE_URL): string =>
  `${configUrlHost}/sourceConfig/?p=${MODULE_TYPE}&v=${APP_VERSION}&build=${BUILD_TYPE}`;

export { normalizeLoadOptions, getSourceConfigURL };
