import { APIEvent } from '@rudderstack/analytics-js-common/types/EventApi';

export interface IEventManager {
  init(): void;
  addEvent(event: APIEvent): void;
}
