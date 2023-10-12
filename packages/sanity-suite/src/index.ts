import { initSanitySuite } from './testBook';

(window.rudderanalytics as any).ready(() => {
  initSanitySuite();
});
