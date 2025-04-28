import type { RudderAnalytics, RudderAnalyticsPreloader } from '@rudderstack/analytics-js';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics | RudderAnalyticsPreloader | undefined;
  }
}
