import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';

export type XHRQueueItem = {
  url: string;
  headers: Record<string, string>;
  event: RudderEvent;
};
