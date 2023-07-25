import { signal } from '@preact/signals-core';
import { DEST_SDK_BASE_URL, PLUGINS_BASE_URL } from '@rudderstack/analytics-js/constants/urls';
import { LifecycleState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { LogLevel } from '@rudderstack/analytics-js-common/types/Logger';

const lifecycleState: LifecycleState = {
  activeDataplaneUrl: signal(undefined),
  integrationsCDNPath: signal(DEST_SDK_BASE_URL),
  pluginsCDNPath: signal(PLUGINS_BASE_URL),
  sourceConfigUrl: signal(undefined),
  status: signal(undefined),
  initialized: signal(false),
  logLevel: signal(LogLevel.Error),
  loaded: signal(false),
  readyCallbacks: signal([]),
  writeKey: signal(undefined),
  dataPlaneUrl: signal(undefined),
};

export { lifecycleState };
