import type { RudderAnalytics } from './app/RudderAnalytics';
import type {
  PreloadedEventCall,
  RudderAnalyticsPreloader,
} from './components/preloadBuffer/types';
import type { IRudderStackGlobals } from './app/IRudderStackGlobals';

export {
  type AnonymousIdOptions,
  type LoadOptions,
  type SessionOpts,
  type QueueOpts,
  type BeaconQueueOpts,
  type DestinationsQueueOpts,
  type UaChTrackLevel,
  type ConsentOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
export { type CookieSameSite } from '@rudderstack/analytics-js-common/types/Storage';
export { type ApiCallback, type ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
export { type ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
export { type IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
export { type ResidencyServerRegion } from '@rudderstack/analytics-js-common/types/DataResidency';
export { type LogLevel } from '@rudderstack/analytics-js-common/types/Logger';
export { type PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
export { type IdentifyTraits } from '@rudderstack/analytics-js-common/types/traits';
export { RudderAnalytics } from './app/RudderAnalytics';
export { type IRudderStackGlobals } from './app/IRudderStackGlobals';
export {
  type PreloadedEventCall,
  type RudderAnalyticsPreloader,
} from './components/preloadBuffer/types';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics | PreloadedEventCall[] | RudderAnalyticsPreloader;
    RudderStackGlobals: IRudderStackGlobals;
    rudderAnalyticsMount: () => void;
    rudderAnalyticsBuildType: 'legacy' | 'modern';
  }
}
