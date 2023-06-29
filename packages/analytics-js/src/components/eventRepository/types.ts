import { RudderEvent } from '@rudderstack/common/types/Event';
import { ApiCallback } from '@rudderstack/common/types/EventApi';

interface IEventRepository {
  init(): void;
  enqueue(event: RudderEvent, callback?: ApiCallback): void;
}

export type { IEventRepository };
