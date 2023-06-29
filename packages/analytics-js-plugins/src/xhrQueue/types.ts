import { RudderEvent } from '@rudderstack/common/types/Event';

export type XHRQueueItem = {
  url: string;
  headers: Record<string, string>;
  event: RudderEvent;
};
