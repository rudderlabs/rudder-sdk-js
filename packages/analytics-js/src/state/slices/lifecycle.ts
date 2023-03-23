import { signal, Signal } from '@preact/signals-core';
import {
  CONFIG_URL,
  DEST_SDK_BASE_URL,
  PLUGINS_BASE_URL,
} from '@rudderstack/analytics-js/constants/urls';
import { LogLevel } from '@rudderstack/analytics-js/components/core/IAnalytics';

// TODO: make enum
export type LifecycleStatus =
  | 'mounted'
  | 'init'
  | 'configured'
  | 'pluginsReady'
  | 'loaded'
  | 'integrationsReady'
  | 'ready';

export type ReadyCallback = () => void;

export type LifecycleState = {
  activeDataplaneUrl: Signal<string | undefined>;
  integrationsCDNPath: Signal<string | undefined>;
  pluginsCDNPath: Signal<string | undefined>;
  sourceConfigUrl: Signal<string | undefined>;
  status: Signal<LifecycleStatus>;
  isStaging: Signal<boolean>;
  initialized: Signal<boolean>;
  logLevel: Signal<LogLevel>;
  loaded: Signal<boolean>;
  readyCallbacks: Signal<ReadyCallback[]>;
};

const lifecycleState: LifecycleState = {
  activeDataplaneUrl: signal(undefined),
  integrationsCDNPath: signal(DEST_SDK_BASE_URL),
  pluginsCDNPath: signal(PLUGINS_BASE_URL),
  sourceConfigUrl: signal(CONFIG_URL),
  status: signal('mounted'),
  isStaging: signal(false),
  initialized: signal(false),
  logLevel: signal('ERROR'),
  loaded: signal(false),
  readyCallbacks: signal([]),
};

export { lifecycleState };
