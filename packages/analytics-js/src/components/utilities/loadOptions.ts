import { clone } from 'ramda';
import { LoadOptions, StorageOpts } from '@rudderstack/analytics-js/state/types';
import { defaultOptionalPluginsList } from '@rudderstack/analytics-js/components/pluginsManager/defaultPluginsList';
import {
  isObjectLiteralAndNotNull,
  mergeDeepRight,
  removeUndefinedAndNullValues,
} from '@rudderstack/analytics-js/components/utilities/object';
import { APP_VERSION, MODULE_TYPE } from '@rudderstack/analytics-js/constants/app';
import { BUILD_TYPE, DEFAULT_CONFIG_BE_URL } from '@rudderstack/analytics-js/constants/urls';

const normalizeLoadOptions = (
  loadOptionsFromState: LoadOptions,
  loadOptions: Partial<LoadOptions>,
): LoadOptions => {
  // TODO: add all the validations as per
  //  https://github.com/rudderlabs/rudder-sdk-js/blob/a620e11f98e1438be34114ad40b325201b1d7a6e/src/core/analytics.js#L1156
  const normalizedLoadOpts = clone(loadOptions);
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

  const mergedLoadOptions: LoadOptions = mergeDeepRight(loadOptionsFromState, normalizedLoadOpts);

  return mergedLoadOptions;
};

const getSourceConfigURL = (configUrlHost = DEFAULT_CONFIG_BE_URL): string =>
  `${configUrlHost}/sourceConfig/?p=${MODULE_TYPE}&v=${APP_VERSION}&build=${BUILD_TYPE}`;

export { normalizeLoadOptions, getSourceConfigURL };
