import type { RudderAnalytics, RudderAnalyticsPreloader } from '@rudderstack/analytics-js';

declare global {
  /** Replaced with a boolean literal at build time. See src/index.ts. */
  const __IS_GTM_BUILD__: boolean;

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
