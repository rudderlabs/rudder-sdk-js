// This file can be imported inside the service worker,
// which means all of its functions and variables will be accessible
// inside the service worker.
// The importation is done in the file `service-worker.js`.

console.log('External file is also loaded!');

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url) {
    chrome.tabs.sendMessage(tabId, {
      type: 'track',
      value: {
        url: tab.url,
      },
    });
  }
});
