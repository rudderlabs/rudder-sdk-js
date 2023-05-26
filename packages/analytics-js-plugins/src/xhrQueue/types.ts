import { RudderEvent } from '../types/common';

export type XHRQueueItem = {
  url: string;
  headers: Record<string, string>;
  event: RudderEvent;
};
