import { state } from '@rudderstack/analytics-js/state';
import { IEventManager, RudderEvent } from './types';

class EventManager implements IEventManager {
  init() {
    // TODO: add eventManager and set status.value = 'initialized';
    //  once eventManager event repository is ready in order to start enqueueing any events
    state.lifecycle.status.value = 'initialized';
  }

  addEvent(event: RudderEvent) {
    console.log(`New event to add: ${event.type} ${JSON.stringify(event)}`);
  }
}

const defaultEventManager = new EventManager();

export { EventManager, defaultEventManager };
