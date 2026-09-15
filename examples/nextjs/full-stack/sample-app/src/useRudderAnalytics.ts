import { useEffect, useState } from 'react';
import type {
  LoadOptions,
  RudderAnalytics,
  RudderAnalyticsPreloader,
} from '@rudderstack/analytics-js';
import { destinationRouting } from '@/lib/rudderstack-config';
import { getDataPlaneUrlValidationError } from '@/lib/rudderstack-url';

let initializationPromise: Promise<RudderAnalytics | undefined> | undefined;

export default function useRudderAnalytics():
  | RudderAnalytics
  | RudderAnalyticsPreloader
  | undefined {
  const [analytics, setAnalytics] = useState<RudderAnalytics>();
  const writeKey = process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY;
  const dataPlaneUrl = process.env.NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL;
  const validationError = dataPlaneUrl ? getDataPlaneUrlValidationError(dataPlaneUrl) : undefined;

  useEffect(() => {
    if (!writeKey || !dataPlaneUrl || analytics) {
      return;
    }

    if (validationError) {
      console.error(`NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL ${validationError}`);
      return;
    }

    let active = true;
    if (!initializationPromise) {
      initializationPromise = initializeBrowserAnalytics(writeKey, dataPlaneUrl).catch(error => {
        // Allow a later mount to retry initialization.
        initializationPromise = undefined;
        console.error('Failed to initialize the RudderStack JavaScript SDK.', error);
        return undefined;
      });
    }

    void initializationPromise.then(instance => {
      if (active && instance) {
        setAnalytics(instance);
      }
    });

    return () => {
      active = false;
    };
  }, [analytics, writeKey, dataPlaneUrl, validationError]);

  if (typeof window === 'undefined' || !writeKey || !dataPlaneUrl || validationError) {
    return undefined;
  }

  return analytics ?? window.rudderanalytics;
}

async function initializeBrowserAnalytics(
  writeKey: string,
  dataPlaneUrl: string,
): Promise<RudderAnalytics> {
  const { RudderAnalytics } = await import('@rudderstack/analytics-js');
  const analytics = new RudderAnalytics();
  const loadOptions: Partial<LoadOptions> = {
    integrations: destinationRouting,
    logLevel: 'DEBUG',
    onLoaded: () => console.log('RudderStack JavaScript SDK loaded.'),
  };

  const configUrl = process.env.NEXT_PUBLIC_RUDDERSTACK_CONFIG_URL;
  if (configUrl) {
    loadOptions.configUrl = configUrl;
  }

  analytics.load(writeKey, dataPlaneUrl, loadOptions);
  return analytics;
}
