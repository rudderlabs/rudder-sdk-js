import { RudderAnalytics } from '@rudderstack/analytics-js';
import { initSanitySuite } from './testBook';

(window.rudderanalytics as RudderAnalytics).ready(() => {
  initSanitySuite();
});
