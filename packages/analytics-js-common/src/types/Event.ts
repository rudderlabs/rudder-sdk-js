import type { ApiCallback, ResetOptions, RudderEventType, Traits } from './EventApi';
import type { Nullable } from './Nullable';
import type { ConsentManagement, ConsentOptions } from './Consent';
import type { AppInfo, LibraryInfo, OSInfo, ScreenInfo, UTMParameters } from './EventContext';
import type { IntegrationOpts } from './Integration';
import type { ApiObject } from './ApiObject';
import type { CustomContext, InputCustomContext } from './CustomContext';
import type { RSACustomIntegration } from './IRudderAnalytics';
import type {
  AliasCallOptions,
  GroupCallOptions,
  IdentifyCallOptions,
  PageCallOptions,
  TrackCallOptions,
} from '../utilities/eventMethodOverloads';

export type BufferedEvent =
  | ['setCustomContext', InputCustomContext]
  | ['clearCustomContext']
  | ['ready', ApiCallback]
  | ['page', PageCallOptions, CustomContext?]
  | ['track', TrackCallOptions, CustomContext?]
  | ['identify', IdentifyCallOptions, CustomContext?]
  | ['alias', AliasCallOptions, CustomContext?]
  | ['group', GroupCallOptions, CustomContext?]
  | ['reset', ResetOptions | boolean | undefined]
  | ['setAnonymousId', string | undefined, string | undefined]
  | ['startSession', number | undefined]
  | ['endSession']
  | ['consent', ConsentOptions | undefined]
  | ['addCustomIntegration', string, RSACustomIntegration];

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

export type RSAEvent = {
  message: RudderEvent;
};
