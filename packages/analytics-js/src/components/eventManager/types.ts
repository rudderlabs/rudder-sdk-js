import { APIEvent } from '@rudderstack/common/types/EventApi';

export interface IEventManager {
  init(): void;
  addEvent(event: APIEvent): void;
}
