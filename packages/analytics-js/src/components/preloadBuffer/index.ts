import { IRudderAnalytics } from '@rudderstack/analytics-js/components/core/IRudderAnalytics';
import { Nullable } from '@rudderstack/analytics-js/types';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';

const getEventDataFromQueryString = (
  params: URLSearchParams,
  dataType: string,
): Record<string, Nullable<string>> => {
  const data: Record<string, Nullable<string>> = {};

  params.forEach((value, key) => {
    if (key.startsWith(dataType)) {
      const dataKey = key.substr(dataType.length);
      data[dataKey] = params.get(key);
    }
  });

  return data;
};

/**
 * parse the given query string into a preload buffer event
 */
const retrieveEventsFromQueryString = (argumentsArray: PreloadedEventCall[] = []) => {
  const eventArgumentToQueryParamMap = {
    trait: 'ajs_trait_',
    properties: 'ajs_prop_',
  };

  const queryObject = new URLSearchParams(document.location.search);

  if (queryObject.get('ajs_aid')) {
    argumentsArray.push(['setAnonymousId', queryObject.get('ajs_aid')]);
  }

  if (queryObject.get('ajs_uid')) {
    argumentsArray.push([
      'identify',
      queryObject.get('ajs_uid'),
      getEventDataFromQueryString(queryObject, eventArgumentToQueryParamMap.trait),
    ]);
  }

  if (queryObject.get('ajs_event')) {
    argumentsArray.push([
      'track',
      queryObject.get('ajs_event'),
      getEventDataFromQueryString(queryObject, eventArgumentToQueryParamMap.properties),
    ]);
  }
};

const getPreloadedLoadEvent = (preloadedEventsArray: PreloadedEventCall[]): PreloadedEventCall => {
  const loadMethodName = 'load';
  let loadEvent: PreloadedEventCall = [];

  /**
   * Iterate the buffered API calls until we find load call and
   * queue it first for processing
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

const retrievePreloadBufferEvents = (instance: IRudderAnalytics) => {
  const preloadedEventsArray: PreloadedEventCall[] = Array.isArray((window as any).rudderanalytics)
    ? (window as any).rudderanalytics
    : [];

  const loadEvent: PreloadedEventCall = getPreloadedLoadEvent(preloadedEventsArray);

  retrieveEventsFromQueryString(preloadedEventsArray);
  instance.enqueuePreloadBufferEvents(preloadedEventsArray);

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
