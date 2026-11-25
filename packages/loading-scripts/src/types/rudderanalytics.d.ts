import type { RudderAnalytics, RudderAnalyticsPreloader } from '@rudderstack/analytics-js';

declare global {
  /** Replaced with a boolean literal at build time. See src/index.ts. */
  const __IS_GTM_BUILD__: boolean;
  const __IS_PINNED_BUILD__: boolean;
  const __SDK_VERSION__: string;
  const __SDK_MODERN_INTEGRITY__: string;
  const __SDK_LEGACY_INTEGRITY__: string;

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
