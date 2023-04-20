import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';
import { state } from '@rudderstack/analytics-js/state';
import { RudderEvent } from './types';
import { isObject } from '../utilities/object';
import { defaultPluginManager } from '../pluginsManager';

/**
 * Add any missing default page properties using values from options and defaults
 * @param properties Input page properties
 * @param options API options
 */
export const getUpdatedPageProperties = (
  properties: ApiObject,
  options?: Nullable<ApiOptions>,
): ApiObject => {
  if (!options?.page || !isObject(options.page)) {
    return properties;
  }

  const optionsPageProps = options.page as ApiObject;
  const pageProps = properties;

  Object.keys(state.page).forEach((key: string) => {
    if (pageProps[key] === undefined) {
      pageProps[key] = optionsPageProps[key] || state.page[key].value;
    }
  });
  return pageProps;
};

/**
 * Enriches the rudder event with the common properties
 * @param rudderEvent Generated rudder event
 * @param pageProps Page properties
 * @returns Enriched rudder event
 */
export const getEnrichedEvent = (
  rudderEvent: Partial<RudderEvent>,
  options?: Nullable<ApiOptions>,
  pageProps?: ApiObject,
): RudderEvent => {
  const eventProcessorResults = defaultPluginManager.invoke(
    'event.process',
    rudderEvent,
    options,
    pageProps,
  );
  if (eventProcessorResults.length > 0) {
    return eventProcessorResults[0] as RudderEvent;
  }
  return rudderEvent as RudderEvent;
};
