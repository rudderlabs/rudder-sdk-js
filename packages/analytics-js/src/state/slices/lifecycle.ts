import { signal } from '@preact/signals-core';
import type { LifecycleState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { POST_LOAD_LOG_LEVEL } from '../../services/Logger';
import { DEFAULT_INTEGRATION_SDKS_URL, DEFAULT_PLUGINS_URL } from '../../constants/urls';

const lifecycleState: LifecycleState = {
  activeDataplaneUrl: signal(undefined),
  integrationsCDNPath: signal(DEFAULT_INTEGRATION_SDKS_URL),
  pluginsCDNPath: signal(DEFAULT_PLUGINS_URL),
  sourceConfigUrl: signal(undefined),
  status: signal(undefined),
  initialized: signal(false),
  logLevel: signal(POST_LOAD_LOG_LEVEL),
  loaded: signal(false),
  readyCallbacks: signal([]),
  writeKey: signal(undefined),
  dataPlaneUrl: signal(undefined),
  safeAnalyticsInstance: signal(undefined),
};

export { lifecycleState };
