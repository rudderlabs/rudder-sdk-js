import type {
  IRudderStackGlobals,
  RudderAnalytics,
  PreloadedEventCall,
} from '@rudderstack/analytics-js';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics | PreloadedEventCall[];
    RudderStackGlobals: IRudderStackGlobals;
    rudderAnalyticsMount: () => void;
    rudderAnalyticsBuildType: 'legacy' | 'modern';
  }
}
