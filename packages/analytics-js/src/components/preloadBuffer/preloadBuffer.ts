import { IRudderAnalytics } from '@rudderstack/analytics-js/IRudderAnalytics';
import { Nullable } from '@rudderstack/analytics-js/types';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';

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

const retrievePreloadBufferEvents = (instance: IRudderAnalytics) => {
  let defaultEvent;
  const loadMethodName = 'load';
  const argumentsArray: PreloadedEventCall[] = Array.isArray((window as any).rudderanalytics)
    ? (window as any).rudderanalytics
    : [];

  /**
   * Iterate the buffered API calls until we find load call and
   * queue it first for processing
   */
  let i = 0;
  while (i < argumentsArray.length) {
    if (argumentsArray[i] && argumentsArray[i][0] === loadMethodName) {
      defaultEvent = argumentsArray[i];
      argumentsArray.splice(i, 1);
      break;
    }
    i += 1;
  }

  retrieveEventsFromQueryString(argumentsArray);
  instance.enqueuePreloadBufferEvents(argumentsArray);

  // Process load method if present in the buffered requests
  if (defaultEvent && defaultEvent.length > 0) {
    defaultEvent.shift();
    // @ts-ignore
    instance[loadMethodName](...defaultEvent);
  }
};

export { retrievePreloadBufferEvents };
