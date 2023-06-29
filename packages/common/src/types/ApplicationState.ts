import { Signal } from '@preact/signals-core';
import { PluginName } from '@rudderstack/common/types/PluginsManager';
import { Nullable } from '@rudderstack/common/types/Nullable';
import {
  AppInfo,
  LibraryInfo,
  OSInfo,
  ScreenInfo,
  UTMParameters,
} from '@rudderstack/common/types/EventContext';
import { ApiCallback, ReadyCallback, Traits } from '@rudderstack/common/types/EventApi';
import { BufferedEvent } from '@rudderstack/common/types/Event';
import { LifecycleStatus } from '@rudderstack/common/types/ApplicationLifecycle';
import { LogLevel } from '@rudderstack/common/types/Logger';
import { LoadOptions } from '@rudderstack/common/types/LoadOptions';
import { Destination } from '@rudderstack/common/types/Destination';
import { IntegrationOpts } from '@rudderstack/common/types/Integration';
import { SessionInfo } from '@rudderstack/common/types/Session';
import { Source } from '@rudderstack/common/types/Source';
import { ApiObject } from '@rudderstack/common/types/ApiObject';

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
  deniedConsentIds: Signal<string[]>;
  allowedConsents: Signal<Record<string, string>>;
  activeConsentProviderPluginName: Signal<PluginName | undefined>;
  consentProviderInitialized: Signal<boolean>;
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
  campaign: Signal<UTMParameters>;
};

export type EventBufferState = {
  // TODO: make this a BufferQueue?
  toBeProcessedArray: Signal<BufferedEvent[]>;
  // TODO: add proper types for array items instead of any
  toBeProcessedByIntegrationArray: Signal<any[]>;
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

export type PagePropertiesState = {
  readonly path: Signal<string>;
  readonly referrer: Signal<string>;
  readonly referring_domain: Signal<string>;
  readonly search: Signal<string>;
  readonly title: Signal<string>;
  readonly url: Signal<string>;
  readonly tab_url: Signal<string>;
  readonly [index: string]: Signal<string | undefined>;
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
  errorReportingProviderPlugin: Signal<PluginName | undefined>;
};

export type SessionState = {
  readonly userId: Signal<Nullable<string> | undefined>;
  readonly userTraits: Signal<Nullable<ApiObject> | undefined>;
  readonly anonymousUserId: Signal<string | undefined>;
  readonly groupId: Signal<Nullable<string> | undefined>;
  readonly groupTraits: Signal<Nullable<ApiObject> | undefined>;
  readonly initialReferrer: Signal<string | undefined>;
  readonly initialReferringDomain: Signal<string | undefined>;
  readonly sessionInfo: Signal<SessionInfo>;
};

export type SourceConfigState = Signal<Source | undefined>;

export interface ApplicationState {
  capabilities: CapabilitiesState;
  consents: ConsentsState;
  context: ContextState;
  eventBuffer: EventBufferState;
  lifecycle: LifecycleState;
  loadOptions: LoadOptionsState;
  metrics: MetricsState;
  nativeDestinations: NativeDestinationsState;
  page: PagePropertiesState;
  plugins: PluginsState;
  reporting: ReportingState;
  session: SessionState;
  source: SourceConfigState;
}
