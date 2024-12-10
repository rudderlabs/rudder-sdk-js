import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { ApiCallback } from '@rudderstack/analytics-js-common/types/EventApi';
import type { IDataPlaneEventsQueue } from '../dataPlaneEventsQueue/types';

interface IEventRepository {
  dataplaneEventsQueue: IDataPlaneEventsQueue;
  init(): void;
  enqueue(event: RudderEvent, callback?: ApiCallback): void;
  resume(): void;
}

export type { IEventRepository };
