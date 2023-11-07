// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log('This prints to the console of the service worker (background script)');

// Importing and using functionality from external files is also possible.
import { Analytics } from './rudderAnalytics.js';

console.log(Analytics);

const rudderClient = new Analytics(
  '2L8Fl7ryPss3Zku133Pj5ox7NeP',
  'https://rudderstacpn.dataplane.rudderstack.com/v1/batch',
  {
    logLevel: 'silly',
  },
);

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url) {
    rudderClient.track({
      userId: '123456',
      event: 'Event Name',
      properties: {
        data: {
          url: tab.url,
        },
      },
    });
  }
});
