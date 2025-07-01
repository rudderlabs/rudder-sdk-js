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
          const writeKey = process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY;
          const dataplaneUrl = process.env.NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL;

          if (!writeKey || !dataplaneUrl) {
            console.error(`
  RudderStack configuration is missing. Please follow these steps:
  1. Create a .env file in the repository root directory with valid values:
     WRITE_KEY=your_write_key
     DATAPLANE_URL=your_dataplane_url
  2. Run the setup script to configure all examples:
     ./scripts/setup-examples-env.sh
  `);
            return undefined;
          }

          const { RudderAnalytics } = await import('@rudderstack/analytics-js');
          const analyticsInstance = new RudderAnalytics();

          analyticsInstance.addCustomIntegration('Custom Integration 2', {
            init: (analytics, logger) => {
              logger.debug('"init" called');
            },
            isReady: (analytics, logger) => {
              logger.debug('"isReady" called');

              // Return true when the 3rd party SDK is ready to accept events
              return true;
            },
            page: (analytics, logger, rsEvent) => {
              logger.debug('"page" called', rsEvent);

              // Transform the data from rsEvent to the format expected by the 3rd party SDK
            },
            track: (analytics, logger, rsEvent) => {
              logger.debug('"track" called', rsEvent);

              // Transform the data from rsEvent to the format expected by the 3rd party SDK
            },
            identify: (analytics, logger, rsEvent) => {
              logger.debug('"identify" called', rsEvent);

              // Transform the data from rsEvent to the format expected by the 3rd party SDK
            },
            alias: (analytics, logger, rsEvent) => {
              logger.debug('"alias" called', rsEvent);

              // Transform the data from rsEvent to the format expected by the 3rd party SDK
            },
            group: (analytics, logger, rsEvent) => {
              logger.debug('"group" called', rsEvent);

              // Transform the data from rsEvent to the format expected by the 3rd party SDK
            },
          });

          analyticsInstance.load(writeKey, dataplaneUrl, {
            logLevel: 'DEBUG',
            destSDKBaseURL: 'https://cdn.rudderlabs.com/beta/PR-2309/bb541e7/v3/modern/js-integrations',
            pluginsSDKBaseURL: 'https://cdn.rudderlabs.com/beta/PR-2309/bb541e7/v3/modern/plugins',
            onLoaded: () => {
              console.log('RudderStack Analytics is loaded!!!');
            },
          });

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
