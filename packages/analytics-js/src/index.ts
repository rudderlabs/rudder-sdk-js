import type { RudderAnalytics } from './app/RudderAnalytics';
import type { RudderAnalyticsPreloader } from './components/preloadBuffer/types';

export {
  type AnonymousIdOptions,
  type LoadOptions,
  type SessionOpts,
  type QueueOpts,
  type BeaconQueueOpts,
  type DestinationsQueueOpts,
  type UaChTrackLevel,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
export { type CookieSameSite } from '@rudderstack/analytics-js-common/types/Storage';
export { type ApiCallback, type ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
export { type ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
export { type IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
export { type LogLevel } from '@rudderstack/analytics-js-common/types/Logger';
export { type PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
export { type IdentifyTraits } from '@rudderstack/analytics-js-common/types/traits';
export {
  type RudderAnalyticsPreloader,
  type PreloadedEventCall,
} from './components/preloadBuffer/types';
export { RudderAnalytics } from './app/RudderAnalytics';
export { type ConsentOptions } from '@rudderstack/analytics-js-common/types/Consent';
declare global {
  interface Window {
    rudderanalytics: RudderAnalytics | RudderAnalyticsPreloader | undefined;
  }
}
