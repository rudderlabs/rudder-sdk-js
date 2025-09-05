import { useEffect, useState } from 'react';
import {type LoadOptions, RudderAnalytics, RudderAnalyticsPreloader} from '@rudderstack/analytics-js';

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
          const writeKey = process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY;
          const dataplaneUrl = process.env.NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL;
          const configUrl = process.env.NEXT_PUBLIC_RUDDERSTACK_CONFIG_URL;

          if (!writeKey || !dataplaneUrl) {
            console.error(`
  RudderStack configuration is missing. Please follow these steps:
  1. Create a .env file in the repository root directory with valid values:
     WRITE_KEY=your_write_key
     DATAPLANE_URL=your_dataplane_url
   CONFIG_SERVER_HOST=your_config_server_host
  2. Run the setup script to configure all examples:
     ./scripts/setup-examples-env.sh
  `);
            return undefined;
          }

          const { RudderAnalytics } = await import('@rudderstack/analytics-js');
          const analyticsInstance = new RudderAnalytics();

          // Build SDK configuration
          const loadOptions: Partial<LoadOptions> = {
            onLoaded: () => {
              console.log('RudderStack Analytics is loaded!!!');
            },
          };

          // Add configUrl if provided
          if (configUrl) {
            loadOptions.configUrl = configUrl;
          }

          analyticsInstance.load(writeKey, dataplaneUrl, loadOptions);

          analyticsInstance.ready(() => {
            console.log('RudderStack Analytics is ready!!!');
          });

          return analyticsInstance;
        })();

        const instance = await initializationPromise;
        if (instance) {
          setAnalytics(instance);
        }
      };

      initialize().catch(e => console.error('Error initializing RudderStack Analytics:', e));
    }
  }, [analytics]);

  // Return initialized instance if available, otherwise fallback to window.rudderanalytics
  if (analytics) {
    return analytics;
  }

  return typeof window !== 'undefined' ? window.rudderanalytics : undefined;
};

export default useRudderStackAnalytics;
