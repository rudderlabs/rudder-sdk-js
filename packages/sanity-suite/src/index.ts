import { initSanitySuite } from './testBook';

(window.rudderanalytics as any).ready(() => {
  console.log('We are all set!!!');
  initSanitySuite();
});
