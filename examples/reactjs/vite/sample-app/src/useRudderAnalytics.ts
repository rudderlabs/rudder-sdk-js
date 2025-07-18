import { useEffect, useState } from 'react';
import { RudderAnalytics, type RudderAnalyticsPreloader } from '@rudderstack/analytics-js';

// Shared initialization promise
let initializationPromise: Promise<RudderAnalytics | RudderAnalyticsPreloader | undefined> | null =
  null;

const useRudderAnalytics = (): RudderAnalytics | RudderAnalyticsPreloader | undefined => {
  const [analytics, setAnalytics] = useState<RudderAnalytics | RudderAnalyticsPreloader>();

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

          const writeKey = import.meta.env.VITE_RUDDERSTACK_WRITE_KEY;
          const dataplaneUrl = import.meta.env.VITE_RUDDERSTACK_DATAPLANE_URL;

          if (!writeKey || !dataplaneUrl) {
            console.error(`
RudderStack configuration is missing. Please follow these steps:
1. Create a .env file in the repository root directory with valid values:
   WRITE_KEY=your_write_key
   DATAPLANE_URL=your_dataplane_url
2. Run the setup script to configure all examples:
   ./scripts/setup-examples-env.sh
3. Restart your development server after updating environment variables
`);
            return undefined;
          }

          // Load the SDK with the configuration
          analyticsInstance.load(writeKey, dataplaneUrl, {
            onLoaded: () => {
              console.log('RudderStack Analytics loaded!!!');
            },
          });

          // Register a callback that will run when the SDK is ready
          analyticsInstance.ready(() => {
            console.log('RudderStack Analytics ready!!!');
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

  // Make sure we only return an instance that's an actual RudderAnalytics instance
  return typeof window !== 'undefined' ? window.rudderanalytics : undefined;
};

export default useRudderAnalytics;
