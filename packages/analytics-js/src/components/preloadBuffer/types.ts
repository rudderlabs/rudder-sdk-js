export type PreloadedEventCall = Array<string | any>;

export type RudderAnalyticsPreloader = {
  [index: string]: (...args: number[]) => any;
};
