import { Temp } from './temp';

declare global {
  interface Window {
    rudderAnalyticsMount: () => void;
    rudderAnalyticsBuildType: 'legacy' | 'modern';
    rudderAnalyticsAddScript: (
      url: string,
      extraAttributeKey?: string,
      extraAttributeVal?: string,
    ) => void;
  }
}
