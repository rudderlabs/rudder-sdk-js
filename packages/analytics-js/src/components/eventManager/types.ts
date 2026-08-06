import type { APIEvent } from '@rudderstack/analytics-js-common/types/EventApi';
import type { CustomContext } from '@rudderstack/analytics-js-common/types/CustomContext';

export interface IEventManager {
  init(): void;
  addEvent(event: APIEvent, customContext: CustomContext): void;
  resume(): void;
}
