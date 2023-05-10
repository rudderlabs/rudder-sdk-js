import { clone } from 'ramda';
import { LoadOptions } from '@rudderstack/analytics-js/state/types';
import { defaultOptionalPluginsList } from '@rudderstack/analytics-js/components/pluginsManager/defaultPluginsList';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';

const normaliseLoadOptions = (
  loadOptionsFromState: LoadOptions,
  loadOptions: Partial<LoadOptions>,
): LoadOptions => {
  const normalisedLoadOptions = clone(loadOptions);
  normalisedLoadOptions.plugins = normalisedLoadOptions.plugins || defaultOptionalPluginsList;

  const mergedLoadOptions: LoadOptions = mergeDeepRight(
    loadOptionsFromState,
    normalisedLoadOptions,
  );

  return mergedLoadOptions;
};

export { normaliseLoadOptions };
