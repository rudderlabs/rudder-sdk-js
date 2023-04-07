import { IRudderAnalytics } from '@rudderstack/analytics-js/components/core/IRudderAnalytics';
import { Nullable } from '@rudderstack/analytics-js/types';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import {
  QUERY_PARAM_ANONYMOUS_ID_KEY,
  QUERY_PARAM_PROPERTY_PREFIX,
  QUERY_PARAM_TRACK_EVENT_NAME_KEY,
  QUERY_PARAM_TRAIT_PREFIX,
  QUERY_PARAM_USER_ID_KEY,
} from '@rudderstack/analytics-js/constants/queryParams';

/**
 * Parse query string params into object values for keys that start with a defined prefix
 */
const getEventDataFromQueryString = (
  params: URLSearchParams,
  dataTypeNamePrefix: string,
): Record<string, Nullable<string>> => {
  const data: Record<string, Nullable<string>> = {};

  params.forEach((value, key) => {
    if (key.startsWith(dataTypeNamePrefix)) {
      // remove prefix from key name
      const dataKey = key.substring(dataTypeNamePrefix.length);
      // add new key value pair in generated object
      data[dataKey] = params.get(key);
    }
  });

  return data;
};

/**
 * Parse query string into preload buffer events & push into existing array before any other events
 */
const retrieveEventsFromQueryString = (argumentsArray: PreloadedEventCall[] = []) => {
  // Mapping for trait and properties values based on key prefix
  const eventArgumentToQueryParamMap = {
    trait: QUERY_PARAM_TRAIT_PREFIX,
    properties: QUERY_PARAM_PROPERTY_PREFIX,
  };

  const queryObject = new URLSearchParams(window.location.search);

  // Add track events with name and properties
  if (queryObject.get(QUERY_PARAM_TRACK_EVENT_NAME_KEY)) {
    argumentsArray.unshift([
      'track',
      queryObject.get(QUERY_PARAM_TRACK_EVENT_NAME_KEY),
      getEventDataFromQueryString(queryObject, eventArgumentToQueryParamMap.properties),
    ]);
  }

  // Set userId and user traits
  if (queryObject.get(QUERY_PARAM_USER_ID_KEY)) {
    argumentsArray.unshift([
      'identify',
      queryObject.get(QUERY_PARAM_USER_ID_KEY),
      getEventDataFromQueryString(queryObject, eventArgumentToQueryParamMap.trait),
    ]);
  }

  // Set anonymousID
  if (queryObject.get(QUERY_PARAM_ANONYMOUS_ID_KEY)) {
    argumentsArray.unshift(['setAnonymousId', queryObject.get(QUERY_PARAM_ANONYMOUS_ID_KEY)]);
  }
};

/**
 * Retrieve an existing buffered load method call and remove from the existing array
 */
const getPreloadedLoadEvent = (preloadedEventsArray: PreloadedEventCall[]): PreloadedEventCall => {
  const loadMethodName = 'load';
  let loadEvent: PreloadedEventCall = [];

  /**
   * Iterate the buffered API calls until we find load call and process it separately
   */
  let i = 0;
  while (i < preloadedEventsArray.length) {
    if (preloadedEventsArray[i] && preloadedEventsArray[i][0] === loadMethodName) {
      loadEvent = preloadedEventsArray[i];
      preloadedEventsArray.splice(i, 1);
      break;
    }
    i += 1;
  }

  return loadEvent;
};

/**
 * Retrieve any existing events that were triggered before SDK load and enqueue in buffer
 */
const retrievePreloadBufferEvents = (instance: IRudderAnalytics) => {
  const preloadedEventsArray: PreloadedEventCall[] = Array.isArray((window as any).rudderanalytics)
    ? (window as any).rudderanalytics
    : [];

  // Get any load method call that is buffered if any
  const loadEvent: PreloadedEventCall = getPreloadedLoadEvent(preloadedEventsArray);

  // Get events that are prepopulated via query string params
  retrieveEventsFromQueryString(preloadedEventsArray);

  // Enqueue the events in the buffer of the global rudder analytics singleton
  if (preloadedEventsArray.length > 0) {
    instance.enqueuePreloadBufferEvents(preloadedEventsArray);
  }

  // Process load method if present in the buffered requests
  if (loadEvent.length > 0) {
    const loadMethodName = loadEvent.shift();
    if (isFunction((instance as any)[loadMethodName])) {
      (instance as any)[loadMethodName](...loadEvent);
    }
  }
};

export {
  getEventDataFromQueryString,
  retrieveEventsFromQueryString,
  getPreloadedLoadEvent,
  retrievePreloadBufferEvents,
};
