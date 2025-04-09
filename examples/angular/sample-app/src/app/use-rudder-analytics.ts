import { Injectable } from '@angular/core';
import { RudderAnalytics, type RudderAnalyticsPreloader } from '@rudderstack/analytics-js';

// Shared initialization promise
let initializationPromise: Promise<RudderAnalytics | RudderAnalyticsPreloader | undefined> | null = null;

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

      // Read env variables
      // Note: In Angular, environment variables need to be set up differently
      // and can be accessed via ngEnvironment or window properties
      const writeKey = (window as any).NG_APP_RUDDERSTACK_WRITE_KEY;
      const dataplaneUrl = (window as any).NG_APP_RUDDERSTACK_DATAPLANE_URL;

      if (!writeKey || !dataplaneUrl) {
        console.error(`
RudderStack configuration is missing. Please follow these steps:
1. Create a .env file in the root directory with valid values:
   WRITE_KEY=your_write_key
   DATAPLANE_URL=your_dataplane_url
2. Run the setup script to configure all examples:
   ./scripts/setup-examples-env.sh
3. Restart your development server after updating environment variables
`);
        return undefined;
      }

      const analyticsInstance = new RudderAnalytics();

      // Load the SDK with the configuration
      analyticsInstance.load(writeKey, dataplaneUrl);
      
      // Register a callback that will run when the SDK is ready
      analyticsInstance.ready(() => {
        console.log('We are all set!!!');
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

    return typeof window !== 'undefined' && window.rudderanalytics && 
           !Array.isArray(window.rudderanalytics) ? 
           window.rudderanalytics : undefined;
  }
} 
