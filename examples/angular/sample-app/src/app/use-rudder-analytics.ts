import { Injectable } from '@angular/core';
import { type LoadOptions, RudderAnalytics, type RudderAnalyticsPreloader } from '@rudderstack/analytics-js';
import { environment } from 'src/environments/environment';

// Shared initialization promise
let initializationPromise: Promise<RudderAnalytics | RudderAnalyticsPreloader | undefined> | null =
  null;

@Injectable({
  providedIn: 'root',
})
export class RudderAnalyticsService {
  private analytics: RudderAnalytics | RudderAnalyticsPreloader | undefined;

  constructor() {
    this.initialize();
  }

  initialize(): Promise<RudderAnalytics | RudderAnalyticsPreloader | undefined> {
    // If initialization is already in progress, wait for it
    if (initializationPromise) {
      return initializationPromise;
    }

    // Start new initialization
    initializationPromise = (async () => {
      // If analytics is already initialized, return it
      if (this.analytics) {
        return this.analytics;
      }

      // Get configuration from environment
      const writeKey = environment.RUDDERSTACK_WRITE_KEY;
      const dataplaneUrl = environment.RUDDERSTACK_DATAPLANE_URL;
      const configUrl = environment.RUDDERSTACK_CONFIG_URL;

      if (!writeKey || !dataplaneUrl) {
        console.error(`
RudderStack configuration is missing. Please follow these steps:
1. Create a .env file in the repository root directory with valid values:
   WRITE_KEY=your_write_key
   DATAPLANE_URL=your_dataplane_url
   CONFIG_SERVER_HOST=your_config_server_host
2. Run the setup script to configure all examples:
   ./scripts/setup-examples-env.sh
3. Restart your development server after updating environment variables
`);
        return undefined;
      }

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

      // Load the SDK with the configuration
      analyticsInstance.load(writeKey, dataplaneUrl, loadOptions);

      // Register a callback that will run when the SDK is ready
      analyticsInstance.ready(() => {
        console.log('RudderStack Analytics is ready!!!');
      });

      this.analytics = analyticsInstance;
      return analyticsInstance;
    })();

    return initializationPromise;
  }

  getAnalytics(): RudderAnalytics | RudderAnalyticsPreloader | undefined {
    // Return initialized instance if available, otherwise fallback to window.rudderanalytics
    if (this.analytics) {
      return this.analytics;
    }

    return typeof window !== 'undefined' &&
      window.rudderanalytics &&
      !Array.isArray(window.rudderanalytics)
      ? window.rudderanalytics
      : undefined;
  }
}
