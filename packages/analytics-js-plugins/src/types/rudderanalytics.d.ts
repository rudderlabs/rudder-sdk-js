import type { RudderAnalytics, IRudderStackGlobals } from '@rudderstack/common';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics;
    RudderStackGlobals: IRudderStackGlobals;
    rudderAnalyticsMount: () => void;
    rudderAnalyticsBuildType: 'legacy' | 'modern';
  }
}
