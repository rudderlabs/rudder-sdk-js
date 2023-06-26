import { RudderEvent } from '@rudderstack/common/types/common';

export type XHRQueueItem = {
  url: string;
  headers: Record<string, string>;
  event: RudderEvent;
};
