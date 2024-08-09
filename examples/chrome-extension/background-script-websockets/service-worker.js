// This is the service worker script, which executes in its own context
// when the extension is installed or refreshed (or when you access its console).
// It would correspond to the background script in chrome extensions v2.

console.log('This prints to the console of the service worker (background script)');

// Importing and using functionality from external files is also possible.
import { Analytics } from './rudderAnalytics.js';

console.log(Analytics);

let socket = new WebSocket('ws://localhost:8080');
socket.onopen = function (e) {
  console.log('[open] Connection established');
  console.log('Sending to server');
};

socket.onmessage = function (event) {
  console.log(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function (event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Connection died');
  }
};

socket.onerror = function (error) {
  console.log(`[error]`);
};

const rudderClient = new Analytics('<writeKey>', '<dataPlaneURL>/v1/batch', {
  logLevel: 'silly',
  flashAt: 1,
  flushOverride: function (message) {
    socket.send(JSON.stringify(message));
  },
});

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
