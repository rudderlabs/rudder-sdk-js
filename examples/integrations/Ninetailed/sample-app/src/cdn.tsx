import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './ninetailed';

const writeKey = import.meta.env.VITE_RUDDERSTACK_WRITE_KEY;
const dataplaneUrl = import.meta.env.VITE_RUDDERSTACK_DATAPLANE_URL;
const configUrl = import.meta.env.VITE_RUDDERSTACK_CONFIG_URL;

if (!writeKey || !dataplaneUrl) {
  console.error('RudderStack configuration is missing. Run ./scripts/setup-examples-env.sh from the repository root.');
} else {
  // The snippet in cdn.html queues calls until the SDK script loads from the CDN
  window.rudderanalytics?.load(writeKey, dataplaneUrl, configUrl ? { configUrl } : {});
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App useAnalytics={() => window.rudderanalytics} />
  </React.StrictMode>,
);
