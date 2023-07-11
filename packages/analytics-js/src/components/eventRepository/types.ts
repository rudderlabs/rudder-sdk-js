import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ApiCallback } from '@rudderstack/analytics-js-common/types/EventApi';

interface IEventRepository {
  init(): void;
  enqueue(event: RudderEvent, callback?: ApiCallback): void;
}

export type { IEventRepository };
