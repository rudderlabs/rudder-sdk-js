import { useEffect } from 'react';

const useRudderStackAnalytics = () => {
  useEffect(() => {
    if (window.rudderanalytics) {
      return window.rudderanalytics as any;
    }
    const initialize = async () => {
      const Analytics = (await import('@rudderstack/analytics-js/bundled')).RudderAnalytics;
      const analytics = new Analytics();

      analytics.load('<writeKey>', '<dataplaneUrl>');

      analytics.ready(() => {
        console.log('We are all set!!!');
      });

      window.rudderanalytics = analytics;
    };
    initialize();
  }, []);
};

export default useRudderStackAnalytics;
