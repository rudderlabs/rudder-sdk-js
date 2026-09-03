import type {
  LoadOptions,
  RudderAnalytics,
  RudderAnalyticsPreloader,
} from '@rudderstack/analytics-js';
import { destinationRouting } from './rudderstack-config';

let initializationPromise: Promise<RudderAnalytics | undefined> | undefined;

export function getBrowserAnalytics(): RudderAnalytics | RudderAnalyticsPreloader | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (!initializationPromise) {
    initializationPromise = initializeBrowserAnalytics().catch(error => {
      initializationPromise = undefined;
      console.error('Failed to initialize the RudderStack JavaScript SDK.', error);
      return undefined;
    });
  }

  return window.rudderanalytics;
}

async function initializeBrowserAnalytics(): Promise<RudderAnalytics | undefined> {
  const writeKey = process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY;
  const dataPlaneUrl = process.env.NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL;

  if (!writeKey || !dataPlaneUrl) {
    console.error(
      'Missing NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY or NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL.',
    );
    return undefined;
  }

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
