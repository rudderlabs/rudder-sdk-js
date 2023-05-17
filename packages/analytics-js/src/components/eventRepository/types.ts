import { ApiCallback } from '@rudderstack/analytics-js/state/types';
import { RudderEvent } from '../eventManager/types';

interface IEventRepository {
  init(): void;
  enqueue(event: RudderEvent, callback?: ApiCallback): void;
}

export type { IEventRepository };
