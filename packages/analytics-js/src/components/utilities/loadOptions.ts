import { clone } from 'ramda';
import { LoadOptions } from '@rudderstack/analytics-js/state/types';
import { defaultOptionalPluginsList } from '@rudderstack/analytics-js/components/pluginsManager/defaultPluginsList';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { APP_VERSION, BUILD_TYPE, MODULE_TYPE } from '@rudderstack/analytics-js/constants/app';

const normaliseLoadOptions = (
  loadOptionsFromState: LoadOptions,
  loadOptions: Partial<LoadOptions>,
): LoadOptions => {
  const normalisedLoadOptions = clone(loadOptions);
  normalisedLoadOptions.plugins = normalisedLoadOptions.plugins ?? defaultOptionalPluginsList;

  const mergedLoadOptions: LoadOptions = mergeDeepRight(
    loadOptionsFromState,
    normalisedLoadOptions,
  );

  return mergedLoadOptions;
};

const getSourceConfigURL = (configUrlHost = 'https://api.rudderstack.com') =>
  `${configUrlHost}/sourceConfig/?p=${MODULE_TYPE}&v=${APP_VERSION}&build=${BUILD_TYPE}`;

export { normaliseLoadOptions, getSourceConfigURL };
