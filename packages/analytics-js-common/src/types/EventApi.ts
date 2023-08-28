import { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';

// TODO: should we take the types from IdentifyTrait instead of any string key?
//  https://www.rudderstack.com/docs/event-spec/standard-events/identify/#identify-traits
export type Traits = Nullable<ApiObject>;

export type ApiCallback = (data?: any) => void;
/**
 * Represents the options parameter in the APIs
 */
export type ApiOptions = {
  integrations?: IntegrationOpts;
  anonymousId?: string;
  // ISO 8601 date string
  originalTimestamp?: string;
  // Merged with event's contextual information
  [index: string]:
    | string
    | number
    | boolean
    | ApiObject
    | null
    | (string | number | boolean | ApiObject)[]
    | undefined;
};

export type APIEvent = {
  type: RudderEventType;
  category?: string;
  name?: string;
  properties?: Nullable<ApiObject>;
  options?: Nullable<ApiOptions>;
  callback?: () => void;
  userId?: Nullable<string>;
  traits?: Nullable<ApiObject>;
  to?: Nullable<string>;
  from?: string;
  groupId?: Nullable<string>;
};

export enum RudderEventType {
  Page = 'page',
  Track = 'track',
  Identify = 'identify',
  Alias = 'alias',
  Group = 'group',
}

export type ReadyCallback = () => void;
