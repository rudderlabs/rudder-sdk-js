import { signal } from '@preact/signals-core';
import { LifecycleState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { DEST_SDK_BASE_URL, PLUGINS_BASE_URL } from '../../constants/urls';

const lifecycleState: LifecycleState = {
  activeDataplaneUrl: signal(undefined),
  integrationsCDNPath: signal(DEST_SDK_BASE_URL),
  pluginsCDNPath: signal(PLUGINS_BASE_URL),
  sourceConfigUrl: signal(undefined),
  status: signal(undefined),
  initialized: signal(false),
  logLevel: signal('ERROR'),
  loaded: signal(false),
  readyCallbacks: signal([]),
  writeKey: signal(undefined),
  dataPlaneUrl: signal(undefined),
};

export { lifecycleState };
