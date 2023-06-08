import { clone } from 'ramda';
import { LoadOptions } from '@rudderstack/analytics-js/state/types';
import { defaultOptionalPluginsList } from '@rudderstack/analytics-js/components/pluginsManager/defaultPluginsList';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { APP_VERSION, MODULE_TYPE } from '@rudderstack/analytics-js/constants/app';
import { BUILD_TYPE } from '@rudderstack/analytics-js/constants/urls';

const normalizeLoadOptions = (
  loadOptionsFromState: LoadOptions,
  loadOptions: Partial<LoadOptions>,
): LoadOptions => {
  const normalizedLoadOptions = clone(loadOptions);
  normalizedLoadOptions.plugins = normalizedLoadOptions.plugins ?? defaultOptionalPluginsList;

  normalizedLoadOptions.useGlobalIntegrationsConfigInEvents =
    normalizedLoadOptions.useGlobalIntegrationsConfigInEvents === true;

  const mergedLoadOptions: LoadOptions = mergeDeepRight(
    loadOptionsFromState,
    normalizedLoadOptions,
  );

  return mergedLoadOptions;
};

const getSourceConfigURL = (configUrlHost = 'https://api.rudderstack.com') =>
  `${configUrlHost}/sourceConfig/?p=${MODULE_TYPE}&v=${APP_VERSION}&build=${BUILD_TYPE}`;

export { normalizeLoadOptions, getSourceConfigURL };
