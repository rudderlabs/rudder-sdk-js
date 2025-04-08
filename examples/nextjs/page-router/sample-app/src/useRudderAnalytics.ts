import { useEffect, useState } from 'react';
import type { RudderAnalytics, RudderAnalyticsPreloader } from '@rudderstack/analytics-js';

// Shared initialization promise
let initializationPromise: Promise<RudderAnalytics | undefined> | null = null;

const useRudderStackAnalytics = (): RudderAnalytics | RudderAnalyticsPreloader | undefined => {
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
          const { RudderAnalytics } = await import('@rudderstack/analytics-js');

          const writeKey = process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY;
          const dataplaneUrl = process.env.NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL;

          if (!writeKey || !dataplaneUrl) {
            console.error(`
  RudderStack configuration is missing. Please follow these steps:
  1. Create a .env file in the root directory with valid values:
     WRITE_KEY=your_write_key
     DATAPLANE_URL=your_dataplane_url
  2. Run the setup script to configure all examples:
     ./scripts/setup-examples-env.sh
  `);
            return undefined;
          }
          
          const analyticsInstance = new RudderAnalytics();

          analyticsInstance.load(writeKey, dataplaneUrl);

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

      initialize().catch(e => console.log(e));
    }
  }, [analytics]);

  // Return initialized instance if available, otherwise fallback to window.rudderanalytics
  if (analytics) {
    return analytics;
  }

  return typeof window !== 'undefined' ? window.rudderanalytics : undefined;
};

export default useRudderStackAnalytics; 
