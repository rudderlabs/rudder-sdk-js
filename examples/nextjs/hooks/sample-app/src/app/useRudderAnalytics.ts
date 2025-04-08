import { useEffect, useState } from 'react';
import type { RudderAnalytics, RudderAnalyticsPreloader } from '@rudderstack/analytics-js';

const useRudderStackAnalytics = (): RudderAnalytics | RudderAnalyticsPreloader | undefined => {
  const [analytics, setAnalytics] = useState<RudderAnalytics | RudderAnalyticsPreloader>();

  useEffect(() => {
    if (!analytics) {
      const initialize = async () => {
        const { RudderAnalytics } = await import('@rudderstack/analytics-js');
        const analyticsInstance = new RudderAnalytics();

        analyticsInstance.load('<writeKey>', '<dataplaneUrl>');

        analyticsInstance.ready(() => {
          console.log('We are all set!!!');
        });

        setAnalytics(analyticsInstance);
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
