import type { RudderAnalytics, RudderAnalyticsPreloader } from '@rudderstack/analytics-js';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics | RudderAnalyticsPreloader | undefined;
    rudderAnalyticsMount: () => void;
    rudderAnalyticsBuildType: 'legacy' | 'modern';
    RudderSnippetVersion: string;
    rudderAnalyticsAddScript: (
      url: string,
      extraAttributeKey?: string,
      extraAttributeVal?: string,
    ) => void;
  }
}
