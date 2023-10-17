import type {
  IRudderStackGlobals,
  RudderAnalytics,
  PreloadedEventCall,
  RudderAnalyticsPreloader,
} from '../index';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics | PreloadedEventCall[] | RudderAnalyticsPreloader;
    RudderStackGlobals: IRudderStackGlobals;
    rudderAnalyticsMount: () => void;
    rudderAnalyticsBuildType: 'legacy' | 'modern';
  }
}
