import type {
  IRudderStackGlobals,
  RudderAnalytics,
  PreloadedEventCall,
  RudderAnalyticsPreloader,
} from '../index';

declare global {
  interface Window {
    rudderanalytics: RudderAnalytics | RudderAnalyticsPreloader | undefined;
    RudderStackGlobals: IRudderStackGlobals;
    RudderSnippetVersion?: string;
  }
}
