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
  PAGE = 'page',
  TRACK = 'track',
  IDENTIFY = 'identify',
  ALIAS = 'alias',
  GROUP = 'group',
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
  traits?: ApiObject;
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
  userId?: Nullable<string>;
  anonymousId: string;
  channel: string;
  context: RudderContext;
  originalTimestamp: string;
  sentAt?: string;
  integrations: IntegrationOpts;
  messageId: string;
  properties?: ApiObject; // track & page
  event: string; // track
  name?: string; // page
  category?: string; // page
  traits?: ApiObject; // group
  groupId?: Nullable<string>; // group
  previousId: string; // alias
};

export interface IEventManager {
  init(): void;
  addEvent(event: APIEvent): void;
}
