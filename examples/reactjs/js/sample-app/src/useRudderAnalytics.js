import { useEffect, useState } from 'react';
import { RudderAnalytics } from '@rudderstack/analytics-js';

// Shared initialization promise
let initializationPromise = null;

const useRudderAnalytics = () => {
  const [analytics, setAnalytics] = useState();

  useEffect(() => {
    if (!analytics) {
      const initialize = async () => {
        // If initialization is already in progress, wait for it
        if (initializationPromise) {
          const instance = await initializationPromise;
          if (instance) {
            setAnalytics(instance);
          }
          return;
        }

        // Start new initialization
        initializationPromise = (async () => {
          const analyticsInstance = new RudderAnalytics();

          const writeKey = process.env.REACT_APP_RUDDERSTACK_WRITE_KEY;
          const dataplaneUrl = process.env.REACT_APP_RUDDERSTACK_DATAPLANE_URL;

          if (!writeKey || !dataplaneUrl) {
            console.error(`
RudderStack configuration is missing. Please follow these steps:
1. Create a .env file in the root directory with valid values:
   REACT_APP_RUDDERSTACK_WRITE_KEY=your_write_key
   REACT_APP_RUDDERSTACK_DATAPLANE_URL=your_dataplane_url
2. Run the setup script to configure all examples:
   ./scripts/setup-examples-env.sh
3. Restart your development server after updating environment variables
`);
            return undefined;
          }

          // Load the SDK with the configuration
          analyticsInstance.load(writeKey, dataplaneUrl);
          
          // Register a callback that will run when the SDK is ready
          analyticsInstance.ready(() => {
            console.log('We are all set!!!');
          });
          
          return analyticsInstance;
        })();

        const instance = await initializationPromise;
        if (instance) {
          setAnalytics(instance);
        }
      };

      initialize().catch(e => console.error('Error initializing RudderStack analytics:', e));
    }
  }, [analytics]);

  // Return initialized instance if available, otherwise fallback to window.rudderanalytics
  if (analytics) {
    return analytics;
  }

  return typeof window !== 'undefined' ? window.rudderanalytics : undefined;
};

export default useRudderAnalytics; 
