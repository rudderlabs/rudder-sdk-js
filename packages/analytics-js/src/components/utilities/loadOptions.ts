import { clone } from 'ramda';
import { LoadOptions } from '@rudderstack/analytics-js/state/types';
import { defaultOptionalPluginsList } from '@rudderstack/analytics-js/components/pluginsManager/defaultPluginsList';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { APP_VERSION, MODULE_TYPE } from '@rudderstack/analytics-js/constants/app';
import { BUILD_TYPE, DEFAULT_CONFIG_BE_URL } from '@rudderstack/analytics-js/constants/urls';

const normalizeLoadOptions = (
  loadOptionsFromState: LoadOptions,
  loadOptions: Partial<LoadOptions>,
): LoadOptions => {
  // TODO: add all the validations as per
  //  https://github.com/rudderlabs/rudder-sdk-js/blob/a620e11f98e1438be34114ad40b325201b1d7a6e/src/core/analytics.js#L1156
  const normalizedLoadOptions = clone(loadOptions);
  normalizedLoadOptions.plugins = normalizedLoadOptions.plugins ?? defaultOptionalPluginsList;

  normalizedLoadOptions.useGlobalIntegrationsConfigInEvents =
    normalizedLoadOptions.useGlobalIntegrationsConfigInEvents === true;

  normalizedLoadOptions.bufferDataPlaneEventsUntilReady =
    normalizedLoadOptions.bufferDataPlaneEventsUntilReady === true;

  const mergedLoadOptions: LoadOptions = mergeDeepRight(
    loadOptionsFromState,
    normalizedLoadOptions,
  );

  return mergedLoadOptions;
};

const getSourceConfigURL = (configUrlHost = DEFAULT_CONFIG_BE_URL): string =>
  `${configUrlHost}/sourceConfig/?p=${MODULE_TYPE}&v=${APP_VERSION}&build=${BUILD_TYPE}`;

export { normalizeLoadOptions, getSourceConfigURL };
