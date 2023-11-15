import type {
  IRudderStackGlobals,
  RudderAnalytics,
  PreloadedEventCall,
  RudderAnalyticsPreloader,
} from '@rudderstack/analytics-js';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics | PreloadedEventCall[] | RudderAnalyticsPreloader;
    RudderStackGlobals: IRudderStackGlobals;
    rudderAnalyticsMount: () => void;
    rudderAnalyticsBuildType: 'legacy' | 'modern';
    RudderSnippetVersion?: string;
  }
}
