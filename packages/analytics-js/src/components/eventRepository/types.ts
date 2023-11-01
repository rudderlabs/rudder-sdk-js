import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { ApiCallback } from '@rudderstack/analytics-js-common/types/EventApi';

interface IEventRepository {
  init(): void;
  enqueue(event: RudderEvent, callback?: ApiCallback): void;
  resume(): void;
}

export type { IEventRepository };
