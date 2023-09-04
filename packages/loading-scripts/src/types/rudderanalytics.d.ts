import type { IRudderStackGlobals } from '@rudderstack/analytics-js';

declare global {
  interface Window {
    rudderanalytics: any | any[];
    RudderStackGlobals: IRudderStackGlobals;
    rudderAnalyticsMount: () => void;
    rudderAnalyticsBuildType: 'legacy' | 'modern';
  }
}
