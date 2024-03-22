import type {
  IRudderStackGlobals,
  RudderAnalytics,
  PreloadedEventCall,
  RudderAnalyticsPreloader,
} from '@rudderstack/analytics-js';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics | RudderAnalyticsPreloader | undefined;
    RudderStackGlobals: IRudderStackGlobals;
    rudderAnalyticsMount: () => void;
    rudderAnalyticsBuildType: 'legacy' | 'modern';
    RudderSnippetVersion?: string;
  }
}
