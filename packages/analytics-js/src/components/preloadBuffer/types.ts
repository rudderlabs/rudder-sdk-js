export type PreloadedEventCall = Array<any>;

export type RudderAnalyticsPreloader = {
  [index: string]: (...args: any[]) => any;
};
