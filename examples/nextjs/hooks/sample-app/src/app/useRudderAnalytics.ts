import { useEffect, useState } from 'react';
import { RudderAnalytics } from '@rudderstack/analytics-js';

const useRudderStackAnalytics = (): RudderAnalytics | undefined => {
  const [analytics, setAnalytics] = useState<RudderAnalytics>();

  useEffect(() => {
    if (!analytics) {
      const initialize = async () => {
        const { RudderAnalytics } = await import('@rudderstack/analytics-js/bundled');
        const analyticsInstance = new RudderAnalytics();

        analyticsInstance.load('<writeKey>', '<dataplaneUrl>');

        analyticsInstance.ready(() => {
          console.log('We are all set!!!');
        });

        window.rudderanalytics = analyticsInstance;
        setAnalytics(analyticsInstance);
      };

      initialize().catch(e => console.log(e));
    }
  }, [analytics]);

  return analytics;
};

export default useRudderStackAnalytics;
