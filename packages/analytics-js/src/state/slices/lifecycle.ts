import { signal, Signal } from '@preact/signals-core';
import {
  CONFIG_URL,
  DEST_SDK_BASE_URL,
  PLUGINS_BASE_URL,
} from '@rudderstack/analytics-js/constants/urls';
import { LifecycleStatus, LogLevel, ReadyCallback } from '@rudderstack/analytics-js/state/types';

export type LifecycleState = {
  activeDataplaneUrl: Signal<string | undefined>;
  integrationsCDNPath: Signal<string | undefined>;
  pluginsCDNPath: Signal<string | undefined>;
  sourceConfigUrl: Signal<string>;
  status: Signal<LifecycleStatus>;
  isStaging: Signal<boolean>;
  initialized: Signal<boolean>;
  logLevel: Signal<LogLevel>;
  loaded: Signal<boolean>;
  readyCallbacks: Signal<ReadyCallback[]>;
  writeKey: Signal<string | undefined>;
  dataPlaneUrl: Signal<string | undefined>;
};

const lifecycleState: LifecycleState = {
  activeDataplaneUrl: signal(undefined),
  integrationsCDNPath: signal(DEST_SDK_BASE_URL),
  pluginsCDNPath: signal(PLUGINS_BASE_URL),
  sourceConfigUrl: signal(CONFIG_URL),
  status: signal(undefined),
  isStaging: signal(false),
  initialized: signal(false),
  logLevel: signal('ERROR'),
  loaded: signal(false),
  readyCallbacks: signal([]),
  writeKey: signal(undefined),
  dataPlaneUrl: signal(undefined),
};

export { lifecycleState };
