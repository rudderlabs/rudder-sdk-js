import { signal } from '@preact/signals-core';
import { clone } from 'ramda';
import {
  CookieSameSite,
  LoadOptions,
  UaChTrackLevel,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import { LogLevel } from '@rudderstack/analytics-js-common/types/Logger';
import { LoadOptionsState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import {
  DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS,
  DEFAULT_SESSION_TIMEOUT_MS,
} from '../../constants/timeouts';
import { DEFAULT_CONFIG_BE_URL } from '../../constants/urls';
import { DEFAULT_STORAGE_ENCRYPTION_VERSION } from '../../components/configManager/constants';

const defaultLoadOptions: LoadOptions = {
  logLevel: LogLevel.Error,
  configUrl: DEFAULT_CONFIG_BE_URL,
  loadIntegration: true,
  sessions: {
    autoTrack: true,
    timeout: DEFAULT_SESSION_TIMEOUT_MS,
  },
  sameSiteCookie: CookieSameSite.Lax,
  polyfillIfRequired: true,
  integrations: { All: true },
  useBeacon: false,
  lockIntegrationsVersion: false,
  uaChTrackLevel: UaChTrackLevel.None,
  plugins: [],
  useGlobalIntegrationsConfigInEvents: false,
  bufferDataPlaneEventsUntilReady: false,
  dataPlaneEventsBufferTimeout: DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS,
  storage: {
    encryption: {
      version: DEFAULT_STORAGE_ENCRYPTION_VERSION,
    },
    migrate: false,
  },
};

const loadOptionsState: LoadOptionsState = signal(clone(defaultLoadOptions));

export { loadOptionsState };
