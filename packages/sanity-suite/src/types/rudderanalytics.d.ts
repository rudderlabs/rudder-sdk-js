import type {
  RudderAnalytics,
  PreloadedEventCall,
  RudderAnalyticsPreloader,
} from '@rudderstack/analytics-js';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics | RudderAnalyticsPreloader | undefined;
  }
}
