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

export interface IEventManager {
  init: () => void;
  addEvent: (event: RudderEvent) => void;
}
