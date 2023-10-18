import type { Signal } from '@preact/signals-core';
import type { PluginName } from './PluginsManager';
import type { Nullable } from './Nullable';
import type { AppInfo, LibraryInfo, OSInfo, ScreenInfo } from './EventContext';
import type { ApiCallback, ReadyCallback, Traits } from './EventApi';
import type { BufferedEvent } from './Event';
import type { LifecycleStatus } from './ApplicationLifecycle';
import type { LogLevel } from './Logger';
import type { LoadOptions, PreConsentOptions } from './LoadOptions';
import type { Destination } from './Destination';
import type { IntegrationOpts } from './Integration';
import type { SessionInfo } from './Session';
import type { Source } from './Source';
import type { ApiObject } from './ApiObject';
import type { ConsentsInfo } from './Consent';
import type { StorageType, CookieOptions } from './Storage';
import type { UserSessionKeys } from './userSessionStorageKeys';

export type CapabilitiesState = {
  isOnline: Signal<boolean>;
  storage: {
    isLocalStorageAvailable: Signal<boolean>;
    isCookieStorageAvailable: Signal<boolean>;
    isSessionStorageAvailable: Signal<boolean>;
  };
  isBeaconAvailable: Signal<boolean>;
  isLegacyDOM: Signal<boolean>;
  isUaCHAvailable: Signal<boolean>;
  isCryptoAvailable: Signal<boolean>;
  isIE11: Signal<boolean>;
  isAdBlocked: Signal<boolean>;
};

export type ConsentsState = {
  data: Signal<ConsentsInfo>;
  initialized: Signal<boolean>;
  activeConsentManagerPluginName: Signal<PluginName | undefined>;
  preConsent: Signal<PreConsentOptions>;
};

export type ContextState = {
  app: Signal<AppInfo>;
  traits: Signal<Nullable<Traits>>;
  library: Signal<LibraryInfo>;
  userAgent: Signal<Nullable<string>>;
  device: Signal<Nullable<any>>; // TODO: is this used at all?
  network: Signal<Nullable<any>>; // TODO: is this used at all?
  os: Signal<OSInfo>; // TODO: is this used at all?
  locale: Signal<Nullable<string>>;
  screen: Signal<ScreenInfo>;
  'ua-ch': Signal<UADataValues | undefined>;
};

export type EventBufferState = {
  // TODO: make this a BufferQueue?
  toBeProcessedArray: Signal<BufferedEvent[]>;
  // TODO: make this a BufferQueue?
  readyCallbacksArray: Signal<ApiCallback[]>;
};

export type LifecycleState = {
  activeDataplaneUrl: Signal<string | undefined>;
  integrationsCDNPath: Signal<string | undefined>;
  pluginsCDNPath: Signal<string | undefined>;
  sourceConfigUrl: Signal<string | undefined>;
  status: Signal<LifecycleStatus | undefined>;
  initialized: Signal<boolean>;
  logLevel: Signal<LogLevel>;
  loaded: Signal<boolean>;
  readyCallbacks: Signal<ReadyCallback[]>;
  writeKey: Signal<string | undefined>;
  dataPlaneUrl: Signal<string | undefined>;
};

export type LoadOptionsState = Signal<LoadOptions>;

// TODO: define the metrics that we need to track
export type MetricsState = {
  retries: Signal<number>;
  dropped: Signal<number>;
  sent: Signal<number>;
  queued: Signal<number>;
  triggered: Signal<number>;
};

export type NativeDestinationsState = {
  configuredDestinations: Signal<Destination[]>;
  activeDestinations: Signal<Destination[]>;
  loadOnlyIntegrations: Signal<IntegrationOpts>;
  failedDestinations: Signal<Destination[]>;
  loadIntegration: Signal<boolean>;
  initializedDestinations: Signal<Destination[]>;
  clientDestinationsReady: Signal<boolean>;
  integrationsConfig: Signal<IntegrationOpts>;
};

export type PluginsState = {
  ready: Signal<boolean>;
  loadedPlugins: Signal<string[]>;
  failedPlugins: Signal<string[]>;
  pluginsToLoadFromConfig: Signal<string[]>;
  activePlugins: Signal<string[]>;
  totalPluginsToLoad: Signal<number>;
};

export type ReportingState = {
  isErrorReportingEnabled: Signal<boolean>;
  isMetricsReportingEnabled: Signal<boolean>;
  errorReportingProviderPluginName: Signal<PluginName | undefined>;
};

export type SessionState = {
  readonly userId: Signal<Nullable<string> | undefined>;
  readonly userTraits: Signal<Nullable<ApiObject> | undefined>;
  readonly anonymousId: Signal<string | undefined>;
  readonly groupId: Signal<Nullable<string> | undefined>;
  readonly groupTraits: Signal<Nullable<ApiObject> | undefined>;
  readonly initialReferrer: Signal<string | undefined>;
  readonly initialReferringDomain: Signal<string | undefined>;
  readonly sessionInfo: Signal<SessionInfo>;
  readonly authToken: Signal<Nullable<string>>;
};

export type SourceConfigState = Signal<Source | undefined>;

export type StorageEntry = {
  type: StorageType;
  key: string;
};
export type StorageEntries = {
  [key in UserSessionKeys]?: StorageEntry;
};

export type StorageState = {
  encryptionPluginName: Signal<PluginName | undefined>;
  migrate: Signal<boolean>;
  type: Signal<StorageType | undefined>;
  cookie: Signal<CookieOptions | undefined>;
  entries: Signal<StorageEntries>;
  trulyAnonymousTracking: Signal<boolean>;
};

export interface ApplicationState {
  capabilities: CapabilitiesState;
  consents: ConsentsState;
  context: ContextState;
  eventBuffer: EventBufferState;
  lifecycle: LifecycleState;
  loadOptions: LoadOptionsState;
  metrics: MetricsState;
  nativeDestinations: NativeDestinationsState;
  plugins: PluginsState;
  reporting: ReportingState;
  session: SessionState;
  source: SourceConfigState;
  storage: StorageState;
}

export type DebouncedFunction = (...args: any[]) => void;
