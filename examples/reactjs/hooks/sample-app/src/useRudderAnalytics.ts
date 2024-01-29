import { useEffect, useState } from 'react';
import { RudderAnalytics } from '@rudderstack/analytics-js';

const useRudderStackAnalytics = (): RudderAnalytics | undefined => {
  const [analytics, setAnalytics] = useState<RudderAnalytics>();

  useEffect(() => {
    if (!analytics) {
      const analyticsInstance = new RudderAnalytics();
      analyticsInstance.load('<writeKey>', '<dataplaneUrl>');

      analyticsInstance.ready(() => {
        console.log('We are all set!!!');
      });

      setAnalytics(analyticsInstance);
    }
  }, [analytics]);

  return analytics;
};

export default useRudderStackAnalytics;
