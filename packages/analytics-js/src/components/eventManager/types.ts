import { Nullable } from '@rudderstack/analytics-js/types';
import {
  ApiObject,
  ApiOptions,
  AppInfo,
  ConsentManagement,
  IntegrationOpts,
  LibraryInfo,
  OSInfo,
  UTMParameters,
} from '@rudderstack/analytics-js/state/types';
import { ScreenInfo } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/screen';

export enum RudderEventType {
  Page = 'page',
  Track = 'track',
  Identify = 'identify',
  Alias = 'alias',
  Group = 'group',
}

export type APIEvent = {
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

export type RudderContext = {
  [index: string]:
    | string
    | number
    | boolean
    | ApiObject
    | UADataValues
    | Nullable<string>
    | (string | number | boolean | ApiObject)[]
    | undefined;
  traits?: Nullable<ApiObject>;
  sessionId?: number;
  sessionStart?: boolean;
  consentManagement?: ConsentManagement;
  'ua-ch'?: UADataValues;
  app: AppInfo;
  library: LibraryInfo;
  userAgent: Nullable<string>;
  os: OSInfo;
  locale: Nullable<string>;
  screen: ScreenInfo;
  campaign?: UTMParameters;
};

export type RudderEvent = {
  type: RudderEventType;
  channel: string;
  anonymousId: string;
  context: RudderContext;
  originalTimestamp: string;
  integrations: IntegrationOpts;
  messageId: string;
  event?: string; // track
  previousId?: string; // alias
  userId?: Nullable<string>;
  sentAt?: string;
  properties?: Nullable<ApiObject>; // track & page
  name?: Nullable<string>; // page
  category?: Nullable<string>; // page
  traits?: Nullable<ApiObject>; // group
  groupId?: Nullable<string>; // group
};

export interface IEventManager {
  init(): void;
  addEvent(event: APIEvent): void;
}
