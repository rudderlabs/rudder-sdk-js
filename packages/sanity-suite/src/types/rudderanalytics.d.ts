import type { RudderAnalytics, IRudderStackGlobals } from '@rudderstack/analytics-js';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics;
    RudderStackGlobals: IRudderStackGlobals;
  }
}
