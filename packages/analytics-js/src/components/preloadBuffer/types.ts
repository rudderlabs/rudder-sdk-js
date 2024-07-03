export type PreloadedEventCall = Array<string | any>;

export type RudderAnalyticsPreloader = {
  [index: string]: (...args: any[]) => any;
};
