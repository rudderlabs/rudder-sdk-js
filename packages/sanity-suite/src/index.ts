import { initSanitySuite } from './testBook';

(window as any).rudderanalytics.ready(() => {
  initSanitySuite();
});
