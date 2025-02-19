import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';

export type SingleEventData = {
  url: string;
  headers: Record<string, string>;
  event: RudderEvent;
};

export type BatchData = SingleEventData[];

export type EventsQueueItemData = SingleEventData | BatchData;

export type BatchPayload = {
  batch: RudderEvent[];
  sentAt: string;
};

export interface IDataPlaneEventsQueue {
  logger: ILogger;
  enqueue(event: RudderEvent): void;
  start(): void;
  stop(): void;
  clear(): void;
  isRunning(): boolean;
}
