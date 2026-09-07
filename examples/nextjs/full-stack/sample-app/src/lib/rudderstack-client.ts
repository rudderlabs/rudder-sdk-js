import type {
  LoadOptions,
  RudderAnalytics,
  RudderAnalyticsPreloader,
} from '@rudderstack/analytics-js';
import { destinationRouting } from './rudderstack-config';
import { getDataPlaneUrlValidationError } from './rudderstack-url';

let initializationPromise: Promise<RudderAnalytics | undefined> | undefined;

export function getBrowserAnalytics(): RudderAnalytics | RudderAnalyticsPreloader | undefined {
  const writeKey = process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY;
  const dataPlaneUrl = process.env.NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL;

  if (typeof window === 'undefined' || !writeKey || !dataPlaneUrl) {
    return undefined;
  }

  const validationError = getDataPlaneUrlValidationError(dataPlaneUrl);
  if (validationError) {
    console.error(`NEXT_PUBLIC_RUDDERSTACK_DATAPLANE_URL ${validationError}`);
    return undefined;
  }

  if (!initializationPromise) {
    initializationPromise = initializeBrowserAnalytics(writeKey, dataPlaneUrl).catch(error => {
      initializationPromise = undefined;
      console.error('Failed to initialize the RudderStack JavaScript SDK.', error);
      return undefined;
    });
  }

  return window.rudderanalytics;
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
