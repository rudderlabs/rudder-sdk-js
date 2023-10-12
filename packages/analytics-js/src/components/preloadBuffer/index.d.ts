import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { PreloadedEventCall } from './types';
import { IAnalytics } from '../core/IAnalytics';
/**
 * Parse query string params into object values for keys that start with a defined prefix
 */
declare const getEventDataFromQueryString: (
  params: URLSearchParams,
  dataTypeNamePrefix: string,
) => Record<string, Nullable<string>>;
/**
 * Parse query string into preload buffer events & push into existing array before any other events
 */
declare const retrieveEventsFromQueryString: (argumentsArray?: PreloadedEventCall[]) => void;
/**
 * Retrieve an existing buffered load method call and remove from the existing array
 */
declare const getPreloadedLoadEvent: (
  preloadedEventsArray: PreloadedEventCall[],
) => PreloadedEventCall;
/**
 * Retrieve any existing events that were triggered before SDK load and enqueue in buffer
 */
declare const retrievePreloadBufferEvents: (instance: IAnalytics) => void;
declare const consumePreloadBufferedEvent: (event: any, analyticsInstance: IAnalytics) => void;
export {
  getEventDataFromQueryString,
  retrieveEventsFromQueryString,
  getPreloadedLoadEvent,
  retrievePreloadBufferEvents,
  consumePreloadBufferedEvent,
};
