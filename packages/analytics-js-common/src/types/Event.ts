import type { RudderEventType, Traits } from './EventApi';
import type { Nullable } from './Nullable';
import type { ConsentManagement } from './Consent';
import type { AppInfo, LibraryInfo, OSInfo, ScreenInfo, UTMParameters } from './EventContext';
import type { IntegrationOpts } from './Integration';
import type { ApiObject } from './ApiObject';

// TODO: fix type
export type BufferedEvent = any[];

export type PageLifecycle = {
  pageViewId: string; // UUID
};

export type AutoTrack = {
  page: PageLifecycle;
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
  trulyAnonymousTracking?: boolean;
  timezone: string;
  autoTrack?: AutoTrack;
};

export type RudderEvent = {
  type: RudderEventType;
  channel: string;
  anonymousId: string;
  context: RudderContext;
  originalTimestamp: string;
  integrations: IntegrationOpts;
  messageId: string;
  event: Nullable<string>; // track
  previousId?: string; // alias
  userId?: Nullable<string>;
  sentAt?: string;
  properties?: Nullable<ApiObject>; // track & page
  name?: Nullable<string>; // page
  category?: Nullable<string>; // page
  traits?: Traits; // group
  groupId?: Nullable<string>; // group
};

export type RsaEvent = {
  message: RudderEvent;
};
