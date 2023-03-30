export type RudderEventType = 'page' | 'track' | 'identify' | 'alias' | 'group';

export type RudderEvent = {
  type: RudderEventType;
  category?: string;
  name?: string;
  properties?: any;
  options?: any;
  callback?: () => void;
  userId?: string;
  traits?: any;
  to?: string;
  from?: string;
  groupId?: string;
};

class EventManager {
  init() {}

  addEvent(event: RudderEvent) {
    console.log(`New event to add: ${event}`);
  }
}

const defaultEventManager = new EventManager();

export { EventManager, defaultEventManager };
