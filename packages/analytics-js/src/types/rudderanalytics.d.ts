import type { IRudderStackGlobals, RudderAnalytics, PreloadedEventCall } from '../index';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics | PreloadedEventCall[];
    RudderStackGlobals: IRudderStackGlobals;
    rudderAnalyticsMount: () => void;
    rudderAnalyticsBuildType: 'legacy' | 'modern';
  }
}
