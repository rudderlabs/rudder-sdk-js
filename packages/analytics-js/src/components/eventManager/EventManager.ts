import { IEventManager, RudderEvent } from './types';

class EventManager implements IEventManager {
  init() {}

  addEvent(event: RudderEvent) {
    console.log(`New event to add: ${event.type} ${JSON.stringify(event)}`);
  }
}

const defaultEventManager = new EventManager();

export { EventManager, defaultEventManager };
