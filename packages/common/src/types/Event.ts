import { RudderEventType, Traits } from '@rudderstack/common/types/EventApi';
import { Nullable } from '@rudderstack/common/types/Nullable';
import { ConsentManagement } from '@rudderstack/common/types/Consent';
import {
  AppInfo,
  LibraryInfo,
  OSInfo,
  ScreenInfo,
  UTMParameters,
} from '@rudderstack/common/types/EventContext';
import { IntegrationOpts } from '@rudderstack/common/types/Integration';
import { ApiObject } from '@rudderstack/common/types/ApiObject';

// TODO: fix type
export type BufferedEvent = any[];

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
