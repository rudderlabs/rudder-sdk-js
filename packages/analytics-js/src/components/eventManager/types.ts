import { Nullable } from '@rudderstack/analytics-js/types';
import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';

export type RudderEventType = 'page' | 'track' | 'identify' | 'alias' | 'group';

export type RudderEvent = {
  type: RudderEventType;
  category?: string;
  name?: string;
  properties?: Nullable<ApiObject>;
  options?: Nullable<ApiOptions>;
  callback?: () => void;
  userId?: Nullable<string>;
  traits?: Nullable<ApiObject>;
  to?: string;
  from?: string;
  groupId?: Nullable<string>;
};

export interface IEventManager {
  init: () => void;
  addEvent: (event: RudderEvent) => void;
}
